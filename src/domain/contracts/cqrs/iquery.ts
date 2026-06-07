import type { IBaseRequest } from '@/domain'
import type { ICacheableOptions, IPaginationParams } from '@/shared'

/**
 * @fileoverview Defines the IQuery interface for query requests in a CQRS architecture.
 */

/**
 * @description An interface representing a paginated query request, which extends the IBaseRequest interface and includes pagination parameters.
 */
export interface IQuery<T = unknown> extends IBaseRequest<T> {
  /** @description The pagination parameters for the query, which can include page number, page size, sorting, and filtering options. */
  pagination: IPaginationParams
}

/**
 * @description An interface representing a cached query request, which extends the base IQuery interface and includes additional properties for caching behavior. This allows query handlers to determine how to cache the results of the query based on the provided options.
 */
export interface ICachedQuery<T = unknown> extends IQuery<T> {
  /**
   * @description Cache options for the query, including cache key, TTL, and bypass flags.
   */
  cacheOptions: ICacheableOptions
}
