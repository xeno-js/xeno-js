import type { ICachedQuery, IHandler, IQuery } from '@/domain'
import type {
  Guid,
  ICacheableOptions,
  InjectionToken,
  IPaginationParams,
  Optional,
  RequestType,
} from '@/shared'
import {
  Guards,
  GuidHelper,
  PAGINATION_DEFAULTS,
  REQUEST_TYPE,
  SORT_DIRECTION,
  TokenHelper,
} from '@/shared'

/**
 * @fileoverview Defines the Query class, which serves as a base implementation for query requests in a CQRS architecture. The Query class implements the IQuery interface and provides common properties such as the request type, timestamp, and a unique token for identification.
 */

/**
 * A class representing a query request in a CQRS architecture. This class implements the IQuery interface and provides common properties and functionality for all query requests.
 * @template T - The type of the response that the query will return after being handled.
 */
export class Query<T = unknown> implements IQuery<T> {
  /**
   * Constructs a new Query instance with a unique token based on the provided string.
   * @param id A unique identifier for the query request.
   * @param type The type of the request, which should be 'QUERY'.
   * @param token A string used to create a unique token for this query, which can be used for idempotency and tracing purposes.
   * @param timestamp The timestamp when the query is created.
   * @param signal An optional AbortSignal to allow cancellation of the query.
   * @param pagination The pagination parameters for the query, which can include page number, page size, sorting, and filtering options.
   */
  protected constructor(
    public readonly id: Guid,
    public readonly type: RequestType,
    public readonly timestamp: Date,
    public readonly token: InjectionToken<IHandler<IQuery<T>, T>>,
    public readonly signal: Optional<AbortSignal> = undefined,
    public readonly pagination: IPaginationParams,
  ) {}

  /**
   * Static factory method to create a new Query instance with a unique token.
   * @param id A unique identifier for the query request.
   * @param token A string used to create a unique token for this query, which can be used for idempotency and tracing purposes.
   * @param signal An optional AbortSignal to allow cancellation of the query.
   * @param pagination The pagination parameters for the query, which can include page number, page size, sorting, and filtering options.
   *
   * @returns A new instance of the Query class.
   */
  static create<T>(
    id: Guid,
    token: string,
    signal: Optional<AbortSignal> = undefined,
    pagination: IPaginationParams = {
      limit: PAGINATION_DEFAULTS.PAGE,
      offset: PAGINATION_DEFAULTS.PAGE_SIZE,
      orderBy: '',
      sortDirection: SORT_DIRECTION.ASC,
      filters: [],
    },
    ..._args: unknown[]
  ): IQuery<T> {
    if (!GuidHelper.isValid(id)) throw new Error('Invalid ID')

    if (
      (Guards.isDefined(pagination.limit) && pagination.limit < 1) ||
      (Guards.isDefined(pagination.offset) && pagination.offset < 0)
    )
      throw new Error('Limit must be greater than 0 and offset must be non-negative')

    const type = REQUEST_TYPE.QUERY
    const timestamp = new Date()
    const injectionToken = TokenHelper.createToken<IHandler<IQuery<T>, T>>(token)

    return new Query<T>(id, type, timestamp, injectionToken, signal, pagination)
  }
}

/**
 * @description A class representing a cached query request in a CQRS architecture. This class extends the base Query class and implements the ICachedQuery interface, providing additional properties for caching behavior.
 */
export class CachedQuery<T = unknown> extends Query<T> implements ICachedQuery<T> {
  /**
   * Constructs a new CachedQuery instance with caching properties.
   * @param token A string used to create a unique token for this query, which can be used for idempotency and tracing purposes.
   * @param cacheKey A unique key under which to store the result in the cache. Must include parameters (e.g., `travel-intents:tenant-123:page-1`).
   * @param cacheTtlSeconds Time-to-live for the cache entry, in seconds.
   * @param bypassCache Flag to indicate whether to bypass the cache and fetch fresh data.
   * @param id A unique identifier for the query request.
   * @param type The type of the request, which should be 'QUERY'.
   * @param timestamp The timestamp when the query is created.
   * @param token A string used to create a unique token for this query, which can be used for idempotency and tracing purposes.
   * @param signal An optional AbortSignal to allow cancellation of the query.
   * @returns A new instance of the CachedQuery class.
   */
  protected constructor(
    public readonly cacheOptions: ICacheableOptions,
    id: Guid,
    type: RequestType,
    timestamp: Date,
    token: InjectionToken<IHandler<IQuery<T>, T>>,
    signal: Optional<AbortSignal> = undefined,
    pagination: IPaginationParams,
  ) {
    super(id, type, timestamp, token, signal, pagination)
  }

  static override create<T>(
    id: Guid,
    token: string,
    signal: Optional<AbortSignal> = undefined,
    pagination: IPaginationParams = {
      limit: PAGINATION_DEFAULTS.PAGE,
      offset: PAGINATION_DEFAULTS.PAGE_SIZE,
      orderBy: '',
      sortDirection: SORT_DIRECTION.ASC,
      filters: [],
    },
    cacheOptions: ICacheableOptions,
  ): ICachedQuery<T> {
    if (!GuidHelper.isValid(id)) throw new Error('Invalid ID')

    if (
      (Guards.isDefined(pagination.limit) && pagination.limit < 1) ||
      (Guards.isDefined(pagination.offset) && pagination.offset < 0)
    )
      throw new Error('Limit must be greater than 0 and offset must be non-negative')

    if (Guards.isDefined(cacheOptions.cacheTtlSeconds))
      if (cacheOptions.cacheTtlSeconds < 0)
        throw new Error('Cache TTL must be a non-negative number')
      else
        cacheOptions = {
          ...cacheOptions,
          cacheTtlSeconds: 3600,
        }

    const type = REQUEST_TYPE.QUERY
    const timestamp = new Date()
    const injectionToken = TokenHelper.createToken<IHandler<IQuery<T>, T>>(token)

    return new CachedQuery<T>(cacheOptions, id, type, timestamp, injectionToken, signal, pagination)
  }
}
