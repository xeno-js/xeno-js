import type { IHandler } from '@/domain'
import type { Guid, InjectionToken, RequestType } from '@/shared'

/**
 * @fileoverview Defines the IBaseRequest interface for base requests in a CQRS architecture.
 */

/**
 * An interface representing a base request in a CQRS architecture. This interface can be implemented by both command and query requests, as it includes common properties such as the request type, timestamp, and a unique token for identification.
 */
export interface IBaseRequest<T = unknown> {
  /** A unique identifier for the request, which can be used for tracing and correlation purposes. */
  readonly id: Guid

  /** The type of the request, which can be either 'COMMAND' or 'QUERY'. */
  readonly type: RequestType

  /** The timestamp indicating when the request was created. */
  readonly timestamp: Date

  /** A unique token to identify the request, which can be used for idempotency and tracing purposes. */
  readonly token: InjectionToken<IHandler<IBaseRequest<T>, T>>
}
