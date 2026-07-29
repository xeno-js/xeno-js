---
title: Query Caching Pipeline Behavior
sidebar_position: 10
description:
  Technical developer manual explaining Xeno QueryCachingPipeline, transparent
  read-optimization, and fault-tolerant caching mechanics.
keywords:
  - query caching
  - xeno core
  - read optimization
  - cache hit
  - cache miss
  - fault tolerance
  - redis caching
---

# Query Caching Pipeline Behavior

The Query Caching Pipeline Behavior documentation defines the read-side
optimization loops, fallback structural boundaries, and transient caching
lifecycles managed by the query bus execution path.

---

## Direct Definition Block

The `QueryCachingPipeline` is a native pipeline behavior in Xeno engineered to
provide transparent, high-performance caching for read-side operations. It
exclusively intercepts queries implementing the framework's `IQuery` contract,
evaluating explicit cache keys against an infrastructure-backed storage provider
(`ICache`) to short-circuit duplicate data lookups and bypass primary relational
database indexes entirely.

---

## The Read-Optimization Paradigm

### What it is

The read-optimization paradigm is an automated application-layer interception
ring that separates data retrieval use cases from physical database read
overhead.

### How it works

Rather than forcing individual query handlers to manage data structures inside
storage caches, incoming queries pass through the `QueryCachingPipeline`. The
pipeline evaluates cache option boundaries before a query reaches its use-case
logic: if a valid JSON record exists under the computed key signature, the cache
returns it directly; if a cache miss emerges, execution handles database lookup
normally and re-hydrates the cache asynchronously.

### Why it exists

In enterprise architectures, read operations naturally outnumber state-mutating
commands by multiple orders of magnitude. Repeatedly executing heavy relational
joins or looking up static, semi-static, or computationally intensive datasets
directly from the primary database pool introduces high resource allocation
overhead and latency bottlenecks. Scattering caching lookups (`cache.get()`,
`cache.set()`) inside handlers duplicates boilerplate arrays, tightly couples
business use cases to caching infrastructures, and exposes the application to
catastrophic downtime if the caching cluster drops.

---

## Technical Architecture & Lifecycle Flow

### What it is

The technical architecture represents the sequential, fault-tolerant runtime
checkpoints—divided into Guard Evaluation, Cache Read (Hit/Miss), and Graceful
Database Fallback—navigated by a query payload.

### How it works

The execution infrastructure organizes caching lifecycles across three distinct
operational tracks:

1. **Cache Key Guard Bypass**: If the computed `cacheKey` string evaluates to an
   empty or undefined variable, the pipeline skips cache checks entirely and
   hands over execution directly to the next handler link via `return next()`.
2. **Explicit Bypass Mode Execution**: If the query request context triggers
   either the `bypassCache` or `consistentRead` boolean flags, the pipeline
   bypasses the cache storage layer completely, forcing a fresh lookup from the
   relational database indices.
3. **Resilient Cache Interception**: Wraps cache reads inside an isolated
   try-catch block. If a cache miss occurs or the cache backend encounters a
   network cluster partition crash, the behavior logs a diagnostic warning
   string safely and transparently handles fallback execution down the use-case
   pipeline without throwing runtime errors.

```mermaid
sequenceDiagram
    autonumber
    participant M as Mediator Bus
    participant P as QueryCachingPipeline
    participant Cache as ICache Store
    participant Next as Next Link / Handler (DB)

    M->>P: query(cachedQuery, next)

    alt 1. Cache Key Empty or Missing
        P-->P: Guards.isNullOrEmpty(cacheKey)
        P->>Next: await next()
        Next-->>P: Return fresh data from DB
        P-->>M: Return Result.ok(freshData)
    else 2. Caching Active
        alt Bypass Mode Triggered (bypassCache or consistentRead)
            P->>Next: await next()
            Next-->>P: Return fresh data from DB
        else Standard Evaluation
            P->>Cache: get(cacheKey)
            alt Cache Hit
                Cache-->>P: Return cached json payload
                P-->>M: Return Result.ok(cachedData)
            else Cache Miss or Cache Cluster Crash
                Cache-->>P: Throw Error or return undefined
                Note over P: Logs [Cache ERROR] warning safely without crashing
                P->>Next: await next()
                activate Next
                Next-->>P: Return fresh data from DB
                deactivate Next
                alt Handler Succeeded (Result.isOk)
                    P->>Cache: set(cacheKey, data, ttl)
                    Note over P: Saves result asynchronously
                end
            </div>
        end
        P-->>M: Return final ResultType monad
    end

```

---

## Practical Implementation Guide

### 1. Activating the Query Bus Engine

Because Xeno instantiates messaging systems lazily, the query bus must be
explicitly enabled inside the pipeline option callbacks of your application
bootstrap script (`src/bootstrap.ts`):

```typescript
// src/bootstrap.ts
import { AppBuilder } from '@xeno/core'
import type { IServiceContainer } from '@xeno/core'

export async function bootstrap(): Promise<IServiceContainer> {
  const builder = new AppBuilder()

  builder
    .addContext()
    .addMiddlewares()
    .addPipeline((opts) => {
      // MANDATORY: Hydrates the query subsystem and registers QueryCachingPipeline
      opts.queryBus.isEnabled = true
    })

  return await builder.build()
}
```

### 2. Crafting an Eligible Cached Query Message

To channel a query payload through the caching middleware ring, implement the
framework's native `IQuery` contract:

```typescript
// src/application/queries/get-product-catalog.query.ts
import type { IQuery, CacheOptions, Optional } from '@xeno/core'
import { REQUEST_TYPE } from '@xeno/core'

export interface ProductCatalogDto {
  products: Array<{ id: string; name: string; price: number }>
}

// IMPORTANT: USE ONLY IQuery<T> FOR THE QueryCachingPipeline!
export class GetProductCatalogQuery implements IQuery<ProductCatalogDto> {
  public readonly type = REQUEST_TYPE.QUERY
  public readonly intent = 'GetProductCatalogQuery' as const
  public readonly cacheOptions: CacheOptions

  constructor(categoryFilter: string, forceRefresh: boolean = false) {
    this.cacheOptions = {
      // Define a deterministic, unique cache namespace key identifier string
      cacheKey: `catalog:category:${categoryFilter.trim().toLowerCase()}`,
      // Time-to-live expiration constraint (e.g., cache data for 10 minutes)
      ttl: 600,
      // If true, bypasses the cache lookup phase completely to pull directly from the DB
      bypassCache: forceRefresh,
      consistentRead: false,
    }
  }
}
```

Presentation controllers resolve the messaging kernel and route the query
contract via the explicit `.query()` interface:

```typescript
// src/presentation/controllers/catalog.controller.ts
import {
  BaseController,
  INJECTION_TOKENS,
  ResponseDto,
  STATUS_CODES,
} from '@xeno/core'
import {
  GetProductCatalogQuery,
  ProductCatalogDto,
} from '../../application/queries/get-product-catalog.query.js'

export class CatalogController extends BaseController<
  { category: string },
  ProductCatalogDto
> {
  public async handle(request: {
    category: string
  }): Promise<ResponseDto<ProductCatalogDto>> {
    const query = new GetProductCatalogQuery(request.category, false)
    const result = await this._query(query)

    if (!result.isOk()) {
      return this.fail(result.getErrorOrThrow(), 'Failed to retrieve catalog')
    }

    return this.ok(result.getValueOrThrow()!, STATUS_CODES.OK)
  }
}
```

---

## Architectural Constraints & Trade-offs

- **Context Invariant Segmentation of Cache Keys Mandatory**: When designing
  custom `cacheKey` parameter templates for sensitive user records, software
  engineers must append identifying metadata parameters (such as `tenantId` or
  `userId` strings extracted from the active `ExecutionContext`). Registering a
  generic, un-segmented signature like `cacheKey: "user:profile"` causes logical
  data bleeding, where concurrent user threads accidentally retrieve cached data
  payloads belonging to separate profiles.
- **Overhead of Silent Caching Tier Failure Modes**: Because the pipeline
  features built-in fault tolerance to intercept cache storage errors
  gracefully, cache database cluster timeouts or connection drops degrade
  silently without failing user request processes. This design prevents runtime
  crashes but can mask infrastructure degradation, redirecting heavy traffic
  loads onto the primary relational database and requiring careful monitoring of
  `[Cache ERROR]` telemetry log warnings.

---

## Next Steps

You have completed the **Xeno CQRS Pipeline Architecture** guide series. Return
to the main application boundaries dashboard or explore domain persistence layer
rules:

- **[Go Back to CQRS Pipeline Architecture Layer Index](./README)**
- **[Proceed to Domain Persistence Layer](../../database-persistence/README)**
