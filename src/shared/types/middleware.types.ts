import type { Guid, Optional } from './common.types'

/**
 * @description The Metadata interface defines a structure for storing optional metadata information that can be associated with various operations, such as HTTP requests, logging, or tracing. It includes properties like correlationId, requestId, token, clientIp, and spanId, which can be used for tracking, authentication, and monitoring purposes. Additionally, it allows for any number of additional key-value pairs to be included as optional strings, providing flexibility for different use cases.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export interface Metadata {
  /** An optional identifier for correlating related operations across different services or components.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  readonly correlationId: Optional<Guid>
  /** An optional unique identifier for the request, which can be used for ensuring idempotency and tracing purposes.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  readonly requestId: Optional<Guid>
  /** An optional token that can be used for authentication or authorization purposes.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  readonly token: Optional<string>
  /** An optional IP address of the client making the request, which can be used for audit logging and security purposes.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  readonly clientIp: Optional<string>
  /** An optional identifier for distributed tracing, which can be used to track the flow of requests across multiple services in a microservices architecture.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  readonly spanId: Optional<string>
  /* An index signature that allows for any number of additional key-value pairs to be included as optional strings. This provides flexibility for storing custom metadata information that may be relevant to specific use cases or operations.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  [key: string]: Optional<string>
}
