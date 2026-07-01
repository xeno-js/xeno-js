---
title: Quick Start Guide
sidebar_position: 5
description:
  Bootstrap your first enterprise-grade, decorator-free XenoJS application using
  AppBuilder and the CQRS Mediator.
keywords:
  - appbuilder
  - bootstrap
  - mediator
  - dependency injection
  - quick start
  - setup
---

# Quick Start Guide

## Introduction

This guide provides an end-to-end walkthrough for spinning up a production-ready
application using the XenoJS kernel engine [cite: 9]. You will configure a
highly decoupled, multi-tenant capable host from scratch using the explicit,
fluent `AppBuilder` API, resolve the central pipeline mediator, and dispatch
your first transaction command safely [cite: 1, 9].

---

## Scaffolding Options

You can instantly generate the necessary Clean Architecture directory topology
and configurations by employing the official scaffolding tool [cite: 9]:

```bash
npx @xeno/create my-xeno-app

```

During execution, the CLI presents an interactive setup allowing you to toggle
targeted modules (`Drizzle ORM`, `Axios`, `Pino`, `Sentry`, `ioredis`, or
`Supabase`) . Alternatively, you can bypass prompts using execution flags :

- `--full`: Automates generation with every premium enterprise plugin active .

- `--empty`: Provision an ultra-minimal kernel configuration with zero baseline
  infrastructure attachments .

---

## Structural Assembly Blueprint

A standard XenoJS execution host splits its initialization lifecycle across two
main modules inside the `src/` ring: `src/bootstrap.ts` and `src/main.ts` .

```text
src/
 ├── bootstrap.ts  # House the configuration logic of the fluent AppBuilder
 └── main.ts       # Orchestrate runtime startup and trigger delivery servers

```

---

## 1. Composing the Host Setup (`src/bootstrap.ts`)

The `bootstrap.ts` module isolates the initialization of the Inversion of
Control (IoC) graph . By assembling layers explicitly without decorators,
startup computation runs with sub-millisecond execution overhead .

```typescript
import {
  AppBuilder,
  LOG_LEVEL,
  TokenHelper,
  INJECTION_TOKENS,
} from '@xeno/core'

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
      config.http.client.baseURL =
        '[https://api.enterprise-domain.local](https://api.enterprise-domain.local)'
      config.http.client.timeoutMs = 5000
      config.resilience.retry.attempts = 3
    })

    // 5. Integrate typed relational data persistence (Drizzle ORM)
    .addDb((config) => {
      config.connectionString =
        process.env.DATABASE_URL || 'postgres://postgres:pass@localhost:5432/db'
      config.tables = {} // Register drizzle PgTable mappings here
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

:::info XenoJS operates with strict **Optional Peer Dependencies** . If you
activate a component block within the builder (e.g., `.addDb()` or
`.addLogger()`), you must ensure that your package layer holds the required
underlying provider libraries (`drizzle-orm`, `pino`, `pg`, `axios`) . :::

---

## 2. Setting the Entry Point Mechanics (`src/main.ts`)

The `main.ts` entry file acts as the primary orchestrator that triggers the boot
logic, instantiates the runtime thread context, and binds the kernel to your
preferred transport server framework (Hono, Fastify, CLI, or Cloud event stream
handlers) .

```typescript
import { bootstrap } from './bootstrap.js'
import { INJECTION_TOKENS } from '@xeno/core'

/**
 * @description Application kernel runtime initialization coordinator.
 */
async function main() {
  try {
    console.log('  Bootstrapping XenoJS execution container...')

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

---

## 3. Execution Pipeline in Action: Dispatching a Command

Once the container infrastructure is operational, transaction scenarios flow
natively through the core system Mediator . Every request payload is verified
against schema invariants, evaluated for multitenancy structural constraints,
logged, and isolated within isolated transactional scopes automatically before
hitting your final handler .

Here is how you execute an action scenario securely inside your presentation
delivery ring:

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

---

## Architectural Trade-offs & Common Mistakes

### ❌ Relying on Automated Implicit Wire Registration

XenoJS prioritizes absolute clarity and execution speed over implicit
configuration scanning . It does not parse file structures at startup . If you
generate a new Command Handler, Query Handler, or custom infrastructure data
service, it **will not be discovered automatically** by the kernel. You must
register its nominal association inside your `bootstrap` orchestration setup
using clear token associations .

### ❌ Violating Execution Context Boundaries

Never bypass `IRequestContext` to pass request identifiers or authorization
state parameters directly into inner service constructor methods . Let
`RequestContextMiddleware` handle the lifecycle context internally using
`AsyncLocalStorage` bounds, ensuring code decoupled testability remains intact .

---

## Next Steps

With your baseline application host constructed and operational, deepen your
technical understanding of how XenoJS controls system execution internally:

- **[Type-Safe Dependency Injection](https://www.google.com/search?q=../core-runtime-mechanics/type-safe-dependency-injection.md)**:
  Explore token nominal branding mechanisms and phantom type compile guarantees
  .

- **[Execution Context Lifecycle](https://www.google.com/search?q=../core-runtime-mechanics/execution-context-lifecycle.md)**:
  Master the internals of multi-tenant async memory tracking . """
