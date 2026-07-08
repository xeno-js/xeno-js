import type { IRequest } from './irequest.types'

/**
 * @fileoverview Defines the ICommand interface for base requests in a CQRS architecture.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */

/**
 * @description An interface representing a base request in a CQRS architecture. This interface can be implemented by both command and query requests, as it includes common properties such as the request type, timestamp, and a unique token for identification.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface ICommand<TResponse = unknown> extends IRequest<TResponse> {
  /** @description An optional property to specify the expected response type of the command, which can be used for type inference and validation in command handlers.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly $type?: TResponse
}
