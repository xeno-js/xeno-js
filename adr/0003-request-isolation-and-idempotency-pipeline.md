---
title: 'Request Isolation and Idempotency Pipeline Strategy in Xeno.JS'
description:
  'Verify how Xeno Core guarantees thread-safe request isolation via
  AsyncLocalStorage and context-scoped idempotency keys to prevent cross-tenant
  data leaks.'
keywords:
  'Xeno.JS, TypeScript framework, Idempotency Pipeline, AsyncLocalStorage,
  Request Isolation, Multi-tenancy, Distributed Systems, ADR'
author: 'Xeno.JS Core Team'
robots: 'index, follow'
---

## ADR: Request Isolation and Idempotency Pipeline Strategy

In multi-tenant distributed architectures, ensuring command idempotency is
crucial to prevent duplicate processing caused by network retries or client
errors. However, a major architectural concern is the risk of cross-tenant data
leakage or concurrency pollution, where a request from Tenant B might
inadvertently check, lock, or overwrite idempotency states belonging to Tenant
A.

We needed an architecture that guarantees absolute request isolation while
providing robust, thread-safe idempotency handling without risking state
contamination across concurrent boundaries.

## Decision

1. **AsyncLocalStorage Request Boundary:** All request Lifecycles in Xeno Core
   execute within an isolated asynchronous context managed by
   `NodeRequestContext` using Node.js `AsyncLocalStorage`. State and scoped
   dependencies are strictly bound to the execution thread of that specific
   request.
2. **Context-Scoped Idempotency Keys:** The `IdempotencyStore` delegates key
   generation to the `CacheKeyBuilder`, which injects identity and tenant
   attributes into the cache keys (`buildContextualKey`). Idempotency locks and
   payloads are thus logically partitioned per context.
3. **Deterministic Thread Safety:** Because execution threads and memory spaces
   are isolated per request, concurrent executions cannot bleed identity state,
   authorization details, or idempotency cache entries into adjacent threads.

## Consequences

- **Pros:**
- **Zero Data Leakage:** Complete safety against cross-tenant and cross-user
  cache collisions.
- **Predictable Concurrency:** Safe parallel request handling without race
  conditions in the pipeline state.
- **Transparent Architecture:** Clear separation between request-scoped memory
  and shared storage layers.
