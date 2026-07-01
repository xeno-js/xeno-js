# Resilience & Fault Tolerance Configuration

The `CockatielResilienceFactory` handles the execution protection architecture
inside XenoJS. Instead of evaluating faults inside separate, isolated hooks, it
orchestrates a layered structural wrapper
(`wrap(bulkheadPolicy, circuitBreakerPolicy, retryPolicy)`) that intercepts
failures before they can cascade downstream and saturate local system resources.

---

## Under the Hood: The Resilient Pipeline Composition

The policy wrapper behaves like a defensive execution sandbox built from three
distinct architectural rings:

1. **Bulkhead Isolation (The Shield)**: The outermost layer limits maximum
   concurrent operation volumes, isolating failures and preventing structural
   resource exhaustion across parallel execution threads.
2. **Circuit Breaker (The Fuse)**: Tracks consecutive exception frequencies. If
   consecutive failure tolerances are breached, it short-circuits execution
   immediately, failing fast to allow downstream targets time to recover.
3. **Exponential Backoff Retry (The Self-Healer)**: The innermost layer catches
   transient faults and safely re-attempts execution with randomized, escalating
   delay intervals.

---

## Standalone Configuration API (`addResilience`)

To provision standalone resilience settings inside the IoC container without
instantiating a full HTTP core bundle, register the pipeline module directly
using the `.addResilience()` method exposed by the `AppBuilder` host:

```ts
import { AppBuilder } from '@xeno/core'

async function bootstrap() {
  const builder = new AppBuilder()

  builder
    .addContext()
    .addMiddlewares()
    // Registers a standalone ServiceResilience under INJECTION_TOKENS.RESILIENCE_CLIENT
    .addResilience((opts) => {
      // 1. Configure the self-healing retry block
      opts.retry = {
        attempts: 4, // Overrides default execution attempts
        baseDelayMs: 500, // Escalates from a 500ms baseline
        maxDelayMs: 4000, // Caps exponential delays at 4 seconds
      }

      // 2. Configure the circuit breaker trip-wire
      opts.circuitBreaker = {
        consecutiveFailures: 3,
        halfOpenTimeoutMs: 10000, // 10-second cooldown window
      }

      // 3. Configure bulkhead execution ceilings
      opts.bulkhead = {
        maxConcurrent: 15,
      }
    })

  return await builder.build()
}
```

---

## Configuration Parameter Matrix (`ResilienceConfig`)

The structural properties passed inside the configuration block are defined as
`Optional<number>`. If any field is omitted or passed as `undefined`, the
factory automatically merges secure fallback parameters mapped from the internal
framework constants (`RESILIENCE_DEFAULTS`):

| Property                             | Type               | Default Value | Fallback Constant                      | Operational Description                                                                       |
| ------------------------------------ | ------------------ | ------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| `retry.attempts`                     | `Optional<number>` | `3`           | `RETRY.ATTEMPTS`                       | The number of retry attempts to be made before marking the operation as failed.               |
| `retry.baseDelayMs`                  | `Optional<number>` | `1000`        | `RETRY.BASE_DELAY_MS`                  | Initial delay in milliseconds for the first retry attempt, computing exponential increments.  |
| `retry.maxDelayMs`                   | `Optional<number>` | `10000`       | `RETRY.MAX_DELAY_MS`                   | Maximum cap limit for backup delays, preventing retry intervals from escalating indefinitely. |
| `circuitBreaker.consecutiveFailures` | `Optional<number>` | `5`           | `CIRCUIT_BREAKER.CONSECUTIVE_FAILURES` | Consecutive exception threshold required to trip the circuit breaker open.                    |
| `circuitBreaker.halfOpenTimeoutMs`   | `Optional<number>` | `30000`       | `CIRCUIT_BREAKER.HALF_OPEN_TIMEOUT_MS` | Cooldown duration in milliseconds before entering a `half-open` trial recovery state.         |
| `bulkhead.maxConcurrent`             | `Optional<number>` | `10`          | `BULKHEAD.MAX_CONCURRENT`              | Maximum parallel execution loops allowed across this client instance simultaneously.          |

> ⚠️ **CRITICAL VALIDATION RULE**: The factory enforces strict validation
> constraints over assigned values during initialization. Providing negative
> integers (`< 0`) for any parameter triggers an immediate `AppBuilder`
> bootstrap failure, throwing a descriptive formatting exception to prevent
> erratic policy behaviors at runtime.

---

## Intelligent Transient Error Filtering

To maintain predictable operational metrics, the factory avoids triggering
backoff loops or shifting circuit breaker states for application-level errors or
expected client-side validation anomalies (e.g., `400 Bad Request`,
`404 Not Found`).

The internal `isRetryableServerError` evaluator filters incoming exceptions and
targets only genuine transient network or server-side structural faults:

- **Infrastructure & Network Disconnects**: Local or remote environment drops
  where standard HTTP response codes are missing (e.g., DNS resolution dropouts,
  TCP reset connection drops, socket timeouts).
- **Remote System Server Faults (5xx)**: External platform failures where the
  returned HTTP status code evaluates between `500` and `599`.
