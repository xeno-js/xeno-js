import type { Optional } from '@/shared'

/**
 * @description This file defines the ResilienceConfig interface, which specifies the configuration options for implementing resilience features such as retries, circuit breakers, and bulkheads in service calls. The ResilienceConfig interface includes properties for configuring retry attempts, base delay, maximum delay, consecutive failures for circuit breakers, half-open timeout, and maximum concurrent operations for bulkheads. This configuration can be used to enhance the reliability of service interactions by automatically handling transient faults and preventing cascading failures in distributed systems.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface ResilienceConfig {
  /**
   * @description Configuration for retry mechanism, including the number of retry attempts, base delay in milliseconds for the first retry, and maximum delay in milliseconds for subsequent retries. This configuration allows for implementing an exponential backoff strategy to manage retries effectively and avoid overwhelming the service with rapid retry attempts.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  retry: {
    /** @description The number of retry attempts to be made before giving up on the operation. This helps to ensure that transient faults are handled gracefully without overwhelming the service with excessive retries.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    attempts: Optional<number>
    /** @description The base delay in milliseconds for the first retry attempt. This value is used to calculate the delay for subsequent retries using an exponential backoff strategy, which helps to manage retries effectively and avoid overwhelming the service with rapid retry attempts.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    baseDelayMs: Optional<number>
    /** @description The maximum delay in milliseconds for subsequent retry attempts. This value is used to cap the delay for retries when using an exponential backoff strategy, ensuring that the delay does not grow indefinitely and allowing for a reasonable retry strategy that balances between retrying too quickly and waiting too long.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    maxDelayMs: Optional<number>
  }
  /**
   * @description Configuration for circuit breaker mechanism, including the number of consecutive failures required to trip the circuit breaker and the timeout duration in milliseconds for the half-open state. This configuration helps to prevent cascading failures by temporarily blocking calls to a service that is experiencing issues, allowing it time to recover before accepting new requests.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  circuitBreaker: {
    /** @description The number of consecutive failures required to trip the circuit breaker. When the number of consecutive failures reaches this threshold, the circuit breaker will open, preventing further calls to the service until it is allowed to half-open after a specified timeout. This helps to prevent cascading failures by temporarily blocking calls to a service that is experiencing issues, allowing it time to recover before accepting new requests.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    consecutiveFailures: Optional<number>
    /** @description The timeout duration in milliseconds for the half-open state of the circuit breaker. After the circuit breaker has been tripped and is in the open state, it will transition to the half-open state after this timeout duration. In the half-open state, a limited number of calls will be allowed to test if the service has recovered. If the calls succeed, the circuit breaker will close and allow normal operation to resume. If the calls fail, the circuit breaker will open again, preventing further calls until the next timeout period. This configuration helps to manage the recovery process of a service that is experiencing issues and ensures that it can return to normal operation gracefully.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    halfOpenTimeoutMs: Optional<number>
  }
  /**
   * @description Configuration for bulkhead mechanism, including the maximum number of concurrent operations allowed. This configuration helps to isolate failures and prevent resource exhaustion by limiting the number of concurrent calls to a service, ensuring that other parts of the system can continue to function even if one service is experiencing issues.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  bulkhead: {
    /** @description The maximum number of concurrent operations allowed. This helps to isolate failures and prevent resource exhaustion by limiting the number of concurrent calls to a service, ensuring that other parts of the system can continue to function even if one service is experiencing issues.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    maxConcurrent: Optional<number>
  }
}
