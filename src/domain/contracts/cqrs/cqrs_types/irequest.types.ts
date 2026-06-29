import type { Optional, RequestType } from '@/shared'

/**
 * @fileoverview Defines the IRequest interface for requests in a CQRS architecture.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface IRequest<TResponse = unknown> {
  readonly $type?: TResponse
  /** @description The intent of the request, which can be used to describe the purpose or action associated with the request.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  readonly intent: string
  /** @description The type of the request, which can be used to distinguish between different kinds of requests (e.g., command, query).
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  readonly type: RequestType
  /** @description An optional AbortSignal to allow cancellation of the request.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  readonly signal: Optional<AbortSignal>
}
