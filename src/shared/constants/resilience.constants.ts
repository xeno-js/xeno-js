/**
 * @description Canonical default values for resilience policy configuration.
 * Used by the resilience factory as the baseline for retry, circuit breaker,
 * and bulkhead settings.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export const RESILIENCE_DEFAULTS = Object.freeze({
  /** @description Default retry policy values.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  RETRY: Object.freeze({
    /** @description Default number of retry attempts.
     *
     * @author Gear5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/gear5
     */
    ATTEMPTS: 3,

    /** @description Default base delay in milliseconds for retry backoff.
     *
     * @author Gear5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/gear5
     */
    BASE_DELAY_MS: 100,

    /** @description Default maximum delay in milliseconds for retry backoff.
     *
     * @author Gear5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/gear5
     */
    MAX_DELAY_MS: 1000,
  }),

  /** @description Default circuit breaker policy values.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  CIRCUIT_BREAKER: Object.freeze({
    /** @description Default number of consecutive failures before opening the circuit.
     *
     * @author Gear5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/gear5
     */
    CONSECUTIVE_FAILURES: 5,

    /** @description Default half-open timeout in milliseconds.
     *
     * @author Gear5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/gear5
     */
    HALF_OPEN_TIMEOUT_MS: 30_000,
  }),

  /** @description Default bulkhead policy values.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  BULKHEAD: Object.freeze({
    /** @description Default maximum number of concurrent operations.
     *
     * @author Gear5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/gear5
     */
    MAX_CONCURRENT: 10,
  }),
} as const)
