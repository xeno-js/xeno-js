---
title: Database Persistence Layer
sidebar_position: 7
slug: ./
description:
  Technical index and architectural overview of the database module,
  transactional unit of work context, and structural repository pattern in Xeno.
keywords:
  - database persistence
  - drizzle orm
  - repository pattern
  - db context
  - transaction management
  - xeno core
---

# Database Persistence Layer

## Definition

This chapter documents how XenoJS models persistence through Db module
configuration, repository abstractions, datasource contracts, and transactional
database context boundaries.

## What It Is

Definition: The Persistence layer is the boundary between Domain/Application
logic and physical database operations.

Behavior:

- AppBuilder.addDb registers database configuration through DbConfig
- IRepository`<T>` exposes entity-level CRUD operations returning ResultType
- IWriteDataSource`<TDto>` performs DTO-level read/write operations
- Repository`<T, TDto>` maps entities and DTOs through IMapper
- IDbContext defines transactional boundaries with runInTransaction

Effect: Business handlers operate on Domain entities and contracts without
direct coupling to SQL clients or ORM-specific APIs.

## How It Works

Definition: The current architecture splits responsibilities between
configuration, transaction context, datasource access, and mapping.

Behavior:

- Configuration:
  - DbConfig includes connectionString, tables, and useOnlyPoolClient
  - AppBuilder.addDb queues Db module registration during bootstrap
- Repository flow:
  - findById/find return mapped entities
  - save/update/delete map entities to DTO payloads
  - repository methods return Result.ok outcomes
- Cancellation:
  - Repository and datasource contracts accept optional AbortSignal

Effect: Persistence logic remains explicit, composable, and testable across
Infrastructure and Application layers.

## Why It Exists

Definition: The layer isolates infrastructure concerns from Domain model
behavior.

Behavior: DTO mapping, query execution, and transaction orchestration are
centralized in specialized components instead of spreading data-access concerns
through handlers.

Effect: The codebase remains easier to evolve, test, and maintain when storage
technology or schema details change.

## Architectural Topology

The diagram below summarizes the high-level interaction path:

```mermaid
graph TD
    subgraph UseCase [Application Layer]
        A[Use-Case Handler] -->|runInTransaction| B[IDbContext Wrapper]
    end

    subgraph Boundaries [Persistence Layer Abstractions]
        B -->|Invoke CRUD Operations| C[Generic IRepository]
        C -->|1. Map Entity to DTO| D[IMapper Service]
        C -->|2. Pass Clean DTO Shape| E[IWriteDataSource]
    end

    subgraph Infrastructure [Concrete Data Providers]
        E -->|Execute Queries / Commands| F[Drizzle DbClient]
        F -->|Relational Mapping| G[(PostgreSQL Cluster)]
    end

    D -.->|toEntity / toDto| C

```

## Document Directory

Read this chapter in order:

### 1. [Database Module & Client Configuration](./database-bootstrapping/README)

Definition: Bootstrap configuration of database services and client wiring.

Behavior: Focuses on DbConfig fields, module registration, and dependency
container setup.

Effect: Establishes connection and table schema dependencies used by
datasources.

### 2. [Database Context & Transaction Management](./db-context-transactions)

Definition: Transactional boundary management through IDbContext.

Behavior: Covers begin/commit/rollback contracts and runInTransaction usage.

Effect: Improves atomicity and consistency in multi-operation write scenarios.

### 3. [The Generic Repository Pattern](./generic-repository-pattern)

Definition: Entity-centric data access built on IRepository and
Repository`<T, TDto>`.

Behavior: Explains mapping between domain entities and datasource DTO models.

Effect: Keeps domain code independent from persistence record shapes.

## Setup Example

The bootstrap below shows a valid addDb configuration:

```typescript
import { AppBuilder } from '@xeno/core'
import type { IServiceContainer } from '@xeno/core'
import { usersTable, postsTable } from './infrastructure/schemas/db.schema.js'

export async function bootstrap(): Promise<IServiceContainer> {
  const builder = new AppBuilder()

  builder.addDb((opts) => {
    opts.connectionString =
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/xeno'
    opts.tables = {
      users: usersTable,
      posts: postsTable,
    }
    opts.useOnlyPoolClient = false
  })

  return await builder.build()
}
```

## Constraints / Limitations

Definition: The current persistence contracts define explicit boundaries and
trade-offs.

Behavior:

- Repository methods return ResultType but depend on mapper and datasource
  correctness
- runInTransaction requires an operation that already returns ResultType
- AbortSignal support is optional and must be forwarded by callers
- addDb configuration is applied once per queued module registration path

Effect: Reliable persistence behavior depends on consistent mapper
implementations, proper signal propagation, and disciplined bootstrap
configuration.

## Next Step

Continue with
[Database Module & Client Configuration](./database-bootstrapping/README).
