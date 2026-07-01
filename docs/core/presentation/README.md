# Presentation Layer

## Overview

The `presentation/` layer functions as the protocol-specific delivery system and
communication boundary for the XenoJS application runtime. Operating as an
architectural adapter at the perimeter of the infrastructure, this layer is
responsible for intercepting raw external incoming messaging models (such as
REST HTTP network streams), validating payload boundaries, and translating
network data contracts into framework-compliant `IRequest` envelopes.

By encapsulating transportation layers completely, the presentation engine
shields inner domain aggregates and business command pipelines from direct
knowledge of specific transport protocols, routing frameworks, or
framework-specific server architectures.

---

```
             [ Incoming Protocol Wire Target ] (REST, Webhooks)
                            │
                            ▼
             ┌─────────────────────────────┐
             │    presentation/ Module     │
             └──────────────┬──────────────┘
                            │
    ┌───────────────────────┴───────────────────────┐
    ▼                                               ▼

```

```

[ middlewares/ ]                                [ controllers/ ]
• Request Context Slicing                       • Request Parameter Unpacking
• AsyncLocalStorage Anchoring                   • Mediator Bus Dispatching
• Dependency Scope Management                   • HttpHelper Contract Delivery
│
▼
[ Core Application Use-Case Core / Mediator Bus ]

```

---

## Core Operational Components

The delivery infrastructure is divided into two decoupled processing sequences:

### 1. Execution Lifecycle Interceptors (`middlewares/`)

Middlewares manage the initialization of request-specific tracking scopes before
use-case handling begins. Orchestrated by the `RequestContextMiddleware`, this
block automates critical cross-cutting tasks:

- Captures and generates global `correlationId` and `requestId` diagnostic
  elements.
- Authenticates incoming bearer tokens via the active `IGateKeeper` engine.
- Provisions an isolated, request-scoped dependency injection bucket
  (`IServiceScope`).
- Anchors tracking structures into `AsyncLocalStorage` to enable transparent
  context resolution across asynchronous execution callstacks.

### 2. Request Envelope Routers (`controllers/`)

Controllers handle the mapping of protocol endpoints. Inheriting from
`BaseController`, these components unpack body properties, forward transactions
through the type-safe `IMediator` bus, and translate internal functional
`Result` values into structured network responses:

- **Success Tracing**: Wraps domain data records into predictable
  `SuccessResponseDto` layouts paired with standard HTTP execution status
  signatures (`200 OK`, `201 Created`).
- **Failure Isolation**: Translates internal `AppError` payloads into
  standardized `ErrorResponseDto` telemetry objects, embedding mandatory
  anti-caching security directives and system correlation headers.

---

## Documentation Roadmap

To review code implementations, programmatic configurations, and contractual
response structures inside the presentation context, consult the respective
component manuals:

- **[`controllers/`](./controllers/README.md)**:
  **[`BaseController` & HTTP Response Contracts Guide](./controllers/README.md)**
  — Explains endpoint routing wrappers, functional result evaluation parsing,
  and the serialization formats of `HttpHelper`.
- **[Request Middleware & Lifecycle Manual](../core/middleware/README.md)**:
  _(Located inside the core feature directory)_ — Deep dives into header
  extraction variables, unauthenticated anonymous guest fallback loops, and
  scope cleanup routines.

```

---

### Prossimo Passo consigliato

Ora che hai tutti i file `README.md` strutturati in ordine logico, ricordati di inserire i file `_category_.json` all'interno delle cartelle di Docusaurus (come visto nello step precedente) per blindare la sequenza di lettura (es. `Shared Kernel` prima di `Presentation Layer`).
```
