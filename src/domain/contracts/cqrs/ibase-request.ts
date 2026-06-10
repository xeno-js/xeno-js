import type { Dictionary, Guid, Optional, RequestType } from '@/shared'

/**
 * @fileoverview Defines the IBaseRequest interface for base requests in a CQRS architecture.
 */

/**
 * @description An interface representing a base request in a CQRS architecture. This interface can be implemented by both command and query requests, as it includes common properties such as the request type, timestamp, and a unique token for identification.
 */
export interface IBaseRequest {
  /** A unique identifier for the request, which can be used for tracing and correlation purposes. */
  readonly id: Guid
  /** The timestamp indicating when the request was created. */
  readonly timestamp: Date
  /** The intent of the request, which can be used to describe the purpose or action associated with the request. */
  readonly intent: string
  /** The type of the request, which can be used to distinguish between different kinds of requests (e.g., command, query). */
  readonly type: RequestType

  /** A unique token for identifying the request, which can be used for idempotency and tracing purposes. */
  readonly correlationId: Guid

  /** The tenant ID associated with the request, which can be used for multi-tenant applications to ensure that requests are executed within the correct tenant context. */
  readonly tenantId: Optional<Guid>
  /** The unique identifier of the user associated with the request, which can be used for authorization and auditing purposes. */
  readonly userId: Optional<Guid>
  /** The roles associated with the user, which can be used for authorization purposes. */
  readonly roles: Optional<readonly string[]>
  /** The permissions associated with the user, which can be used for authorization purposes. */
  readonly permissions: Optional<readonly string[]>

  /** Custom headers passed from the network (optional, if needed) */
  readonly rawHeaders: Optional<Dictionary<string>>

  /** An optional AbortSignal to allow cancellation of the request. */
  readonly signal: Optional<AbortSignal>
}
