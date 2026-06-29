# CQRS Pipeline Behaviors

## Overview

In the Graviton5 framework, **Pipeline Behaviors** implement a highly scalable
combination of the _Decorator_ and _Chain of Responsibility_ design patterns
wrapped around the centralized CQRS Mediator engine. Heavily inspired by
enterprise architecture standards (such as MediatR in the .NET ecosystem), a
pipeline behavior acts as an asynchronous middleware interceptor for `IRequest`
envelopes (Commands and Queries).

By intercepting incoming requests before and after they reach their designated
domain handlers, pipelines encapsulate cross-cutting concerns. This ensures that
non-functional requirements—such as application logging, performance telemetry,
security barriers, and data validation—are strictly decoupled from core business
domain logic.

```

[ CQRS Request Input ] ──► [ Mediator Dispatcher ]
│
▼
┌──────────────────────────┐
│    Exception Pipeline    │
└────────────┬─────────────┘
│
▼
┌──────────────────────────┐
│     Logging Pipeline     │
└────────────┬─────────────┘
│
▼
┌──────────────────────────┐
│   Performance Telemetry  │
└────────────┬─────────────┘
│
▼
...
│
▼
┌──────────────────────────┐
│  Target Domain Handler   │
└──────────────────────────┘

```

---

## The Dual-Track Execution Model

The Graviton5 Mediator orchestrates execution across two strictly segregated
tracks based on the intent and architectural side-effects of the incoming
request. While both tracks pass through global cross-cutting filters, their
operational goals and specific behavioral stacks differ fundamentally:

### 1. The Command Track (State Mutations)

Commands represent the intent to alter the state of the system (Write
operations). Because state changes introduce risks of side-effects, concurrency
conflicts, and data corruption, the Command Track enforces strict invariants and
transactional boundaries.

- **Core Behaviors Involved**: Validation enforcement, distributed concurrency
  retries, identity checks, and request idempotency tracking.
- **Architectural Goal**: Guaranteeing absolute data integrity, write
  resilience, and non-repudiation.

### 2. The Query Track (Data Retrieval)

Queries represent the intent to fetch data from remote datastores or read
replicas (Read operations). Queries are fundamentally idempotent and must never
modify the application state or produce structural side-effects.

- **Core Behaviors Involved**: High-throughput performance telemetry, aggressive
  query response caching, and data serialization optimization.
- **Architectural Goal**: Maximizing system responsiveness, minimizing database
  read strain, and optimizing latency bounds.

---

## Exposed Pipeline Framework Matrix

The core kernel of Graviton5 provisions and manages specific behavioral layers
registered as unique symbols via the central `INJECTION_TOKENS` constants. These
pipelines compose the structural backbone of the container host:

| Injection Token Registration                  | Behavioral Responsibility                                                                                                        | Target Track  |
| :-------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :------------ |
| `INJECTION_TOKENS.EXCEPTION_PIPELINE`         | Intercepts unhandled exceptions, sanitizes raw infrastructure callstacks, and packages them into type-safe `AppError` responses. | Global (Both) |
| `INJECTION_TOKENS.LOGGING_PIPELINE`           | Enforces structured structural auditing of every incoming request, capturing its input envelope metadata and final outcome.      | Global (Both) |
| `INJECTION_TOKENS.PERFORMANCE_PIPELINE`       | Monitors execution execution duration and fires automated telemetry warnings if a handler breaches configured time thresholds.   | Global (Both) |
| `INJECTION_TOKENS.AUTHORIZATION_PIPELINE`     | Evaluates domain-level security context filters including Roles, Permissions, and Multi-Tenant boundary logic.                   | Global (Both) |
| `INJECTION_TOKENS.VALIDATION_PIPELINE`        | Orchestrates a fail-fast verification loop across structural data validators and custom domain rules before handler execution.   | Global (Both) |
| `INJECTION_TOKENS.IDEMPOTENCY_PIPELINE`       | Intercepts duplicate command dispatch tokens to guarantee that identical transactions are executed exactly once.                 | Command Track |
| `INJECTION_TOKENS.CONCURRENCY_RETRY_PIPELINE` | Applies automated exponential backoff retry behaviors when optimistic lock version conflicts are encountered on data writes.     | Command Track |
| `INJECTION_TOKENS.QUERY_CACHING_PIPELINE`     | Interrogates active memory or distributed structures to return pre-computed read payloads, avoiding database re-execution.       | Query Track   |

---

## High-Level Configuration via `AppBuilder`

The pipeline behavior stack is initialized and mapped into your IoC container
using the declarative `.addPipeline()` method exposed by the fluent
**`AppBuilder`** host. This method provides a centralized callback configuration
block to calibrate global thresholds and toggle specific tracking engines:

```typescript
import { AppBuilder } from '@graviton5'

async function bootstrap() {
  const builder = new AppBuilder()

  builder
    .addContext()
    .addMiddlewares()
    // Mount and configure the CQRS Pipeline Behavior Stack
    .addPipeline((opts) => {
      // 1. Configure telemetry latency boundaries
      opts.performance.thresholdMs = 500 // Logs warnings for any request slower than 500ms

      // 2. Provision authorization tracking policies
      opts.authorization.tenant = false
      opts.authorization.policy.role = false
      opts.authorization.policy.permission = false

      // 3. Mount specific validation engines and custom strategy arrays
      opts.validation = {
        zod: {
          schemas: {
            /* Intent-to-Zod mappings */
          },
        },
        customValidationStrategy: [], // Custom Strategy Injection Tokens
      }

      // 4. Toggle track-specific behaviors
      opts.queryBus.isEnabled = true
    })

  return await builder.build()
}
```

---

## Documentation Roadmap

To understand the internal architecture, configuration parameters, and execution
workflows of each dedicated behavior subsystem, consult the respective component
manuals:

- **[`exception/`](./exception/README.md)**:
  **[Global Exception Handling Manual](./exception/README.md)** — Outlines the
  global safety-net middleware that intercepts unhandled failures and strips raw
  infrastructure stack details.
- **[`logging/`](./logging/README.md)**:
  **[Structured Audit Logging Manual](./logging/README.md)** — Details request
  observability across asynchronous execution scopes using central system
  loggers.
- **[`performance/`](./performance/README.md)**:
  **[Performance Telemetry & Latency Manual](./performance/README.md)** —
  Explains latency tracking hooks designed to detect application performance
  regressions early.
- **[`validation/`](./validation/README.md)**:
  **[Data Defense & Validation Manual](./validation/README.md)** — Covers Zod
  integration matrices, declarative message schema structures, and custom
  `BaseValidationStrategy` rules.
- **[`authz/`](./authz/README.md)**:
  **[Identity Access & Authorization Subsystem Manual](./authz/README.md)** —
  Outlines the multi-layered authorization infrastructure covering Tenant, User,
  Role-Based (RBAC), and Permission-Based (PBAC) security strategies.
- **[`idempotency/`](./idempotency/README.md)**:
  **[Idempotent Command Processing Manual](./idempotency/README.md)** — Focuses
  on duplicate transaction filtering using distributed mutex locks.
- **[`concurrency-retry/`](./concurrency-retry/README.md)**:
  **[Optimistic Concurrency Recovery Manual](./concurrency-retry/README.md)** —
  Maps runtime backoff behaviors applied to resolve state write collisions
  automatically.
- **[`query-caching/`](./query-caching.pipeline.ts)**:
  **[Distributed Query Cache Manual](./query-caching/README.md)** — Explains
  read-model performance tuning using high-speed in-memory or Redis caches.
