/**
 * @description Canonical default values for resilience policy configuration.
 * Used by the resilience factory as the baseline for retry, circuit breaker,
 * and bulkhead settings.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export const RESILIENCE_DEFAULTS = Object.freeze({
  /** @description Default retry policy values.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  RETRY: Object.freeze({
    /** @description Default number of retry attempts.
     *
     * @author XenoJS
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/XenoJS
     */
    ATTEMPTS: 3,

    /** @description Default base delay in milliseconds for retry backoff.
     *
     * @author XenoJS
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/XenoJS
     */
    BASE_DELAY_MS: 100,

    /** @description Default maximum delay in milliseconds for retry backoff.
     *
     * @author XenoJS
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/XenoJS
     */
    MAX_DELAY_MS: 1000,
  }),

  /** @description Default circuit breaker policy values.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  CIRCUIT_BREAKER: Object.freeze({
    /** @description Default number of consecutive failures before opening the circuit.
     *
     * @author XenoJS
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/XenoJS
     */
    CONSECUTIVE_FAILURES: 5,

    /** @description Default half-open timeout in milliseconds.
     *
     * @author XenoJS
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/XenoJS
     */
    HALF_OPEN_TIMEOUT_MS: 30_000,
  }),

  /** @description Default bulkhead policy values.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  BULKHEAD: Object.freeze({
    /** @description Default maximum number of concurrent operations.
     *
     * @author XenoJS
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/XenoJS
     */
    MAX_CONCURRENT: 10,
  }),
} as const)
