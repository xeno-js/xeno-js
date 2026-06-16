import type { Optional, RequestType } from '@/shared'

/**
 * @fileoverview Defines the IRequest interface for requests in a CQRS architecture.
 */
export interface IRequest<TResponse = unknown> {
  readonly $type?: TResponse
  /** @description The intent of the request, which can be used to describe the purpose or action associated with the request. */
  readonly intent: string
  /** @description The type of the request, which can be used to distinguish between different kinds of requests (e.g., command, query). */
  readonly type: RequestType
  /** @description An optional AbortSignal to allow cancellation of the request. */
  readonly signal: Optional<AbortSignal>
}
