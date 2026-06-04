import type { IBaseRequest, ICachedQuery, IHandler, IPaginatedQuery, SortDirection } from '@/domain'
import type { Dictionary, Guid, InjectionToken, RequestType } from '@/shared'
import { GuidHelper, REQUEST_TYPE, TokenHelper } from '@/shared'

/**
 * @fileoverview Defines the Query class, which serves as a base implementation for query requests in a CQRS architecture. The Query class implements the IQuery interface and provides common properties such as the request type, timestamp, and a unique token for identification.
 */

/**
 * A class representing a query request in a CQRS architecture. This class implements the IQuery interface and provides common properties and functionality for all query requests.
 * @template T - The type of the response that the query will return after being handled.
 */
export class Query<T = unknown> implements IBaseRequest<T> {
  /**
   * Constructs a new Query instance with a unique token based on the provided string.
   * @param id A unique identifier for the query request.
   * @param type The type of the request, which should be 'QUERY'.
   * @param token A string used to create a unique token for this query, which can be used for idempotency and tracing purposes.
   * @param timestamp The timestamp when the query is created.
   */
  protected constructor(
    public readonly id: Guid,
    public readonly type: RequestType,
    public readonly timestamp: Date,
    public readonly token: InjectionToken<IHandler<IBaseRequest<T>, T>>,
  ) {}

  /**
   * Static factory method to create a new Query instance with a unique token.
   * @param token A string used to create a unique token for this query, which can be used for idempotency and tracing purposes.
   * @returns A new instance of the Query class.
   */
  static create<T>(token: string, ..._args: unknown[]): IBaseRequest<T> {
    const id = GuidHelper.generate()
    const type = REQUEST_TYPE.QUERY
    const timestamp = new Date()
    const injectionToken = TokenHelper.createToken<IHandler<IBaseRequest<T>, T>>(token)

    return new Query<T>(id, type, timestamp, injectionToken)
  }
}

/**
 * @description A class representing a paginated query request in a CQRS architecture. This class extends the base Query class and implements the IPaginatedQuery interface, providing additional properties for pagination, sorting, and filtering.
 */
export class PaginatedQuery<T = unknown> extends Query<T> implements IPaginatedQuery<T> {
  /**
   * Constructs a new PaginatedQuery instance with pagination properties.
   * @param token A string used to create a unique token for this query, which can be used for idempotency and tracing purposes.
   * @param page The page number to retrieve (optional).
   * @param pageSize The number of items per page (optional).
   * @param sortBy The field by which to sort the results (optional).
   * @param sortDirection The direction of sorting, either 'asc' or 'desc' (optional).
   * @param filters A dictionary of filters to apply to the query (optional).
   * @param id A unique identifier for the query request.
   * @param type The type of the request, which should be 'QUERY'.
   * @param timestamp The timestamp when the query is created.
   * @param token A string used to create a unique token for this query, which can be used for idempotency and tracing purposes.
   * @return A new instance of the PaginatedQuery class.
   */
  protected constructor(
    public readonly page: number,
    public readonly pageSize: number,
    public readonly sortBy: string,
    public readonly sortDirection: SortDirection,
    public readonly filters: Readonly<Dictionary<unknown>>,
    id: Guid,
    type: RequestType,
    timestamp: Date,
    token: InjectionToken<IHandler<IBaseRequest<T>, T>>,
  ) {
    super(id, type, timestamp, token)
  }

  static override create<T>(
    token: string,
    page = 1,
    pageSize = 10,
    sortBy = '',
    sortDirection: SortDirection = 'asc',
    filters: Readonly<Dictionary<unknown>> = {},
  ): IPaginatedQuery<T> {
    if (page < 1 || pageSize < 1) {
      throw new Error('Page and Page size number must be greater than 0')
    }

    const id = GuidHelper.generate()
    const type = REQUEST_TYPE.QUERY
    const timestamp = new Date()
    const injectionToken = TokenHelper.createToken<IHandler<IBaseRequest<T>, T>>(token)

    return new PaginatedQuery<T>(
      page,
      pageSize,
      sortBy,
      sortDirection,
      filters,
      id,
      type,
      timestamp,
      injectionToken,
    )
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
   * @returns A new instance of the CachedQuery class.
   */
  protected constructor(
    public readonly cacheKey: string,
    public readonly cacheTtlSeconds: number,
    public readonly bypassCache: boolean,
    id: Guid,
    type: RequestType,
    timestamp: Date,
    token: InjectionToken<IHandler<IBaseRequest<T>, T>>,
  ) {
    super(id, type, timestamp, token)
  }

  static override create<T>(
    token: string,
    cacheKey: string,
    cacheTtlSeconds = 3600,
    bypassCache = false,
  ): ICachedQuery<T> {
    if (cacheTtlSeconds < 0) {
      throw new Error('Cache TTL must be a non-negative number')
    }

    const id = GuidHelper.generate()
    const type = REQUEST_TYPE.QUERY
    const timestamp = new Date()
    const injectionToken = TokenHelper.createToken<IHandler<IBaseRequest<T>, T>>(token)

    return new CachedQuery<T>(
      cacheKey,
      cacheTtlSeconds,
      bypassCache,
      id,
      type,
      timestamp,
      injectionToken,
    )
  }
}
