# Logging Architecture & Configuration

The Gear5 framework features a powerful, diagnostic-centric logging
infrastructure designed to capture runtime execution contexts, performance
metrics, and unhandled exceptions across your application layer.

## Documentation Tree

```text
docs/core/logging/
  README.md
  configure-logger.md                 # Architecture, default fallback, and providers
  custom-providers.md                 # Creating and registering custom logging drivers

```

## How It Works Under the Hood

Gear5 decouples the application logging interface from the underlying concrete
transportation layers using a specialized driver aggregation pattern.

```text
[Application Pipeline] ──> ILogger Interface ──> BaseLogger (Multiplexer)
                                                       │
                                        ┌──────────────┼──────────────┐
                                        ▼              ▼              ▼
                                 Console Driver   Pino Driver   Sentry Driver

```

### 1. The `ILogger` Contract and `BaseLogger`

Every component inside the framework resolves the centralized logger via
dependency injection using `INJECTION_TOKENS.LOGGER`. The resolved instance
evaluates your active log levels (`DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`) and
multiplexes the log payload to all activated providers simultaneously.

### 2. CQRS Pipeline Integration

When messages transit through the `Mediator`, the internal `LoggingPipeline`
automatically resolves the logger to produce structured traces of command
parameters, performance execution thresholds, and operational errors without
polluting your core domain logic.

---

## The Default Pipeline Fallback

To prevent application bootstrap crashes, Gear5 enforces a strict defensive
design pattern. When you activate your CQRS bus using
`builder.addPipeline(...)`, the internal `CqrsModule` implicitly triggers a
baseline registration:

```ts
// Inside CqrsModule execution logic:
await LoggerUtils.addLogger(container, undefined)
```

This guarantees that even if a developer omits explicit logging configurations,
a raw fallback **Console Logger** is instantly provisioned to capture stdout
diagnostics.

---

## ⚠️ Critical Rule: Builder Execution Order

Because the `addPipeline` method injects a baseline default console logger, you
must strictly orchestrate your fluent API setup sequence.

> **CRITICAL ARCHITECTURAL CONSTRAINT**: The `addLogger` method must **ALWAYS**
> be declared **AFTER** the `addPipeline` call.

### Why is this order mandatory?

If you declare `addLogger()` _before_ `addPipeline()`, the sequential module
bootstrapper will execute your custom setup first. Immediately afterward, the
`CqrsModule` bootstrap cycle will invoke its implicit fallback routine,
completely overwriting or polluting your custom logger container tokens.
Positioning `addLogger` at the end ensures your production configuration
gracefully overrides the core baseline.

### Correct Chaining Blueprint

```ts
import { AppBuilder, LOG_LEVEL } from '@gear5/core'

const builder = new AppBuilder()

builder
  // 1. Initialize your CQRS Core Pipelines first (injects baseline console)
  .addPipeline((opts) => {
    opts.queryBus.isEnabled = true
  })

  // 2. OVERRIDE and finalize logging behaviors immediately after
  .addLogger((opts) => {
    opts.level = LOG_LEVEL.INFO
    opts.console = true // Keeps styled terminal output active
  })
```

---

## Built-in Production Drivers

Gear5 provides built-in enterprise abstraction drivers that can be mixed and
matched inside your setup action:

### 1. Pino Logger (High-Performance Structured JSON)

Ideal for high-throughput microservices and cloud container runtimes
(Kubernetes, AWS ECS) where raw JSON stdout strings are piped into aggregation
layers (ELK, Datadog).

- **CLI Dependency Choice**: `logging`
- **Peer Dependency**: `npm install pino`

```ts
builder.addLogger((opts) => {
  opts.level = LOG_LEVEL.INFO
  opts.console = false // Turn off default unformatted stdout
  opts.pino = {
    config: {
      destination: 'stdout',
      env: 'production',
    },
  }
})
```

### 2. Sentry Logger (Error Telemetry & Tracking)

Captures unhandled framework anomalies, mapping internal stack traces directly
to your telemetry dashboards.

- **CLI Dependency Choice**: `sentry`
- **Peer Dependency**: `npm install @sentry/node`

```ts
builder.addLogger((opts) => {
  opts.level = LOG_LEVEL.ERROR // Capture only high-severity operational breaks
  opts.sentry = {
    config: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'production',
      tracesSampleRate: 0.2,
    },
  }
})
```
