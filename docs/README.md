---
title: 'Xeno Architectural Overview & Getting Started Guide'
description:
  'An in-depth introduction to Xeno, a decoupled TypeScript framework built on
  Domain-Driven Design (DDD), CQRS, and explicit Inversion of Control (IoC).'
keywords:
  [
    'Xeno',
    'Dependency Injection',
    'Inversion of Control',
    'Domain-Driven Design',
    'CQRS',
    'Clean Architecture',
    'Node.js framework',
    'TypeScript framework',
  ]
author: 'Xeno'
---

# Getting Started with Xeno: Architectural Overview

## What is Xeno and Why Use It?

Xeno is an emerging, type-safe architectural framework designed for Node.js
runtime environments. It provides explicit abstractions for Domain-Driven Design
(DDD) and Command-Query Responsibility Segregation (CQRS), leveraging a
customized Inversion of Control (IoC) container to manage request-scoped
dependencies without implicit runtime magic.

Unlike high-magic frameworks that rely heavily on decorators and global
execution contexts, Xeno introduces an explicit, deterministic design model. It
is architected for teams seeking to maintain deep control over their dependency
graph, request lifecycle, and execution boundaries. The framework does not claim
production superiority or industry dominance; instead, it offers an alternative
design pattern focused on programmatic composition, strict compile-time
validation, and runtime predictability.

Xeno is engineered to address the common pain points of architectural drift in
large applications by enforcing clean architectural boundaries. It structures
code into explicit layers—Presentation, Infrastructure, Application, and
Domain—ensuring that business logic remains completely decoupled from database
engines, HTTP clients, and third-party transport layers.

---

## What is the Core Design Philosophy of Xeno?

The design philosophy of Xeno prioritizes architectural determinism,
compile-time type safety, and strict separation of concerns. By implementing a
zero-magic dependency injection container and explicit module boundaries, the
framework eliminates captive dependencies and guarantees clean, testable
software boundaries across domain and infrastructure layers.

Xeno is built upon several foundational architectural pillars:

- **Explicit Dependency Injection** — The framework avoids auto-scanning
  directory trees or guessing registration scopes. Every service, repository,
  and controller must be programmatically registered inside an explicit registry
  using dedicated lifetime scopes. This guarantees that your dependency tree can
  be fully validated at bootstrap, preventing unexpected runtime lookup
  failures.
- **Asynchronous Execution Context Isolation** — Using Node.js
  `AsyncLocalStorage`, the underlying IoC container manages request-scoped
  lifecycles safely. It prevents cross-request state pollution and ensures that
  scoped dependencies (such as active database transactions or user contexts)
  are resolved consistently across the asynchronous execution path.
- **Clean Architecture and DDD Primacy** — Domain entities, value objects, and
  specifications are isolated from external delivery channels and persistent
  databases. Infrastructure concerns are kept strictly behind interfaces,
  allowing developers to switch from SQL to NoSQL, or from HTTP to gRPC, without
  modifying core application logic.
- **Command-Query Responsibility Segregation (CQRS)** — Write operations
  (Commands) and read operations (Queries) are processed through separate
  pipelines. This separation allows developers to tune data access strategies
  individually, implement targeted caching, and apply custom validation or
  performance monitoring strategies where they matter most.

### Architectural Blueprint: Data & Dependency Flow

The diagram below illustrates how Xeno handles request propagation through its
layered boundaries, using its native IoC container and middleware execution
stack to isolate contexts.

```mermaid
graph TD
    %% Presentation Layer
    A[HTTP Request / Client] --> B[Presentation Layer: Controllers & Middlewares]

    %% Middleware Context Boundary
    subgraph Context Isolation [AsyncLocalStorage Boundary]
        B --> C[Request Context Factory]
        C --> D[Service Scope Created]
    end

    %% Application Layer (Mediator & Pipelines)
    D --> E[Mediator: Send Request]
    subgraph Application Pipeline Stack [Middleware Execution Stack]
        E --> F[Validation Pipeline]
        F --> G[Authorization Pipeline]
        G --> H[Execution Pipeline / Handler]
    end

    %% Domain & Infrastructure Layers
    H --> I[Domain Layer: Entities & Value Objects]
    H --> J[Infrastructure Layer: Repositories & DB Client]
    J --> K[Data Store / Drizzle ORM]

    classDef presentation fill:#e1f5fe,stroke:#039be5,stroke-width:2px;
    classDef application fill:#e8f5e9,stroke:#43a047,stroke-width:2px;
    classDef domain fill:#fff8e1,stroke:#ffb300,stroke-width:2px;
    classDef infrastructure fill:#efebe9,stroke:#8d6e63,stroke-width:2px;

    class A,B,C,D presentation;
    class E,F,G,H application;
    class I domain;
    class J,K infrastructure;

```

---

## How to Manually Install and Bootstrap Xeno?

Manual installation of Xeno requires configuring the core npm package along with
key peer dependencies like TypeScript and Zod. Developers initialize the
application lifecycle using the fluent AppBuilder API, which programmatically
registers modules and establishes the asynchronous local storage boundary for
scoped dependency resolution.

Follow these steps to configure your environment and bootstrap a Xeno
application programmatically.

### 1. Package Installation

Install the core package along with its mandatory runtime and development peer
dependencies using your preferred package manager:

```bash
npm install @xeno/core zod
npm install --save-dev typescript @types/node

```

### 2. TypeScript Configuration

Xeno leverages modern TypeScript capabilities. Ensure your `tsconfig.json` is
configured to support ECMAScript 2023 target, modern module resolution, and
decorator metadata if you intend to utilize explicit decorators:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts"]
}
```

### 3. Implementing the Strongly-Typed Registry

Every Xeno application requires a custom registry definition that maps injection
tokens to concrete typings. This ensures strict compile-time type safety across
your dependency injection hierarchy:

```typescript
// src/infrastructure/registry.ts
import type { XenoRegistry } from '@xeno/core'

export interface MyCustomService {
  executeTask(): Promise<void>
}

export interface AppRegistry extends XenoRegistry {
  MY_CUSTOM_SERVICE: MyCustomService
}
```

### 4. Bootstrapping with AppBuilder

The programmatic bootstrap sequence utilizes the fluent `AppBuilder` class. This
pattern defines the order of module evaluation, executes setup actions with
system configurations, and builds the finalized `ServiceContainer`:

```typescript
// src/main.ts
import { AppBuilder } from '@xeno/core'
import type { AppRegistry, MyCustomService } from './infrastructure/registry'

class CustomService implements MyCustomService {
  public async executeTask(): Promise<void> {
    console.log(
      'Task executed successfully inside a strongly-typed DI container.',
    )
  }
}

async function bootstrap() {
  // 1. Initialize the AppBuilder using your custom application registry
  const builder = new AppBuilder<AppRegistry>()

  // 2. Queue framework modules and inject custom client-side services
  builder
    .addContext() // Enables asynchronous context tracking via AsyncLocalStorage
    .addLogger((config) => {
      config.console = true // Programmatically registers stdout logging
    })
    .addServices((container) => {
      // Programmatically register your custom services into the container
      container.addSingleton('MY_CUSTOM_SERVICE', () => new CustomService())
    })

  // 3. Finalize and evaluate registered modules
  const container = await builder.build()

  // 4. Resolve and execute services safely with full type-safety
  const service = container.resolve('MY_CUSTOM_SERVICE')
  await service.executeTask()
}

bootstrap().catch((error) => {
  console.error('Fatal bootstrap execution error:', error)
  process.exit(1)
})
```
