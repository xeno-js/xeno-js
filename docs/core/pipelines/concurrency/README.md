# Concurrency and Retry behavior

The `ConcurrencyRetryPipeline` handles write-collision recovery within the
Command Track. When an operation triggers an optimistic locking error or state
collision during data persistence, this pipeline automatically intercepts the
failure and re-runs the entire request sequence using a randomized, jittered
backoff delay loop.

---

## Why It Is Needed

- **High-Concurrency Write Clashes**: In distributed storage systems, parallel
  request threads frequently attempt to modify the same database entity version
  concurrently, resulting in version mismatches or database conflicts.
- **Reduced Client-Side Failures**: Instead of leaking raw conflict exceptions
  back to users and forcing clients to build manual retry logic, the framework
  handles conflict recovery transparently right within the application core.
- **Thundering Herd Mitigation**: Retrying immediately without coordinated
  breaks can flood a database. This pipeline coordinates retries by introducing
  escalating delays mixed with randomized jitter, diffusing concurrent spikes
  and allowing storage engines to clear pending transactions smoothly.

---

## Configuration & Pipeline Behavior

The behavior maps under **`INJECTION_TOKENS.CONCURRENCY_RETRY_PIPELINE`**. It
configures its backoff boundaries dynamically using properties provided to
`AppBuilder`:

```typescript
import { AppBuilder } from '@graviton5/core'

builder.addPipeline((opts) => {
  opts.commandBus.concurrency = {
    maxRetries: 5, // Absolute ceiling for retry cycles before failing
    delayConfig: {
      baseDelayMs: 150, // Starting interval baseline for backoff delays
      maxJitterMs: 75, // Maximum randomized variance added per interval
    },
  }
})
```

> ⚠️ **STRICT VALIDATION RULES**: To protect system stability, the pipeline
> constructor enforces rigid constraints over incoming variables. Providing a
> value of `0` for `maxRetries` or negative integers for any delay property
> triggers an immediate, fatal `AppBuilder` bootstrap failure.

### Operational Execution Cycle

1. The pipeline initiates an internal tracking loop and triggers the downstream
   execution handle.
2. If the operation succeeds or encounters a standard domain error (e.g.,
   validation failure), the result is returned directly to the caller.
3. If a conflict occurs (`isConcurrencyError` evaluates true), the retry logic
   intervenes:

- If the maximum retry ceiling has been breached, the pipeline breaks out of the
  loop and returns a structured **`CONCURRENCY_CONFLICT`** `AppError` paired
  with an HTTP `409 Conflict` status code.
- If attempts remain, the pipeline calculates the next exponential delay,
  appends randomized jitter, suspends the request thread temporarily, and
  cleanly restarts the execution chain.
