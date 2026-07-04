---
title: Logging & Performance Pipeline Behaviors
sidebar_position: 2
description:
  Technical developer manual explaining Xeno native observability pipeline
  behaviors for automatic request logging and execution performance profiling.
keywords:
  - logging pipeline
  - performance pipeline
  - xeno core
  - observability
  - request tracking
  - runtime profiling
---

# Logging & Performance Pipeline Behaviors

The Logging & Performance Pipeline Behaviors documentation defines the telemetry
tracking lifecycles, execution latency profiling loops, and programmatic
configuration paths managed by the observability interceptor subsystems.

---

## Direct Definition Block

The `LoggingPipeline` and `PerformancePipeline` constitute the native
observability and diagnostics subsystem of the Xeno runtime kernel. Operating as
built-in middleware behaviors inside the mediator ring, they automatically
record transaction lifecycles, extract contextual tracking markers, and profile
handler execution latency to isolate performance anomalies without introducing
manual timing boilerplate into use-case logic.

---

## The Observability Paradigm

### What it is

The observability paradigm is an automated infrastructure-level auditing tier
that intercepts incoming CQRS request envelopes to record system events and
execution metrics.

### How it works

Rather than forcing individual handlers or controllers to manage diagnostics,
the mediator channels messages through sequential logging and timing rings.
These components monitor transit boundaries, capture success states, parse error
payload causes, and calculate exact processing delays before returning the final
result monad to the delivery interface.

### Why it exists

In traditional enterprise applications, a lack of uniform visibility into
execution paths makes debugging production faults and diagnosing system lag
incredibly difficult. Programmers frequently address this by scattering manual
logging commands and high-precision timers (`performance.now()`) inside
individual use-case handlers. This practice pollutes core business rules with
infrastructure code, generates duplicate boilerplate arrays, and leads to
inconsistent telemetry formats across distinct software domains.

---

## Technical Deep Dive

### 1. Logging Pipeline (`LoggingPipeline`)

#### Definition

The Logging Pipeline is a telemetry monitoring ring tasked with tracking request
ingress, egress, and failure metadata uniformly.

#### Behavior

The `LoggingPipeline` class requires the injection of the abstract `ILogger`
interface. Its programmatic `.handle()` method coordinates a sequential
telemetry tracking sequence:

- **Ingress Logging**: Emits an `info` level log indicating the request type and
  nominal intent string (e.g., `Handling COMMAND RegisterUserCommand`).
- **Outcome Evaluation**: Tracks the returned `Result` monad from the `next()`
  delegate link. If execution fails (`!result.isOk()` or `catch (error) { }`),
  it extracts the error envelope and records an `error` level log containing the
  descriptive error message and the underlying cause object. If execution
  succeeds, it outputs an `info` level log confirming successful processing.

#### Effect

This delivers complete observability across parallel processing threads,
capturing detailed error trace stacks automatically whenever an operational
failure occurs.

### 2. Performance Pipeline (`PerformancePipeline`)

#### Definition

The Performance Pipeline is a latency monitoring and runtime profiling
interceptor ring designed to enforce execution SLA compliance.

#### Behavior

This component measures use-case processing durations by wrapping the downstream
handler inside a strict `try/finally` block, ensuring high-precision timing
capture (`performance.now()`) even if the downstream stack encounters a
catastrophic database crash or unexpected code termination.

#### Effect

If the calculated delta duration crosses the assigned alerting threshold, the
behavior issues a specific `warn` level log detailing the target intent name and
the precise elapsed time formatted in milliseconds, highlighting slow code paths
or blocking queries.

---

## Activation and Configuration via `AppBuilder`

Because Xeno completely avoids automatic handler discovery, telemetry options
and performance alerting limits must be explicitly declared inside the
`AppBuilder` fluid configuration scripts:

### 1. Default Baseline Stack Activation

Invoking `.addPipeline()` without parameter configurations implicitly enables
the logging and profiling engines, applying a conservative default performance
warning threshold of `500ms`.

```typescript
// src/bootstrap.ts
import { AppBuilder } from '@xeno/core'

export async function bootstrap() {
  const builder = new AppBuilder()

  builder
    // Registers ExceptionPipeline, LoggingPipeline, and PerformancePipeline (at 500ms) automatically
    .addPipeline()

  return await builder.build()
}
```

### 2. Customizing the Performance Threshold

To match strict production SLAs, you can tune the profiling threshold by
supplying a custom configuration callback:

```typescript
// src/bootstrap.ts
import { AppBuilder } from '@xeno/core'

export async function bootstrap() {
  const builder = new AppBuilder()

  builder.addPipeline((opts) => {
    // Adjust the alerting window to 200ms. Any handler exceeding this limit triggers a warning log.
    opts.performance.thresholdMs = 200
  })

  return await builder.build()
}
```

---

## Architectural Constraints & Trade-offs

- **Strict Non-Zero Positive Int Parameter Invariants**: The profiling
  constructor uses explicit validation checks (`Guards.throwIfNegative()`) to
  evaluate initialization options. Registering a negative or zero integer value
  inside the `thresholdMs` property triggers an immediate startup initialization
  failure, crashing the application process.
- **Separation of Extrapolated System Metrics**: This subsystem measures raw
  event-loop execution duration inside the application kernel. It cannot be used
  to isolate browser rendering speeds or track external network transfer
  latency. Frequent performance warnings indicate that a use-case handler or its
  underlying database queries are blocking the main event-loop thread, requiring
  index optimization or query refactoring.

---

## Next Steps

Now that the core logging and profiling infrastructure is configured, move
forward to identity verification and data security guards:

- **[Authorization Pipeline Behavior](./authorization-pipeline-behavior.md)**
