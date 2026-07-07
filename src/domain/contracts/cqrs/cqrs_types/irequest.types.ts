import type { RequestType } from '@/shared'

/**
 * @fileoverview Defines the IRequest interface for requests in a CQRS architecture.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IRequest<TRequest = unknown, TResponse = unknown> {
  readonly $type?: TResponse
  /** @description The intent of the request, which can be used to describe the purpose or action associated with the request.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly intent: string
  /** @description The type of the request, which can be used to distinguish between different kinds of requests (e.g., command, query).
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly type: RequestType
  /** @description The payload of the request, which contains the data associated with the request. This property is generic and can be of any type specified by the TRequest type parameter.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly payload: TRequest
}
