# Core

Documentation for the `@gear5/core` framework package, its modules, APIs, and
runtime dependencies.

## Guides

- [Injection tokens](./dependency-injection/tokens.md): create stable
  application-level DI tokens with `TokenHelper`.
- [Modules and dependencies](./modules-and-dependencies.md): map CLI choices to
  installed packages and enabled Gear5 APIs.
- [Database](./database/README.md): configure Drizzle/PostgreSQL and build data
  access with Gear5 primitives.
- [Cache](./cache/README.md): configure Redis or InMemory providers to handle
  application-level caching and idempotency strategies.

## Cache

- [Configuration](./redis-configuration.m): setup `InMemoryCache` for
  development or `RedisCache` for production environments.

## Dependency Injection

- [Tokens](./dependency-injection/tokens.md): understand what injection tokens
  are, why Gear5 uses them, and how to centralize app tokens in `src/tokens.ts`.

## Database

- [Setup](./database/setup.md): scaffold an app with the database option
  enabled.
- [Schema and bootstrap](./database/schema-and-bootstrap.md): define Drizzle
  tables and register them with `AppBuilder`.
- [Data sources](./database/datasources.md): choose between hard delete and soft
  delete write data sources.
- [Filter builder](./database/filter-builder.md): translate Gear5 criteria into
  Drizzle conditions and projections.
- [Repositories and DAOs](./database/repositories-and-daos.md): compose data
  sources, mappers, repositories, and read DAOs.
