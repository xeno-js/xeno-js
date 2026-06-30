# Application Hosting & Bootstrap Engine

## Overview

The Gantry5 initialization ecosystem relies on the **`AppBuilder`** pattern to
coordinate application configuration, module compilation, and service
registration. Drawing inspiration from modern enterprise application hosting
models (such as the .NET `WebApplicationBuilder`), `AppBuilder` exposes a
type-safe, fluent API to chain infrastructure middleware layers, construct
database clients, toggle CQRS pipelines, and isolate dependency graphs inside a
single, unified Inversion of Control (IoC) repository.

```

[ src/main.ts (Entrypoint) ]
│
▼ Calls
[ src/bootstrap.ts ] ──► Chains Fluent Configurations (.addLogger, .addCache, etc.)
│
▼ Compiles Loop
[ AppBuilder ] ────► Builds and Hydrates ────► [ ServiceContainer ]
│
┌────────────────────────────────────────────────┴──────────────────────────────┐
▼ Binds                                                                         ▼ Resolves
[ Core Kernel Infrastructure ]                                                   [ Use-Case Modules ]

```

---

## The Bootstrap Lifecycle Architecture

When creating a brand-new project layout via the `@Gantry5/create` CLI
scaffolding engine, the workspace architecture separates configuration mechanics
from application runtime loops across two specific structural layers:

### 1. The Configuration Hub (`src/bootstrap.ts`)

This file handles the configuration of the application host. It instantiates the
fluent `AppBuilder` engine, binds environmental keys, registers module
boundaries, and orchestrates cross-cutting concern configurations (such as
caching, database connections, and logging boundaries).

- **Operational Constraint**: This layer does not run application logic. Its
  sole objective is to compile configurations and return the fully initialized
  container client (`IServiceContainer`).

```typescript
// Architectural Blueprint of src/bootstrap.ts
import { AppBuilder } from '@gantry5/core'

export async function bootstrap() {
  const builder = new AppBuilder()

  builder
    .addContext()
    .addMiddlewares()
    .addPipeline((opts) => {
      opts.performance.thresholdMs = 500
    })
  // Core infrastructure modules configuration is covered in dedicated manuals

  // Finalizes the configuration sequence and returns the hydrated container
  return await builder.build()
}
```

### 2. The Runtime Entrypoint (`src/main.ts`)

This file represents the operational runtime entry point of your compiled
process. It imports the asynchronous compilation routine from `bootstrap.ts`,
resolves top-level execution servers or event listeners from the container
instance, and starts the system loop.

```typescript
// Architectural Blueprint of src/main.ts
import { bootstrap } from './bootstrap.js'

async function main() {
  try {
    console.log('⏳ Bootstrapping @gantry5 application...')

    // 1. Compile the framework infrastructure layers
    const container = await bootstrap()

    console.log(
      '✅ Application container structural layout hydration complete!',
    )

    // 2. Resolve your presentation server or worker node token from the container
    // const webServer = container.resolve(INJECTION_TOKENS.HTTP_SERVER);
    // await webServer.start();
  } catch (error) {
    console.error(
      '❌ Critical error during application startup sequence:',
      error,
    )
    process.exit(1)
  }
}

main()
```

---

## Documentation Roadmap

To understand how to expand your system bounds, add bespoke use-cases, and
master the structural lifecycle engine of the container host, consult the
respective technical manuals:

- **[Module & Service Registration Guide](./module-service-registration.md)**:
  Explains the architectural layout behind custom feature partitioning using
  macro modules or immediate service token binding configurations.
- **[Dependency Injection Lifetimes Manual](./dependency-injection-lifetimes.md)**:
  Deep dives into the core lifecycle engines (`singleton`, `scoped`,
  `transient`) that manage instance allocation behaviors and construction
  mechanics.
- _(Infrastructure specific registration methods such as `.addLogger()`,
  `.addCache()`, and `.addDb()` are covered within their respective telemetry
  and database documentation subdirectories)._
