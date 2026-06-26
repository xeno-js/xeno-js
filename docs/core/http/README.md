# HTTP Request and Resilience

The Gear5 HTTP & Fault-Tolerance subsystem delivers an isolated, resilient, and
contract-agnostic communication architecture for distributed integrations. By
utilizing the _Bridge Pattern_, the framework completely decouples the low-level
transportation concerns (handled by Axios) from the resilience and recovery
mechanics (orchestrated by Cockatiel) through a unified data access facade.

```
                  [ Domain/Application Layer ]
                               │
                               ▼
                    [ IRemoteDataSource ]
                               │
                               ▼
                     [ ServiceResilience ] (Cockatiel Wrapper)
              ┌────────────────┴────────────────┐
              ▼                                 ▼
       (Transient Error?)                (Bulkhead/Breaker Checking)
              │                                 │
              └────────────────┬────────────────┘
                               │
                               ▼
                     [ IHttpClient ] (Axios Engine)
                               │
                               ▼
                         [ Remote API ]

```

## Documentation Roadmap

To configure, tune, and consume remote integration points within your services,
follow the architectural blueprints laid out in these dedicated technical
modules:

- **[HTTP Client Configuration](./http-client-configuration.md)**: Outlines the
  granular properties of the core transport layer, the `AxiosFactory` engine,
  and the automated setup routines provided by the `@gear5/create` scaffolding
  engine.
- **[Resilience & Fault Tolerance Configuration](./resilience-configuration.md)**:
  Explains the architectural composition of the Cockatiel-backed sandbox,
  covering exponential backoff retry parameters, consecutive circuit-breaking
  states, and bulkhead isolation strategies.
- **[Unified HTTP Core Module Guide](./http-core-module.md)**: Demonstrates how
  to orchestrate the transport and resilience modules together inside the
  container using the unified `RemoteDataSource` facade to execute safely typed
  remote transactions.
