import type {
  Delegate,
  ICache,
  ICachedQuery,
  ILogger,
  IPipelineBehavior,
  ResultType,
} from '@/domain'
import { Result } from '@/domain'
import { Guards } from '@/shared'

/**
 * @description A pipeline behavior that implements caching for query requests in the CQRS architecture. This behavior checks if the incoming request is a query and if it implements the ICachedQuery interface. If so, it attempts to retrieve the response from the cache using the provided cache key. If a cached response is found, it returns it immediately. If not, it delegates control to the next handler in the pipeline to execute the query and retrieve the data from the database. After successfully retrieving the data, it stores the result in the cache with the specified TTL (time-to-live) for future requests. This behavior also includes error handling for cache read/write operations, ensuring that any cache-related errors do not disrupt the normal flow of query execution and that appropriate warnings are logged.

   * 
   * @author Mattia Carcione []
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class QueryCachingPipeline<
  TInput extends ICachedQuery,
  TResult,
> implements IPipelineBehavior<TInput, TResult> {
  /**
   * @description Constructs a new instance of the QueryCachingPipeline class, which requires an ICache implementation for interacting with the cache and an ILogger for logging cache-related operations and errors. The constructor initializes the dependencies needed for the caching behavior to function properly within the CQRS pipeline.
   * @param _cacheService An instance of ICache used for interacting with the cache, including retrieving and storing cached responses based on cache keys.
   * @param _logger An instance of ILogger used for logging cache-related operations, such as cache hits, cache misses, and any errors that occur during cache read/write operations.
  
   * 
   * @author Mattia Carcione {}
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  constructor(
    private readonly _cacheService: ICache,
    private readonly _logger: ILogger,
  ) {}

  public async handle(request: TInput, next: Delegate<TResult>): Promise<ResultType<TResult>> {
    if (Guards.isNullOrEmpty(request.cacheOptions.cacheKey)) return next()

    const bypass =
      request.cacheOptions.bypassCache === true || request.cacheOptions.consistentRead === true

    // 1. Lettura (Cache Hit)
    if (!bypass) {
      try {
        const cachedResponse = await this._cacheService.get<TResult>(request.cacheOptions.cacheKey)
        if (Guards.isDefined(cachedResponse)) {
          this._logger.debug(
            `[Cache HIT] Returning data from cache for: ${request.cacheOptions.cacheKey}`,
          )
          return Result.ok(cachedResponse)
        }
      } catch (error) {
        // If Redis fails, we don't crash the app. Log and proceed to the DB.
        this._logger.warn(
          `[Cache ERROR] Unable to read cache for: ${request.cacheOptions.cacheKey}. Proceeding to DB. Error: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }

    // 2. Cache Miss: Delegate control to the Handler that queries the DB
    const result = await next()

    // 3. Write: If the Handler succeeded, save the result in cache
    if (result.isOk()) {
      try {
        await this._cacheService.set(
          request.cacheOptions.cacheKey,
          result.getValueOrThrow(),
          request.cacheOptions.cacheTtlSeconds,
        )
        this._logger.debug(`[Cache SET] Data saved in cache for: ${request.cacheOptions.cacheKey}`)
      } catch (error) {
        this._logger.warn(
          `[Cache ERROR] Unable to save cache for: ${request.cacheOptions.cacheKey}. Error: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }

    return result
  }
}
