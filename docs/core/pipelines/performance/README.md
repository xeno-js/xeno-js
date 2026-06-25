# Overview

The `PerformancePipeline` implements non-invasive latency tracking and latency
profiling for all CQRS operations running through the Mediator. By measuring
elapsed handler execution durations, it automatically calculates request
performance, firing diagnostic alerts whenever an operation exceeds
pre-configured timing thresholds.

---

## Why It Is Needed

- **SLA Drift Identification**: In microservice environments, database queries
  or external service integrations can degrade slowly over time. Identifying
  these latency spikes early prevents application-wide performance drift.
- **Zero-Overhead Profiling**: Instead of forcing engineers to litter business
  logic use-cases with manual stopwatch metrics or requiring heavy external
  application performance monitoring (APM) agents, this pipeline centralizes
  performance telemetry right within the execution loop.
- **Resource Optimization**: Isolates heavy transactions in production,
  highlighting exactly which handlers require query tuning, cache strategies, or
  batching optimizations.

---

## Configuration & Pipeline Behavior

The behavior is managed under **`INJECTION_TOKENS.PERFORMANCE_PIPELINE`**.
Unlike basic global trackers, this module allocates its tracking conditional
dynamically based on options passed into the `AppBuilder` pipeline host:

```typescript
import { AppBuilder } from '@gear5/core'

builder.addPipeline((opts) => {
  // If thresholdMs is unassigned or set to undefined, the pipeline bypasses registration
  // to avoid runtime execution overhead.
  opts.performance.thresholdMs = 250 // Fires warnings for any command/query exceeding 250ms
})
```

### Operational Evaluation Workflow

1. The pipeline captures an precise timestamp baseline utilizing the
   high-resolution runtime clock (`performance.now()`).
2. Execution passes downstream to process the intent handler.
3. The execution block uses a `finally` wrapper to ensure timing metrics are
   evaluated even if the handler throws an exception or returns a failure.
4. The ending clock snapshot is subtracted from the baseline.
5. If the total duration violates your threshold, a warning log is broadcast to
   your logging providers:
   `"[WARN] Performance warning: ProcessPayrollCommand took 342.18ms"`
