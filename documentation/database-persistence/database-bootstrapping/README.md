---
title: Database Client & Schema Bootstrapping
sidebar_position: 3
description:
  Technical manual explaining Xeno flexible database bootstrapping options,
  connection pooling customization, and Drizzle ORM client schema
  configurations.
keywords:
  - database client
  - schema bootstrap
  - xeno core
  - db_pool_client
  - db_orm_client
  - connection pooling
  - framework customization
---

# Database Client & Schema Bootstrapping

## Definition

This page documents how XenoJS bootstraps database dependencies through
AppBuilder.addDb and DbModule.

## What It Is

Definition: Database bootstrapping is the configuration boundary that wires
connection pooling and optional ORM client services into the dependency
container.

Behavior:

- AppBuilder.addDb accepts DbConfig
- DbModule always registers DB_POOL_CLIENT
- DbModule registers DB_ORM_CLIENT only when useOnlyPoolClient is false
- DB_ORM_CLIENT uses DrizzleOrmClient with the configured tables registry

Effect: Projects can choose raw pool-only access or pool plus ORM access without
changing application-layer contracts.

## How It Works

Definition: Bootstrapping behavior depends on DbConfig.useOnlyPoolClient.

Behavior:

- Shared setup:
  - DbClientFactory creates a pg Pool from connectionString
  - drizzle client is exposed as DB_POOL_CLIENT
- Pool-only mode (useOnlyPoolClient: true):
  - DB_POOL_CLIENT is available
  - DB_ORM_CLIENT is not registered
- ORM mode (useOnlyPoolClient: false):
  - DB_POOL_CLIENT is available
  - DB_ORM_CLIENT is registered via DrizzleOrmClient
  - tables must be defined; otherwise resolving DB_ORM_CLIENT throws DbModule:
    tables configuration is required when useOnlyPoolClient is false.

Effect: The container exposes only the services compatible with the selected
mode.

## Why It Exists

Definition: The layer separates database wiring concerns from repository and
handler logic.

Behavior: Connection initialization, token registration, and table registry
requirements are centralized in module configuration.

Effect: Runtime behavior is predictable and configuration errors are surfaced at
the infrastructure boundary.

## Topology

The diagram below summarizes mode selection:

```mermaid
flowchart TD
    A[AppBuilder.addDb] --> B[DbModule.configure]
    B --> C[Register DB_POOL_CLIENT]
    C --> D{useOnlyPoolClient}
    D -->|true| E[Skip DB_ORM_CLIENT]
    D -->|false| F[Register DB_ORM_CLIENT]
    F --> G{tables defined?}
    G -->|no| H[Throw config error on resolve]
    G -->|yes| I[Create DrizzleOrmClient]

```

## Mode 1: Pool Only

Definition: Use this mode when you only need direct access to the pooled
database client.

Behavior:

- Set useOnlyPoolClient to true
- Do not rely on DB_ORM_CLIENT

Effect: You can execute low-level queries through DB_POOL_CLIENT.

```typescript
import { AppBuilder } from '@xeno/core'
import type { IServiceContainer } from '@xeno/core'

export async function bootstrap(): Promise<IServiceContainer> {
  const builder = new AppBuilder()

  builder.addDb((opts) => {
    opts.connectionString =
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/xeno'
    opts.useOnlyPoolClient = true
  })

  return await builder.build()
}
```

### Consuming DB_POOL_CLIENT

```typescript
import { INJECTION_TOKENS } from '@xeno/core'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { Pool } from 'pg'

export class CustomUserQueryService {
  constructor(
    private readonly dbPoolClient: NodePgDatabase<Record<string, never>> & {
      $client: Pool
    },
  ) {}

  public async fetchActiveUserEmails(): Promise<string[]> {
    const rawResult = await this.dbPoolClient.$client.query(
      'SELECT email FROM users WHERE is_active = $1',
      [true],
    )

    return rawResult.rows.map((row: { email: string }) => row.email)
  }
}

builder.addServices((services) => {
  services.addSingleton(
    CUSTOM_USER_QUERY_SERVICE_TOKEN,
    CustomUserQueryService,
    [INJECTION_TOKENS.DB_POOL_CLIENT],
  )
})
```

## Mode 2: Pool + ORM

Definition: Use this mode when you need DrizzleOrmClient via DB_ORM_CLIENT.

Behavior:

- Set useOnlyPoolClient to false
- Provide tables mapping

Effect: Infrastructure services can resolve DB_ORM_CLIENT for structured CRUD
flows.

### Bootstrap Setup

```typescript
import { AppBuilder } from '@xeno/core'
import type { IServiceContainer } from '@xeno/core'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

const positionsTable = pgTable('positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
})

export async function bootstrap(): Promise<IServiceContainer> {
  const builder = new AppBuilder()

  builder.addDb((opts) => {
    opts.connectionString =
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/xeno'
    opts.useOnlyPoolClient = false
    opts.tables = {
      positions: positionsTable,
    }
  })

  return await builder.build()
}
```

## Constraints / Limitations

Definition: Database bootstrapping has explicit configuration constraints.

Behavior:

- DB_ORM_CLIENT is unavailable in pool-only mode
- ORM mode requires tables mapping
- addDb is queued once per AppBuilder instance

Effect: Service registrations should depend only on tokens guaranteed by the
chosen mode.

## Next Step

Continue with
[Database Context & Transaction Management](../db-context-transactions.md).
