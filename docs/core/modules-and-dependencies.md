# Modules and Dependencies

Gear5 uses optional peer dependencies: you install only the libraries required
by the modules you enable. The `@gear5/create` CLI translates your initial
choices into dependencies, dev dependencies, files, and commented snippets in
`src/bootstrap.ts`.

## Minimal Core

Always installed:

```json
{
  "@gear5/core": "^1.0.0-beta.0",
  "zod": "^4.4.3"
}
```

Always installed dev dependencies:

```json
{
  "tsx": "^4.7.0",
  "typescript": "^5.4.0",
  "@types/node": "^20.0.0"
}
```

Always available scripts:

```json
{
  "start": "tsx src/main.ts",
  "dev": "tsx watch src/main.ts"
}
```

## Database

CLI choice: `database`.

Dependencies:

```json
{
  "drizzle-orm": "^0.45.2",
  "pg": "^8.22.0",
  "postgres": "^3.4.9",
  "dotenv": "^16.4.5"
}
```

Dev dependencies:

```json
{
  "drizzle-kit": "^0.31.10",
  "@types/pg": "^8.11.0"
}
```

Added files:

- `drizzle.config.ts`
- `src/schema.ts`

Related Gear5 API:

```ts
builder.addDb((opts) => {
  opts.connectionString = process.env.DATABASE_URL || ''
  opts.tables = {}
})
```

## HTTP and Resilience

CLI choice: `http`.

Dependencies:

```json
{
  "axios": "^1.16.1",
  "cockatiel": "^4.0.0"
}
```

Related Gear5 API:

```ts
builder.addHttpCore((opts) => {
  opts.dataSourceToken = YOUR_DATA_SOURCE_TOKEN
  opts.http.client.baseURL = 'https://api.example.com'
  opts.resilience.retry.attempts = 3
  opts.resilience.circuitBreaker.consecutiveFailures = 5
})
```

`dataSourceToken` must be a valid injection token for the remote datasource.

## Supabase Auth

CLI choice: `supabase`.

Dependency:

```json
{
  "@supabase/supabase-js": "^2.35.0"
}
```

Related Gear5 API:

```ts
builder.addAuth((opts) => {
  opts.url = process.env.SUPABASE_URL || ''
  opts.key = process.env.SUPABASE_KEY || ''
})
```

## Logging

CLI choice: `logging`.

Dependency:

```json
{
  "pino": "^10.3.1"
}
```

Related Gear5 API:

```ts
import { LOG_LEVEL } from '@gear5/core'

builder.addLogger((opts) => {
  opts.level = LOG_LEVEL.INFO
  opts.console = true
})
```

## Sentry

CLI choice: `sentry`.

Dependency:

```json
{
  "@sentry/node": "^7.64.0"
}
```

Example:

```ts
builder.addLogger((opts) => {
  opts.level = LOG_LEVEL.ERROR
  opts.console = false
  opts.sentry = {
    config: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    },
  }
})
```

## Redis

CLI choice: `redis`.

Dependency:

```json
{
  "ioredis": "^5.3.1"
}
```

Related Gear5 API:

```ts
builder.addCache((opts) => {
  opts.inMemory = false
  opts.redis = {
    host: 'localhost',
    port: 6379,
    password: 'your-password',
  }
})
```

Redis is useful for cache and idempotency when you enable pipelines that need
it.

## CQRS Pipeline

Pipelines are configured with:

```ts
builder.addPipeline((opts) => {
  opts.performance.thresholdMs = 500
  opts.authorization.tenant = true
  opts.commandBus.idempotency = {
    lockTtlSeconds: 60,
    processedTtlSeconds: 300,
  }
  opts.commandBus.concurrency = {
    maxRetries: 3,
    delayConfig: {
      baseDelayMs: 100,
      maxJitterMs: 250,
    },
  }
  opts.queryBus.isEnabled = true
})
```

When you enable `addPipeline`, the builder also queues middleware and context.
