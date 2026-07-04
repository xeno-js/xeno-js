# Custom Logging Providers

When your enterprise ecosystem demands integration with custom log
transportation networks (e.g., specialized internal REST sinks, cloud-native
vendor APIs, or custom formatting aggregators), Xeno allows you to build and
register proprietary logging drivers seamlessly.

## 1. Implement the Contract

To create a custom logging driver, your class must implement the `ILogger`
structural interface or extend the abstract operational primitives. This forces
a stable runtime signature across your domain execution boundaries:

```ts
import { ILogger, LOG_LEVEL } from '@xeno/core'

export class CustomEnterpriseLogger implements ILoggerClient {
  private currentLevel: LOG_LEVEL = LOG_LEVEL.DEBUG

  public track<T>(
    level: LOG_LEVEL,
    message: string,
    context?: Record<string, T>,
    error?: Optional<Error>,
  ): void {
    if (level < this.currentLevel) return

    const logPayload = {
      severity: level,
      msg: message,
      meta: context,
      timestamp: new Date().getUTCMilliseconds(),
    }

    // Replace this with your custom forwarding logic (e.g., Axios post, internal stream write)
    process.stdout.write(`[ENTERPRISE SINK] ${JSON.stringify(logPayload)}\n`)
  }
}
```

---

## 2. Register Your Driver via AppBuilder

Once your custom driver implementation is complete, register it into the runtime
multiplexer pipeline using the `customLoggers` array parameter inside the
`addLogger` operational setup block.

> ⚠️ **REMINDER**: Ensure this structural config block is chained **AFTER** the
> core `addPipeline` method call to prevent pipeline fallbacks from overriding
> your custom driver configuration.

```ts
import { AppBuilder, LOG_LEVEL, TokenHelper } from '@xeno/core'
import { CustomEnterpriseLogger } from './infrastructure/logging/custom-enterprise.logger'

// Create injection token for the custom logger
const CUSTOM_LOGGER = TokenHelper.createToken<ILoggerClient>('CUSTOM_LOGGER')

// Initialize builder
const builder = new AppBuilder()

builder
  // Provision logging layers and attach your proprietary provider
  .addLogger((opts) => {
    opts.level = LOG_LEVEL.DEBUG
    opts.console = false // Disable native unformatted shell prints if desired

    // Inject custom implementations into the engine pipeline array
    opts.customLoggers = [CUSTOM_LOGGER]
  })
  // Register CustomEnterpriseLogger into the builder
  .addServices((services) => {
    services.addSingleton(CUSTOM_LOGGER, CustomEnterpriseLogger, [])
  })
```

By following this layout, the `CustomEnterpriseLogger` is fully woven into the
dependency IoC registry under `INJECTION_TOKENS.LOGGER` and handles incoming
data requests in tandem with any active framework logging structures.
