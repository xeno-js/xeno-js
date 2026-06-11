import { BaseRequest } from '@/application'
import type {
  Dictionary,
  Guid,
  ICacheableOptions,
  ICachedQuery,
  IPaginationParams,
  IQuery,
  Optional,
} from '@/shared'
import { REQUEST_TYPE } from '@/shared'

/**
 * @fileoverview Defines the Query class, which serves as a base implementation for query requests in a CQRS architecture. The Query class implements the IQuery interface and provides common properties such as the request type, timestamp, and a unique token for identification.
 */

/**
 * A class representing a query request in a CQRS architecture. This class implements the IQuery interface and provides common properties and functionality for all query requests.
 * @template T - The type of the response that the query will return after being handled.
 */
export abstract class Query extends BaseRequest implements IQuery {
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
    public readonly pagination: IPaginationParams,
    id: Guid,
    timestamp: Date,
    correlationId: Guid,
    tenantId: Optional<Guid>,
    intent: string,
    userId: Optional<Guid>,
    roles: Optional<readonly string[]>,
    permissions: Optional<readonly string[]>,
    rawHeaders: Optional<Dictionary<string>>,
    signal: Optional<AbortSignal>,
  ) {
    super(
      id,
      timestamp,
      correlationId,
      tenantId,
      intent,
      REQUEST_TYPE.QUERY,
      userId,
      roles,
      permissions,
      rawHeaders,
      signal,
    )
  }
}

/**
 * @description A class representing a cached query request in a CQRS architecture. This class extends the base Query class and implements the ICachedQuery interface, providing additional properties for caching behavior.
 */
export abstract class CachedQuery extends Query implements ICachedQuery {
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
    timestamp: Date,
    correlationId: Guid,
    tenantId: Optional<Guid>,
    intent: string,
    userId: Optional<Guid>,
    roles: Optional<readonly string[]>,
    permissions: Optional<readonly string[]>,
    rawHeaders: Optional<Dictionary<string>>,
    signal: Optional<AbortSignal>,
    pagination: IPaginationParams,
  ) {
    super(
      pagination,
      id,
      timestamp,
      correlationId,
      tenantId,
      intent,
      userId,
      roles,
      permissions,
      rawHeaders,
      signal,
    )
  }
}
