# Middleware Overview

The Presentation Layer Middleware inside Gear5 serves as the secure entry
gateway and execution perimeter for all incoming external transactions.
Orchestrated primarily by the **`RequestContextMiddleware`**, this layer is
responsible for translating raw protocol-specific transportation inputs (such as
HTTP request headers) into unified, strongly-typed domain metadata envelopes.

The middleware acts as an architectural boundary between the outer network layer
and the inner application core. It extracts tracing parameters, establishes
identity execution scopes, provisions isolated dependency injection buckets, and
hydrates the asynchronous local context storage before handing off control to
downstream handlers, buses, or controllers.

```
       [ HTTP Raw Request Node ]
                   │
                   ▼ Dispatches
     ┌───────────────────────────┐
     │ RequestContextMiddleware  │
     └─────────────┬____________─┘
                   │
                   ├──► 1. Extract Structural Metadata (CorrelationID, RequestID, SpanID)
                   │
                   ├──► 2. Authenticate Token (Resolves User Identity or Guest Fallback)
                   │
                   ├──► 3. Instantiate Request-Scoped DI Container (IServiceScope)
                   │
                   ├──► 4. Mount AsyncLocalStorage Execution Context Barrier
                   │
                   ▼
       [ Downstream Mediator Bus / Application Use-Case Core ]
                   │
                   ▼ Completion
       [ Scope Automatic Disposal (scope.dispose()) ]

```

---

## Documentation Roadmap

To implement, configure, and inspect the core presentation layer middleware
infrastructure, read the following technical manuals:

- **[Request Context & Execution Lifecycle Guide](./request-context-execution.md)**:
  Explains the asynchronous execution containment barrier, structural
  `ExecutionContext` composition models, and automated DI scope lifecycle
  disposal boundaries.
- **[HTTP Header Extraction & Metadata Contracts](./http-header-extraction.md)**:
  Details the raw transport schema layouts, token extraction mechanics via
  nested extractors, and tracing correlation format specifications.
- **[Middleware Registration & Fallback Guardrails](./configuration.md)**:
  Outlines programmatic `.addMiddlewares()` activation sequences inside
  `AppBuilder` and the built-in, unauthenticated anonymous guest identity
  routing mechanics.
