/**
 * @description Canonical default values for resilience policy configuration.
 * Used by the resilience factory as the baseline for retry, circuit breaker,
 * and bulkhead settings.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const RESILIENCE_DEFAULTS = Object.freeze({
  /** @description Default retry policy values.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  RETRY: Object.freeze({
    /** @description Default number of retry attempts.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    ATTEMPTS: 3,

    /** @description Default base delay in milliseconds for retry backoff.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    BASE_DELAY_MS: 100,

    /** @description Default maximum delay in milliseconds for retry backoff.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    MAX_DELAY_MS: 1000,
  }),

  /** @description Default circuit breaker policy values.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  CIRCUIT_BREAKER: Object.freeze({
    /** @description Default number of consecutive failures before opening the circuit.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    CONSECUTIVE_FAILURES: 5,

    /** @description Default half-open timeout in milliseconds.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    HALF_OPEN_TIMEOUT_MS: 30_000,
  }),

  /** @description Default bulkhead policy values.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  BULKHEAD: Object.freeze({
    /** @description Default maximum number of concurrent operations.
     *
     * @author Xeno
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/xeno-js
     */
    MAX_CONCURRENT: 10,
  }),
} as const)
