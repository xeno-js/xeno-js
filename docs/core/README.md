# Core

Documentation for the `@gear5/core` framework package, its modules, APIs, and
runtime dependencies.

## Guides

- [AppBuilder](./app_builder/README.md): what is and how to use AppBuilder
  container
- [Injection tokens](./dependency-injection/tokens.md): create stable
  application-level DI tokens with `TokenHelper`.
- [Modules and dependencies](./modules-and-dependencies.md): map CLI choices to
  installed packages and enabled Gear5 APIs.
- [Database](./database/README.md): configure Drizzle/PostgreSQL and build data
  access with Gear5 primitives.
- [Cache](./cache/README.md): configure Redis or InMemory providers to handle
  application-level caching and idempotency strategies.
- [Logging](./logging/README.md): configure Pino, Sentry or Console logger
- [Http](./http/README.md): configure axios client and cockatiel service
- [Pipelines](./pipelines/README.md): understand what is pipeline and how to use
- [Auth](./auth/README.md): how to configure and use supabase auth

## AppBuilder

- [Services Registration](./app_builder/dependency-injection-lifetimes.md): how
  to register class with different lifetime
- [Module Registration](./app_builder/module-service-registration.md): how to
  register module

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

## Logging

- [Configuration](./logging/configure-logger.md): configure logger
- [Pino](./logging/pino-configuration.md): configure Pino logger
- [Sentry](./logging/sentry-configuration.md): configure Sentry logger
- [CustomLoggerConfiguration](./logging/custom-providers.md): configure a custom
  logger

## Auth

- [Configuration](./auth/supabase-configuration.md): configure supabase auth
  service
- [How-to-Use](./auth/how-to-use.md): how to use auth service

## Http

- [Configuration](./http/http-client-configuration.md): configure http axios
- [Resilience](./http/resilience-configuration.md): configure Cockatiel
  resilience service
- [Core](./http/http-core-module.md): configure http core module

## Pipilines

- [Authorization](./pipelines/authz/README.md): define authorization behavior
- [Concurrency](./pipelines/concurrency/README.md): define concurrency behavior
- [Exception](./pipelines/exception/README.md): define exception behavior
- [Idempotency](./pipelines/idempotency/README.md): define idempotency behavior
- [Logging](./pipelines/logging/README.md): define logging behavior
- [Performance](./pipelines/performance/README.md): define performance behavior
- [QueryCaching](./pipelines/query_caching/README.md): define query caching
  behavior
- [Validation](./pipelines/validation/README.md): define validation behavior
