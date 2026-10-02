# Architectural Proposal: Decoupling Database Context (`DB_CONTEXT`)

## The Problem

Currently, the `DbContext` type inside `@xeno-js/core` is defined as a union
type supporting multiple database engines (e.g., PostgreSQL via `node-postgres`
and SQLite via `@libsql/client`). While this provides flexibility, it introduces
a significant drawback: developers are forced to install underlying database
drivers and ORM packages they might not be using in their specific application.

## The Goal

We want to decouple database contexts so that:

1. **Zero Unused Dependencies:** An application using SQLite does not need to
   install PostgreSQL packages, and vice versa.
2. **Type Safety via Generics:** The `DB_CONTEXT` type should remain strictly
   typed through the application's `XenoRegistry`, resolving only the specific
   database client chosen by the developer.
3. **Modular Adapters:** Data sources and database modules must accept generic
   database contexts rather than a rigid union type.

## How to Contribute / Implement

When contributing database-related features or refactoring data sources:

- Avoid hardcoding database-specific drivers or union types inside core
  abstractions.
- Utilize the generic `TSchema` and specialized `DbContext<TSchema>` definitions
  provided in `infrastructure/db/db.types.ts`[cite: 2].
- Ensure new data source factories isolate their peer dependencies so they are
  loaded on-demand only when selected in the `AppBuilder`.
