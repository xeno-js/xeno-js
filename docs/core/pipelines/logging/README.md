# Logging pipeline behavior

The `LoggingPipeline` provides automated observability for request execution.
Positioned near the perimeter of the CQRS execution sequence, it hooks into the
request dispatch lifecycle to audit request entry criteria, execution metadata,
and transactional boundaries.

---

## Why It Is Needed

- **Audit Trail Compliance**: Regulated enterprise systems must maintain an
  unalterable log trail tracking user actions, state change executions, and
  system inputs.
- **Telemetry Diagnostics**: When failures occur in production, developers need
  to correlate request intents with error metrics across asynchronous
  boundaries.
- **Telemetry Consistency**: It uses the centralized `ILogger` abstraction
  layer. Whether your application routes logs to a plain developer terminal in
  development, writes to rolling log files on a VPS, or streams structured JSON
  telemetry packets directly to an external observability cloud (Sentry/Pino),
  this pipeline ensures all tracking hooks remain entirely consistent.

---

## Configuration & Pipeline Behavior

The `LoggingPipeline` is mapped automatically under the
**`INJECTION_TOKENS.LOGGING_PIPELINE`** token during the core startup phase. It
depends directly on the core `ILogger` client instance, which broadcasts logs to
all active loggers.

To calibrate the minimum tracking visibility tier across different deployment
targets, adjust the global `level` attribute inside the `.addLogger()` block of
your bootstrap file:

```typescript
import { AppBuilder } from '@graviton5/core'
import { LOG_LEVEL } from '@graviton5/core'

builder.addLogger((config) => {
  // Sets the baseline log filter tier across all pipeline tracking layers
  config.level = LOG_LEVEL.INFO
  config.console = true
  config.pino = { config: { destination: 'stdout' } }
})
```

### Operational Output Mapping

When a request passes through the pipeline loop, it triggers two diagnostic
tracking phases:

1. **Entry Log**: Fires an info log format tracing the incoming message type and
   target name: `"Handling Command CreateInvoiceCommand"`
2. **Exit Evaluation**: Evaluates the returned execution `Result` payload:

- **Success**: Emits a success trace detailing clean resolution:
  `"Successfully handled Command CreateInvoiceCommand"`
- **Failure**: Automatically extracts the mapped failure payload, writing a
  detailed error record paired with the attached exception stack:
  `"Failed to handle Command CreateInvoiceCommand: Invoice duplicate entry detected"`
