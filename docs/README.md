# Gear5 Developer Docs

This directory contains the operational documentation for building with Gear5.

## Documentation Tree

```text
docs/
  README.md
  getting-started/
    README.md
    installation.md
  cli/
    README.md
    create-gear5.md
  core/
    README.md
    app_builder/
      README.md
      dependency-injection-lifetime.md
      module-service-registration.md
    auth/
      README.md
      how-to-use.md
      supabase-configuration.md
    cache/
      README.md
      idempotency-and-ordering.md
      redis-configuration.md
    dependency-injection/
      README.md
      tokens.md
    modules-and-dependencies.md
    database/
      README.md
      setup.md
      schema-and-bootstrap.md
      datasources.md
      filter-builder.md
      repositories-and-daos.md
    http/
      README.md
      http-client-configuration.md
      http-core-module.md
      resilience.configuration.md
    logging/
      README.md
      configure-logger.md
      custom-providers.md
      pino-configuration.md
      sentry-configuration.md
    pipelines/
      README.md
      authz/
        README.md
        configuration.md
        tenant-strategy.md
        policies/
          role-policiy-configuration.md
          permission-policy-configuration.md
        custom-strategy-authz.md
      concurrency/
        README.md
      exception/
        README.md
      idempotency
        README.md
      logging/
        README.md
      performance/
        README.md
      query_caching/
        README.md
      validation/
        README.md
        zod-configuration.md
        custom-validation.md
    domain/
      README.md
      entities/
        README.md
      functional/
        README.md
      value_objects/
        README.md
    presentation/
      README.md
      middleware/
        README.md
        configuration.md
        http-header-exctraction.md
        request-context-execution.md
      controllers/
        README.md
    shared/
      README.md
      utils/
        README.md
        guards.md
        helpers.md
  demo/
    README.md
  contributing/
    README.md
    local-development.md
```

## Recommended Paths

- [Getting started](./getting-started/installation.md): framework installation
  and first project setup.
- [CLI create-gear5](./cli/create-gear5.md): how to use the `@gear5/create`
  package and its scaffolding modes.
- [Injection tokens](./core/dependency-injection/tokens.md): define application
  tokens with `TokenHelper`.
- [Modules and dependencies](./core/modules-and-dependencies.md): what each CLI
  option installs and which APIs it enables.
- [AppBuilder](./core/app_builder/README.md): what is and how to use AppBuilder
  container
- [Database](./core/database/README.md): configure Drizzle/PostgreSQL and use
  Gear5 data sources, repositories, and filters.
- [Cache](./core/cache/README.md): configure Redis or InMemory storage for
  optimized data access and idempotency.
- [Logging](./core/logging/README.md): configure Console or Pino or Sentry
  logger or custom logger for logging data
- [Http](./core/http/README.md): configure http client service with cockatiel
  resilience
- [Pipelines](./core/pipelines/README.md): define and configure gear5/core
  pipelines
- [Auth](./auth/README.md): how to configure and use supabase auth
- [Domain](./core/domain/README.md): Entities, Result monade, Application Error
  and Value Object overview
- [Presentation Core](./core/presentation/README.md): BaseController and
  Middleware overview
- [Shared Core](./core/presentation/README.md): Utilis, types and constants
  overview
- [Local development](./contributing/local-development.md): repository setup,
  build, test, and local publishing workflow.
- [Demo](./demo/README.md): Executable demo

## Where to Add New Docs

- Use `getting-started/` for first-run guides, installation flows, and
  onboarding tutorials.
- Use `cli/` for documentation about `@gear5/create` and future command-line
  tools.
- Use `core/` for framework concepts, modules, APIs, dependency behavior, and
  runtime architecture.
- Use `contributing/` for repository setup, local workflows, release notes, and
  maintainer guides.

## Documented Version

These documents describe the current repository behavior:

- core package: `@gear5/core`
- create package: `@gear5/create`
- Node.js required by the core package: `>=20.0.0`
