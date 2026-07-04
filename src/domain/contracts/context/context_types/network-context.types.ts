import type { Guid, Optional } from '@/shared'

/**
 * @description NetworkContext defines the structure for network-related information used in logging and monitoring. It includes a request ID for ensuring idempotency and a client IP address for audit logging purposes.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface NetworkContext {
  /** A unique identifier for the request, which can be used for ensuring idempotency and tracing purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly requestId: Guid
  /** The IP address of the client making the request, which can be used for audit logging and security purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly clientIp: Optional<string>
  /** The user agent string of the client making the request, which can be used for audit logging and security purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly userAgent: Optional<string>
  /** The format indicator for the request, which can be used for content negotiation and logging purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly formatIndicator: Optional<string>
  /** The path of the request, which can be used for routing, logging, or applying specific middleware logic.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly path: Optional<string>
}
