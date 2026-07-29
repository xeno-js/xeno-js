---
title: Quick Start Guide
sidebar_position: 5
description:
  Step-by-step technical guide to bootstrapping a decorator-free Xeno
  application workspace using the AppBuilder configuration API and the CQRS
  Mediator.
keywords:
  - xeno appbuilder configuration
  - bootstrap cqrs typescript
  - mediator dispatch execution
  - clean architecture scaffolding
  - typescript dependency injection
---

# Quick Start Guide

The Quick Start Guide provides a step-by-step procedural walkthrough for
initializing an application workspace, configuring runtime modules using the
explicit `AppBuilder` API, and executing a transaction command payload through
the Mediator bus.

---

## Direct Definition Block

The `Quick Start Guide` describes the foundational composition mechanics
required to assemble a functional, transport-agnostic Xeno execution kernel. It
maps out how to structure initialization sequences without runtime metadata
annotations, establishing a typed, deterministic pipeline ready to host
enterprise use cases.

---

## Scaffolding Options

### What it is

Scaffolding Options represent the initialization commands provided by the
framework command-line interface (`@xeno/cli`) to automate the generation of a
standard Clean Architecture directory matrix.

### How it works

Executing the initializer utility prompts an interactive configuration selector
or parses absolute compilation flags directly from the terminal console:

```bash
npx @xeno/cli my-xeno-app

```

The generation logic maps project assets based on the following specific
execution flags:

- `--full`: Automates workspace initialization with all external infrastructure
  provider integrations pre-configured.
- `--empty`: Provision an un-opinionated, minimal execution kernel featuring
  zero optional external library dependencies.

### Why it exists

Manual workspace setup exposes code layout configurations to variance and human
organizational errors. The scaffolding utility guarantees that all directory
setups mirror the exact layer isolation and compilation rules required by the
internal lint tracking engine.

---

## Structural Assembly Blueprint

A standard Xeno execution engine partitions its system boot lifecycles across
two distinct source modules located within the presentation or root folder:

```text
src/
 ├── bootstrap.ts  # Configures the programmatic AppBuilder layout and compiles the IoC container
 └── main.ts       # Initializes the execution runtime thread and binds the compiled container to a transport server

```

---

## 1. Composing the Host Setup (`src/bootstrap.ts`)

#### Definition

Composing the host setup is the phase where external infrastructure providers,
core pipeline strategies, and structural application bindings are explicitly
registered into the dependency container.

#### Behavior

The initialization logic acts through a programmatic, fluid `AppBuilder` script
that executes linearly without triggering decorators, file-system scanning, or
metadata reflection loops.

```typescript
import {
  AppBuilder,
  LOG_LEVEL,
  TokenHelper,
  INJECTION_TOKENS,
} from '@xeno/core'

import { INVOICE_DATA_SOURCE_TOKEN, INVOICE_API_TOKEN } from './tokens.ts'

/**
 * @description Assembles the application runtime container and configures
 * the cross-cutting CQRS execution pipelines agnostically.
 */
export async function bootstrap() {
  const builder = new AppBuilder()

  builder
    // 1. Activate baseline context layers
    .addMiddlewares()
    .addContext()

    // 2. Configure telemetry logging drivers (e.g., Pino)
    .addLogger((config) => {
      config.console = true
      config.level = LOG_LEVEL.INFO
    })

    // 3. Construct the CQRS Pipeline Behavior Chain
    .addPipeline((config) => {
      config.authorization.tenant = true
      config.commandBus.idempotency = { lockTtlSeconds: 60 }
      config.commandBus.concurrency = { maxRetries: 3 }
      config.queryBus.isEnabled = true
    })

    // 4. Attach resilient external HTTP channels (Axios + Cockatiel)
    .addHttpCore((config) => {
      config.dataSourceToken = INVOICE_DATA_SOURCE_TOKEN
      ;((config.http.client.token = INVOICE_API_TOKEN),
        (config.http.client.baseURL = 'https://api.enterprise-domain.local'))
      config.http.client.timeoutMs = 5000
      config.resilience.retry.attempts = 3
    })

    // 5. Integrate typed relational data persistence (Drizzle ORM)
    .addDb((config) => {
      config.connectionString =
        process.env.DATABASE_URL || 'postgres://postgres:pass@localhost:5432/db'
      config.tables = {} // Register Drizzle PgTable mappings here
    })

    // 6. Anchor Zero-Trust Identity Providers (Supabase Auth Client)
    .addAuthentication((config) => {
      config.url =
        '[https://your-project.supabase.co](https://your-project.supabase.co)'
      config.key = 'your-anon-public-jwt-key'
    })

  // Finalize graph compilation and seal the IoC container
  const container = await builder.build()
  return container
}
```

#### Effect

This structural format eliminates application bootstrap overhead, ensuring that
container graph resolution executes within sub-millisecond ranges.

:::info Xeno utilizes an explicit Optional Peer Dependencies engineering model.
Activating specific configuration blocks (such as `.addDb()` or `.addLogger()`)
requires that the root workspace manifest explicitly holds the corresponding
peer package assets (`drizzle-orm`, `pino`, `pg`, `axios`). :::

---

## 2. Setting the Entry Point Mechanics (`src/main.ts`)

#### Definition

The Entry Point Mechanics module governs the physical system execution launch
sequence, catching startup failures and mapping the agnostic kernel to concrete
transport listeners.

#### Behavior

The entry execution script calls the compiled initialization graph, resolves the
primary pipeline Mediator engine using an explicit token reference, and prepares
the transport environment for network connections.

```typescript
import { bootstrap } from './bootstrap.js'
import { INJECTION_TOKENS } from '@xeno/core'

/**
 * @description Application kernel runtime initialization coordinator.
 */
async function main() {
  try {
    console.log('  Bootstrapping Xeno execution container...')

    // Resolve compiled dependency graph container
    const container = await bootstrap()

    console.log('  Application graph successfully synchronized!')

    // Example: Trigger your external network delivery mechanism here
    // const server = container.resolve(MY_PRESENTATION_SERVER_TOKEN);
    // await server.start();

    // For immediate reference, resolve the compiled Mediator engine directly
    const mediator = container.resolve(INJECTION_TOKENS.MEDIATOR)
    console.log('  CQRS Mediator bus sealed and online.')
  } catch (error) {
    console.error(
      '  Critical system fault captured during runtime startup:',
      error,
    )
    process.exit(1)
  }
}

main()
```

#### Effect

This decouples system bootstrapping from specific runtime environments, allowing
identical core containers to run interchangeably across long-running background
daemons, HTTP web servers, or serverless functions.

---

## 3. Execution Pipeline in Action: Dispatching a Command

#### Definition

Dispatching a Command is the operational runtime phase where an external
presentation wrapper feeds a raw action payload directly into the system
use-case pipeline.

#### Behavior

The presentation layer resolves the primary Mediator instance, encapsulates
parameters inside a rigid request payload format, and monitors outcome routing
flags using standard result envelopes.

```typescript
import { INJECTION_TOKENS } from '@xeno/core'

async function handleIncomingWebRequest(container: any, rawPayload: any) {
  // 1. Resolve the decoupled Mediator engine
  const mediator = container.resolve(INJECTION_TOKENS.MEDIATOR)

  // 2. Prepare your structural use-case criteria action (Example command envelope)
  const command = {
    type: 'COMMAND',
    intent: 'create-user-account',
    payload: {
      email: rawPayload.email,
      fullName: rawPayload.name,
    },
  }

  // 3. Dispatch directly down the pipeline chain
  const result = await mediator.send(command)

  // 4. Handle response patterns using the Result Monad
  if (!result.isOk()) {
    const errorDetails = result.getErrorOrThrow()
    console.error(`Execution rejected with code: [${errorDetails.code}]`)
    return {
      success: false,
      status: errorDetails.status,
      message: errorDetails.message,
    }
  }

  const successData = result.getValueOrThrow()
  return {
    success: true,
    data: successData,
  }
}
```

#### Effect

This pattern passes the request payload sequentially through the configuration
interceptor rings (Validation, Concurrency, and Idempotency), halting process
propagation prior to use-case handler evaluation if an operational validation
limit is breached.

---

## Architectural Constraints & Trade-offs

- **Explicit Registry Overhead Over Directory Crawling**: Because Xeno does not
  perform automated folder scanning or dynamic file tracking, every new use-case
  handler or infrastructural component must be manually configured inside the
  `AppBuilder` configuration sequence. Omiting manual registration results in an
  instant container resolution error.
- **Separation of Communication and Context Primitives**: Transferring network
  parameters directly into business layer components via constructor objects is
  prohibited by the architectural layers. All context tracking must flow
  strictly through the `IRequestContext` abstraction using Node.js
  `AsyncLocalStorage` memory cells.

---

## Next Steps

To continue setting up and optimizing the application workspace, proceed to the
following architectural sections:

- **[Architecture Layers](./architectural-layers-boundaries)**: Review code
  isolation constraints and compilation policies enforced across domain
  boundaries.
- **[CQRS System](../cqrs-pipeline-architecture/README)**: Construct decoupled
  Command and Query pipelines using the explicit Mediator abstraction layer.
- **[Dependency Injection Container](../core-architecture/README)**: Configure
  dependency token registration profiles inside the explicit `AppBuilder`
  workspace.
