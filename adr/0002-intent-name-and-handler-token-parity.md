---
title: 'Intent-to-Handler Token Parity Strategy in Xeno.JS'
description:
  'Learn why Xeno Core enforces strict intent-to-handler token parity and
  explicit registry mapping instead of decorators, ensuring zero-magic,
  predictable architecture.'
keywords:
  'Xeno.JS, TypeScript framework, DDD, Command Query Handlers, Explicit
  Registry, Dependency Injection, Architecture Decision Record, ADR, Zod
  validation, Authz'
author: 'Xeno.JS Core Team'
robots: 'index, follow'
---

## ADR: Intent-to-Handler Token Parity and Explicit Registry Strategy

In many modern backend frameworks (especially those relying heavily on
decorators and runtime reflection via `reflect-metadata`), command and query
handlers are implicitly linked to their execution paths. While this reduces
boilerplate, it frequently introduces "magic", hidden dependency loops, silent
failures, and debugging difficulties when names or types drift.

Xeno Core is designed around a **zero-magic, explicit dependency graph
philosophy**. We needed a deterministic mechanism to dispatch commands and
queries from the application boundary directly to their respective handlers
within the IoC container, without relying on fragile runtime reflection or
hidden conventions.

## Decision

1. **Strict Intent-to-Token Parity:** The string identifier representing a
   command or query (its `intent` name) **must** identically match the
   dependency injection token used to register its handler in the App Registry.
2. **Unified Intent Contract Across Layers:** This exact intent string serves as
   the single source of truth and must be consistently used across:

- The Command/Query definition payload.
- The associated **Zod validation schema**.
- The **Authorization (Authz) configurations** (defining rules for `userId`,
  `tenantId`, roles, and permissions).

3. **Fail-Fast Resolution:** When a command or query is dispatched, the
   framework queries the IoC container using that intent name. If the intent
   does not match the handler's registered token, the container cannot resolve
   the dependency and immediately throws a clear **"Service not registered"**
   error.
4. **No Decorators, Explicit Registry First:** By avoiding decorators for
   routing/handlers in favor of an explicit registry and dependency graph, we
   drastically reduce runtime surprises and ensure compile-time or startup
   safety.

## Consequences

- **Pros:**
- **Predictability & Traceability:** Zero hidden behaviors; every flow from
  incoming request to execution handler is traceable via explicit strings and
  tokens.
- **Error Prevention:** Mismatches between definitions and registrations fail
  fast, avoiding subtle bugs in production.
- **Performance & Simplicity:** Eliminates heavy runtime reflection overhead and
  makes the codebase entirely transparent.

- **Cons:**
- Requires developers to maintain strict naming discipline across commands,
  schemas, and registries, as "magic auto-discovery" is intentionally disabled.

---

> 💡 **Operational Debugging Reminder:** If the application returns a "Service
> not registered" error when sending a command or query, immediately check the
> **App Registry**: the intent declared in the command/query must match the
> token assigned to the handler exactly—including within the corresponding Zod
> and Authz configurations.
