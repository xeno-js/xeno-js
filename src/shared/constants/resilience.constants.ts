/**
 * @description Canonical default values for resilience policy configuration.
 * Used by the resilience factory as the baseline for retry, circuit breaker,
 * and bulkhead settings.
 */
export const RESILIENCE_DEFAULTS = Object.freeze({
  /** @description Default retry policy values. */
  RETRY: Object.freeze({
    /** @description Default number of retry attempts. */
    ATTEMPTS: 3,

    /** @description Default base delay in milliseconds for retry backoff. */
    BASE_DELAY_MS: 100,

    /** @description Default maximum delay in milliseconds for retry backoff. */
    MAX_DELAY_MS: 1000,
  }),

  /** @description Default circuit breaker policy values. */
  CIRCUIT_BREAKER: Object.freeze({
    /** @description Default number of consecutive failures before opening the circuit. */
    CONSECUTIVE_FAILURES: 5,

    /** @description Default half-open timeout in milliseconds. */
    HALF_OPEN_TIMEOUT_MS: 30_000,
  }),

  /** @description Default bulkhead policy values. */
  BULKHEAD: Object.freeze({
    /** @description Default maximum number of concurrent operations. */
    MAX_CONCURRENT: 10,
  }),
} as const)
