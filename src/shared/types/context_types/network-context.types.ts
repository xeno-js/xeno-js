import type { Guid, Optional } from '@/shared'

/**
 * @description NetworkContext defines the structure for network-related information used in logging and monitoring. It includes a request ID for ensuring idempotency and a client IP address for audit logging purposes.
 */
export interface NetworkContext {
  /** A unique identifier for the request, which can be used for ensuring idempotency and tracing purposes. */
  readonly requestId: Guid
  /** The IP address of the client making the request, which can be used for audit logging and security purposes. */
  readonly clientIp: Optional<string>
}
