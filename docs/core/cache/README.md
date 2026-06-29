# Cache Module

The Graviton5 Cache module provides a unified and pluggable abstraction for
handling transient states, caching query results, and managing distributed
idempotency locks. It natively supports both in-memory storage and multi-node
distributions via Redis[cite: 2].

## Documentation Tree

```text
docs/core/cache/
  README.md                           # Core overview and API contracts
  redis-configuration.md              # Redis setup via CLI and environment variables
  idempotency-and-ordering.md         # Idempotency pipelines and builder execution order
```

## Core Features

- **Unified Abstraction**: A consistent interface across distinct storage
  providers (`InMemory` or `Redis`), ensuring your application logic remains
  detached from infrastructure choices.

- **In-Memory Cache**: The zero-configuration default provider, tailored for
  local development, unit testing, or single-process standalone monoliths.

- **Redis Cache**: Backed by `ioredis` to deliver robust, high-performance
  distributed caching for serverless environments (e.g., AWS Lambda), cloud edge
  nodes, or multi-instance clusters.

## Fluent Initialization API

The cache system is configured through the fluent `AppBuilder` instance during
your application bootstrap cycle (`src/bootstrap.ts`):

```ts
import { AppBuilder } from '@graviton5/core'

const builder = new AppBuilder()

// Base zero-dependency In-Memory configuration
builder.addCache((opts) => {
  opts.inMemory = true
})
```

## Recommended Paths

- [Redis Configuration](https://www.google.com/search?q=./redis-configuration.md):
  Learn how to orchestrate a Redis-backed infrastructure from initial CLI
  scaffolding to environment variables setup.
- [Idempotency & Builder Ordering](https://www.google.com/search?q=./idempotency-and-ordering.md):
  Understand how the CQRS pipeline interacts with your caching provider and why
  method declaration order is critical.
