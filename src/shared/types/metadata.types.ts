import type { Guid, Optional } from './common.types'

/**
 * @description The Metadata interface defines a structure for storing optional metadata information that can be associated with various operations, such as HTTP requests, logging, or tracing. It includes properties like correlationId, requestId, token, clientIp, and spanId, which can be used for tracking, authentication, and monitoring purposes. Additionally, it allows for any number of additional key-value pairs to be included as optional strings, providing flexibility for different use cases.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface Metadata {
  /** An optional identifier for correlating related operations across different services or components.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly correlationId: Optional<Guid>
  /** An optional unique identifier for the request, which can be used for ensuring idempotency and tracing purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly requestId: Optional<Guid>
  /** An optional token that can be used for authentication or authorization purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly token: Optional<string>
  /** An optional IP address of the client making the request, which can be used for audit logging and security purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly clientIp: Optional<string>
  /** An optional identifier for distributed tracing, which can be used to track the flow of requests across multiple services in a microservices architecture.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly spanId: Optional<Guid>
  /** An optional identifier for the parent span in distributed tracing, which can be used to establish a hierarchy of spans and track the flow of requests across multiple services in a microservices architecture.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly parentSpanId: Optional<string>
  /** A format indicator for the request, which can be used for content negotiation and logging purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly formatIndicator: string
  /** An optional user agent string of the client making the request, which can be used for audit logging and security purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly userAgent: Optional<string>
  /** An optional return address for the request, which can be used for routing responses or callbacks.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly returnAddress: Optional<string>
  /** An optional sequence object that can be used for managing message sequencing in distributed systems.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly sequence: Optional<{
    /** An optional unique identifier for the message sequence, which can be used to track and manage the order of messages in a sequence.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    readonly sequenceId: Optional<string>
    /** An optional position of the message within the sequence, which can be used to determine the order of messages in a sequence.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    readonly position: Optional<number>
    /** An optional size of the message sequence, which can be used to determine the total number of messages in a sequence.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    readonly size: Optional<number>
  }>
  /** An optional expiration time for the request, which can be used to determine when the request should be considered expired and no longer processed.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly expiration: Optional<number>
}
