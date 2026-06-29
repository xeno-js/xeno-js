# Pino Production Logger Configuration

The Pino integration in Graviton5 handles enterprise-grade, high-throughput
structured JSON logging. Managed internally by the `PinoLoggerFactory`, this
driver bypasses the overhead of standard runtime evaluation by utilizing
asynchronous streams, smart serialization, and automatic sensitive field
scrubbing.

## Initialization properties (`PinoLoggerConfig`)

When passing parameters to the `builder.addLogger` setup action, you can
customize the underlying Pino initialization via the `opts.pino.config` block:

| Property      | Type                 | Default Value                           | Description                                                                                           |
| :------------ | :------------------- | :-------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| `env`         | `string`             | `process.env.NODE_ENV ?? 'development'` | Execution context environment name. Used to trigger automatic pretty printing.                        |
| `destination` | `'stdout' \| 'file'` | `'stdout'`                              | Defines the sink stream type. Options are standard terminal output or an internal file system target. |
| `filePath`    | `string`             | `'logs/app.log'`                        | The targeted destination file path when `destination` is set explicitly to `'file'`.                  |
| `prettyPrint` | `boolean`            | `true` if `env === 'development'`       | Toggles human-readable formatted stdout color prints instead of minified single-line JSON.            |

---

## Environment Template (.env.example)

When initializing your application infrastructure, the local environment
template can be pre-populated with individual variables to decouple runtime
configuration from your TypeScript compilation layer:

```env
# Standard Runtime Environment
NODE_ENV=development

# Graviton5 Pino Logger Configuration
LOG_LEVEL=debug
LOG_DESTINATION=stdout
LOG_FILE_PATH=logs/app.log
LOG_PRETTY_PRINT=true

```

---

## Under the Hood: Built-in Operational Protections

The `PinoLoggerFactory` enforces production-grade parameters automatically out
of the box, removing the need for manual boilerplate configurations:

### 1. Automatic PII Redaction and Compliance

To prevent sensitive security keys, payloads, or compliance-restricted fields
from accidentally being leaked into logging aggregators, the factory activates
native high-speed redaction:

- **Scrubbed Paths**: `password`, `token`, `secret`, `authorization`,
  `headers.authorization`
- **Masking Token**: Redacted paths are automatically replaced with a
  non-reversible `'***'` mask string.

### 2. Performance Serialization

Standard error serialization in Node.js often truncates important metadata.
Graviton5 automatically binds `pino.stdSerializers.err`, ensuring full
structural analysis of native and application level stack traces under the `err`
object attribute.

### 3. ISO Standardized Timestamps

Timestamps are configured to output high-performance, predictable ISO-8601
string representations via `pino.stdTimeFunctions.isoTime`.

---

## Execution Modes & Pipeline Behavior

The logger adapts its underlying execution architecture dynamically based on
your properties:

### A. Development Mode (Pretty Printing)

When `prettyPrint` is true, the factory shifts execution to use `pino-pretty`
transports. It automatically colorizes lines, translates execution timestamps to
systemic human-readable layouts, and hides structural clutter like process IDs
(`pid`) and machine names (`hostname`).

```ts
// Development Configuration
builder.addLogger((opts) => {
  opts.level = LOG_LEVEL.DEBUG
  opts.pino = {
    config: {
      prettyPrint: true,
    },
  }
})
```

### B. High-Performance Production Streams (Asynchronous Logging)

When running in production, formatting logs asynchronously avoids blocking the
main event loop. By using standard streaming destinations, the driver minimizes
execution friction:

- **Standard Output Streams (`stdout`)**: Logs are piped directly to standard
  descriptor `1` asynchronously (`sync: false`), letting container microservice
  orchestrators (Kubernetes, AWS ECS) or aggregators (Datadog, Logstash)
  intercept raw structured JSON packets directly.
- **File Sinks (`file`)**: Logs stream asynchronously directly into your local
  file system array (e.g., `logs/app.log`).

```ts
// High-Throughput Production File Configuration
builder
  .addPipeline((opts) => {
    opts.performance.thresholdMs = 250
  })
  .addLogger((opts) => {
    opts.level = LOG_LEVEL.WARN
    opts.console = false // Avoid mixing default console and structured logs
    opts.pino = {
      config: {
        env: 'production',
        destination: 'file',
        filePath: 'var/log/secure_audit.log',
        prettyPrint: false,
      },
    }
  })
```

> ⚠️ **CRITICAL ORDER REMINDER**: As noted in the main architecture blueprint,
> always call `.addLogger(...)` **after** `.addPipeline(...)`. Misplacing the
> logging configuration block before the pipeline configuration causes the
> default internal pipeline factory mechanics to overwrite your specialized Pino
> driver container tokens.
