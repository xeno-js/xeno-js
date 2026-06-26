# Query caching pipeline behavior

The `QueryCachingPipeline` provides high-performance response caching across the
Query Track. It intercepts read requests that implement the framework's
`ICachedQuery` contract, inspecting active cache infrastructure targets
(In-Memory maps or distributed Redis clusters) to serve read payloads instantly
and bypass redundant data access layers.

---

## Why It Is Needed

- **Database Strain Relief**: High-volume applications often run repetitive,
  heavy read queries. Serving these common read requests directly from cache
  significantly reduces resource consumption on primary databases or read
  replicas.
- **Latency Optimization**: Fetching data from a distributed memory store takes
  microseconds compared to executing full relational SQL joins or cross-table
  database scans, greatly improving application responsiveness.
- **Fault-Tolerant Fallbacks**: If your underlying cache cluster experiences an
  unexpected network dropout or hardware failure, this pipeline logs a warning
  and automatically falls back to your database layer, preventing application
  downtime.

---

## Configuration & Pipeline Behavior

The behavior operates under **`INJECTION_TOKENS.QUERY_CACHING_PIPELINE`**. It
depends on the global `ICache` service contract (configured via `.addCache()`)
and uses the central logger to output cache telemetry.

To activate query caching, toggle the `queryBus` option inside the application
pipeline configuration block:

```typescript
import { AppBuilder } from '@gear5/core'

builder.addPipeline((opts) => {
  opts.queryBus.isEnabled = true // Enables the query behavior stack allocation
})
```

### The Query Consumer Contract (`ICachedQuery`)

Queries must declare their caching rules by implementing the `ICachedQuery`
protocol:

```typescript
import type { ICachedQuery } from '@gear5/core'

export class GetProjectMetricsQuery implements ICachedQuery<ProjectMetricsDto> {
  public readonly intent = 'GetProjectMetricsQuery'

  constructor(
    public readonly projectId: string,
    public readonly cacheOptions: {
      cacheKey: string
      cacheTtlSeconds: number
      bypassCache?: boolean
      consistentRead?: boolean
    },
  ) {}
}
```

### Operational Execution Cycle

1. **Key Inspection**: The pipeline inspects the request options. If `cacheKey`
   is empty, it skips caching logic entirely and passes execution straight to
   the database handler.
2. **Bypass Evaluation**: If `bypassCache` or `consistentRead` are set to true,
   the cache is bypassed to ensure data freshness.
3. **Cache Hit**: The pipeline queries the `ICache` service. If a valid cached
   string is found, it deserializes the JSON payload, logs a `[Cache HIT]` debug
   trace, and returns the data immediately.
4. **Cache Miss**: If the key is missing or expired, a cache miss occurs. The
   pipeline forwards execution to the database handler to fetch fresh data.
5. **Cache Serialization**: Once the database handler returns successfully, the
   pipeline serializes the fresh data payload, stores it in the cache with the
   configured TTL, logs a `[Cache SET]` trace, and returns the final result.
