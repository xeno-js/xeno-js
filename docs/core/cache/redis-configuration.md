# Redis Configuration & CLI Integration

When initializing a brand new project via the `@XenoJS/create` CLI—either
through interactive step-by-step choices or by supplying the `complete` mode
argument—selecting the `redis` option automatically initializes your application
shell to orchestrate distributed caching layers[cite: 2, 5].

## Scaffolded Infrastructure Artifacts

The CLI automates the addition of system packages, boilerplate scripts, and
local configurations[cite: 2, 5]:

### 1. Dependency Manifesto (`package.json`)

The high-performance, enterprise-grade Redis client for Node.js is automatically
pulled into your stack[cite: 2, 5]:

```json
{
  "dependencies": {
    "ioredis": "^5.3.1"
  }
}
```

### 2. Environment Template (`.env.example`)

Your local `.env.example` file is pre-populated with default parameters
targeting your storage instance:

```env

# Redis Cache Core Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=
REDIS_TLS=false

```

## Application Bootstrap Declaration

Inside `src/bootstrap.ts`, the code creator prints a commented or basic template
of the `addCache` invocation chain. To link your runtime container directly to a
live Redis cluster or isolated instance, map the values from your process
environment:

```ts
import { AppBuilder } from '@xeno/core'

builder.addCache((opts) => {
  // Deactivate single-process volatile memory storage
  opts.inMemory = false

  // Assign the ioredis instance credentials
  opts.redis = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.REDIS_TLS === 'true',
    maxRetriesPerRequest: 3,
  }
})
```

## Runtime Architecture and DI Registration

When `builder.addCache` is processed, the internal builder delegator maps your
structural options. This module automatically:

1. Opens a singleton connection pool to your targeted Redis daemon.
2. Registers the wrapper underneath the core `INJECTION_TOKENS.CACHE` registry
   inside the IoC container.

3. Seamlessly handles structural serialization/deserialization routines across
   data transfer barriers.
