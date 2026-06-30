/**
 * @description Canonical default values for resilience policy configuration.
 * Used by the resilience factory as the baseline for retry, circuit breaker,
 * and bulkhead settings.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export const RESILIENCE_DEFAULTS = Object.freeze({
  /** @description Default retry policy values.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  RETRY: Object.freeze({
    /** @description Default number of retry attempts.
     *
     * @author Gantry5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/Gantry5
     */
    ATTEMPTS: 3,

    /** @description Default base delay in milliseconds for retry backoff.
     *
     * @author Gantry5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/Gantry5
     */
    BASE_DELAY_MS: 100,

    /** @description Default maximum delay in milliseconds for retry backoff.
     *
     * @author Gantry5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/Gantry5
     */
    MAX_DELAY_MS: 1000,
  }),

  /** @description Default circuit breaker policy values.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  CIRCUIT_BREAKER: Object.freeze({
    /** @description Default number of consecutive failures before opening the circuit.
     *
     * @author Gantry5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/Gantry5
     */
    CONSECUTIVE_FAILURES: 5,

    /** @description Default half-open timeout in milliseconds.
     *
     * @author Gantry5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/Gantry5
     */
    HALF_OPEN_TIMEOUT_MS: 30_000,
  }),

  /** @description Default bulkhead policy values.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  BULKHEAD: Object.freeze({
    /** @description Default maximum number of concurrent operations.
     *
     * @author Gantry5
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/Gantry5
     */
    MAX_CONCURRENT: 10,
  }),
} as const)
