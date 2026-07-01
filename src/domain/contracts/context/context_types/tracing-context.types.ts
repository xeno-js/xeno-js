import type { Guid, Optional } from '@/shared'

/**
 * @description TracingContext defines the structure for tracing information used in logging and monitoring. It includes a correlation ID for tracking related operations, a start time for measuring duration, and an optional span ID for distributed tracing.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export interface TracingContext {
  /** A unique identifier for correlating related operations across different services or components.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  readonly correlationId: Guid
  /** The timestamp indicating when the operation started, used for measuring duration and performance.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  readonly startTime: number
  /** An optional identifier for distributed tracing, which can be used to track the flow of requests across multiple services in a microservices architecture.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  readonly spanId: Optional<string>
}
