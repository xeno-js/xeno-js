import type { ICacheableOptions } from '@/shared'

import type { IRequest } from './irequest.types'

/**
 * @fileoverview Defines the IQuery interface for query requests in a CQRS architecture.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */

/**
 * @description An interface representing a paginated query request, which extends the IQuery interface and includes pagination parameters.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IQuery<TResponse = unknown> extends IRequest<TResponse> {
  /**
   * @description Cache options for the query, including cache key, TTL, and bypass flags.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly cacheOptions: ICacheableOptions
}
