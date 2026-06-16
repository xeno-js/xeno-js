import type { Guid, Optional } from './common.types'

/**
 * @description The Metadata interface defines a structure for storing optional metadata information that can be associated with various operations, such as HTTP requests, logging, or tracing. It includes properties like correlationId, requestId, token, clientIp, and spanId, which can be used for tracking, authentication, and monitoring purposes. Additionally, it allows for any number of additional key-value pairs to be included as optional strings, providing flexibility for different use cases.
 */
export interface Metadata {
  /** An optional identifier for correlating related operations across different services or components. */
  readonly correlationId: Optional<Guid>
  /** An optional unique identifier for the request, which can be used for ensuring idempotency and tracing purposes. */
  readonly requestId: Optional<Guid>
  /** An optional token that can be used for authentication or authorization purposes. */
  readonly token: Optional<string>
  /** An optional IP address of the client making the request, which can be used for audit logging and security purposes. */
  readonly clientIp: Optional<string>
  /** An optional identifier for distributed tracing, which can be used to track the flow of requests across multiple services in a microservices architecture. */
  readonly spanId: Optional<string>
  /* An index signature that allows for any number of additional key-value pairs to be included as optional strings. This provides flexibility for storing custom metadata information that may be relevant to specific use cases or operations. */
  [key: string]: Optional<string>
}
