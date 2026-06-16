import type { ICacheableOptions, ReadCriteria } from '@/shared'

import type { IRequest } from './irequest.types'

/**
 * @fileoverview Defines the IQuery interface for query requests in a CQRS architecture.
 */

/**
 * @description An interface representing a paginated query request, which extends the ICommand interface and includes pagination parameters.
 */
export interface IQuery<TResponse = unknown> extends IRequest<TResponse> {
  /** @description The criteria for reading data, which can include pagination, sorting, and filtering options. */
  readonly readCriteria: ReadCriteria
}

/**
 * @description An interface representing a cached query request, which extends the base IQuery interface and includes additional properties for caching behavior. This allows query handlers to determine how to cache the results of the query based on the provided options.
 */
export interface ICachedQuery<TResponse = unknown> extends IQuery<TResponse> {
  /**
   * @description Cache options for the query, including cache key, TTL, and bypass flags.
   */
  readonly cacheOptions: ICacheableOptions
}
