import type { Guid, Optional } from '@/shared'

/**
 * @description NetworkContext defines the structure for network-related information used in logging and monitoring. It includes a request ID for ensuring idempotency and a client IP address for audit logging purposes.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export interface NetworkContext {
  /** A unique identifier for the request, which can be used for ensuring idempotency and tracing purposes.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  readonly requestId: Guid
  /** The IP address of the client making the request, which can be used for audit logging and security purposes.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  readonly clientIp: Optional<string>
}
