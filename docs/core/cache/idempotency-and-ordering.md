# Idempotency and Cache Configuration Ordering

The Graviton5 CQRS middleware core ships with an advanced engine to guarantee
request idempotency across your mutation pipeline
(`commandBus.idempotency`)[cite: 2, 4]. This behavior intercepts incoming
messages to prevent double execution of sensitive operations due to clients
retry requests or network drops[cite: 2].

## Automatic Fallback Behavior

When configuring idempotency within `addPipeline`, the application mandates a
cache provider to maintain active distributed execution locks and store finished
payload outcomes[cite: 2, 1].

If a cache configuration **is omitted** by the developer, the core factory
lifecycle executes a fallback mechanism, invoking an internal instance of
**`InMemoryCache`** to ensure your application can safely boot without immediate
configuration errors[cite: 1].

```ts
// Activating command idempotency inside the pipeline config
builder.addPipeline((opts) => {
  opts.commandBus.idempotency = {
    lockTtlSeconds: 60,
    processedTtlSeconds: 300,
  }
})
// Without an explicit cache block defined,
// Graviton5 implicitly configures an InMemoryCache fallback.
```

## Strict Builder Chaining Architecture Rule

If you are deploying to a production grid and wish to **override** the fallback
mechanism with a persistent, shared storage provider such as **Redis**, you must
strictly follow this builder initialization design pattern:

> ⚠️ **CRITICAL RULE**: The `addCache` declaration must be placed **AFTER** the
> `addPipeline` method call, and **NEVER BEFORE**.

### Why is this order mandatory?

The fluent `AppBuilder` queues architectural configurations sequentially before
validating and baking the concrete `IServiceContainer` instance. During pipeline
execution setup, enabling idempotency forces the internal command bus logic to
provision a default cache space (`InMemoryCache`).

If you place `addCache` _before_ `addPipeline`, the pipeline step will overwrite
your custom settings. Placing `addCache` _after_ guarantees your custom
configuration (such as a Redis provider setup) serves as the definitive
override.

### Correct Configuration Block (Redis Override Pattern)

Here is the correct initialization layout to ensure idempotency tracking keys
and transaction locks are written directly to your shared Redis infrastructure
instead of local worker memory:

```ts
import { AppBuilder } from '@graviton5/core'

const builder = new AppBuilder()

builder
  // 1. First, define your pipeline mechanics and idempotency intervals
  .addPipeline((opts) => {
    opts.commandBus.idempotency = {
      lockTtlSeconds: 60,
      processedTtlSeconds: 300,
    }
  })

  // 2. IMMEDIATELY OVERRIDE the storage mechanics right after the pipeline
  .addCache((opts) => {
    opts.inMemory = false
    opts.redis = {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: 6379,
    }
  })
```
