# Sentry Production Logger Configuration

The Sentry integration in Graviton5 handles production exception tracking, alert
monitoring, and real-time error telemetry. Managed internally by the
`SentryLoggerFactory`, this provider integrates natively with Graviton5's
dependency container to capture framework anomalies while proactively filtering
operational noise.

## Configuration Options (`SentryLoggerConfig`)

Sentry initialization is triggered by defining options within the
`opts.sentry.config` object during the `addLogger` configuration block:

| Property      | Type     | Default Value                           | Description                                                                                                                                                                  |
| :------------ | :------- | :-------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dsn`         | `string` | _Required_                              | The Data Source Name string provided by your Sentry project panel. It contains the security tokens, target protocol, and project ID required to route the telemetry packets. |
| `environment` | `string` | `process.env.NODE_ENV ?? 'development'` | Defines the environment context (e.g., `production`, `staging`, `development`) to categorize logs within your dashboard.                                                     |

---

## Environment Template (.env.example)

To securely configure cloud error tracking across multiple environments without
rebuilding your TypeScript bundle, populate your environment matrix using these
specific variables:

```env
# Standard Runtime Environment
NODE_ENV=development

# Graviton5 Sentry Logger Configuration
SENTRY_DSN=https://your-sentry-dsn@o0.ingest.sentry.io/0
SENTRY_ENVIRONMENT=development
SENTRY_RELEASE=app@1.0.0

```

---

## Under the Hood: Built-in Operational Rules

The `SentryLoggerFactory` encapsulates custom initialization heuristics to
optimize performance and control indexing costs on your Sentry account:

### 1. Verification and Guard Safeguards

If Sentry configuration properties are enabled but invalid, the framework
executes a graceful pre-boot shutdown. The factory will throw explicit
validation errors during the bootstrapping sequence if:

- `sentry.config` is missing completely:
  `"Sentry configuration is required when Sentry logging is enabled."`
- `sentry.config.dsn` is not supplied:
  `"Sentry DSN is required when Sentry logging is enabled."`

### 2. Privacy-First PII Protections

By default, `sendDefaultPii` is hardcoded to `false`. This prevents sensitive
user-identifiable data (such as system paths, environmental user parameters, or
low-level platform values) from leaving your hosting cluster compliance bounds.

### 3. Noise Filter Optimization (`ZodError` Scrubbing)

To avoid polluting your dashboard with standard user input validation mistakes,
the factory provides a built-in event filter within the `beforeSend` interceptor
hook:

```ts
beforeSend(event, hint) {
  const error = hint.originalException

  // If the error stems from a schema validation failure, suppress it entirely
  if (error instanceof Error && error.name === 'ZodError') {
    return null
  }

  return event
}

```

Validation problems (`ZodError`) are categorized as expected client exceptions
rather than critical system failures, so they are silently omitted from remote
Sentry ingestion to reduce alerting overhead.

### 4. Dynamic Performance Sampling Rates

Distributed tracing scales its internal overhead adaptively based on your system
environment to manage network saturation and execution cycles:

- **Production Context (`production`)**: Sets `tracesSampleRate: 0.1` (10%
  performance trace capture rate).
- **Non-Production Contexts**: Sets `tracesSampleRate: 1.0` (100% full detail
  indexing for sandbox debugging and trace validation).

### 5. Automated Out-of-the-Box Integrations

The framework automatically hooks `Sentry.Integrations.Http({ tracing: true })`
into the runtime stack. This pipes inbound network routing timings, external API
requests, and dependency propagation latency records directly into Sentry
Performance graphs.

---

## Bootstrapping via AppBuilder

To attach Sentry to your active `BaseLogger` multiplexer framework engine,
expose the keys inside your initialization file (`src/bootstrap.ts`):

```ts
import { AppBuilder, LOG_LEVEL } from '@graviton5'

const builder = new AppBuilder()

builder
  // 1. Initialize your CQRS Core Pipelines first (injects raw console defaults)
  .addPipeline((opts) => {
    opts.commandBus.idempotency = { lockTtlSeconds: 60 }
  })

  // 2. OVERRIDE and anchor your telemetry driver stack
  .addLogger((opts) => {
    // Sentry generally captures anomalies; pair with level WARN or ERROR
    opts.level = LOG_LEVEL.WARN
    opts.console = true // Keep local standard out active alongside Sentry

    opts.sentry = {
      config: {
        dsn:
          process.env.SENTRY_DSN ||
          '[https://examplePublicKey@o0.ingest.sentry.io/0](https://examplePublicKey@o0.ingest.sentry.io/0)',
        environment:
          process.env.SENTRY_ENVIRONMENT ||
          process.env.NODE_ENV ||
          'development',
      },
    }
  })
```

---

## ⚠️ Critical Rule: Builder Execution Order

As with all Graviton5 logging extensions, you must chain `.addLogger(...)`
**after** `.addPipeline(...)`.

Enabling the CQRS pipelines automatically mounts a default fallback system
logger container definition to preserve immediate functionality. Placing your
custom Sentry declaration _after_ the pipeline configuration statement ensures
that `SentryLoggerFactory` successfully overrides the baseline registration
tokens and hooks your exception monitors directly into the core dependency
injection graph.
