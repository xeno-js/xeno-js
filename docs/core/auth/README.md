## Overview

The Gear5 Identity & Access Control subsystem delivers an enterprise-grade,
decoupling-first architecture for managing authentication (**AuthN**) and
authorization (**AuthZ**) in high-performance TypeScript applications. Designed
around Domain-Driven Design (DDD) principles and Clean Architecture, it cleanly
isolates presentation-layer request extractors from structural token checkers,
domain validation gates, and cloud platform providers.

```
       [ HTTP Request ]
              │
              ▼
  [ RequestContextMiddleware ] ───► Extract Bearer Token
              │
              ▼
        [ GateKeeper ] ───────────► Authenticate via IAuthService (Supabase)
              │
              ▼
  [ AuthorizationPipeline ] ──────► Evaluate Policies (Roles / Permissions / Tenants)
              │
              ▼
     [ Core Application ]

```

## Documentation Roadmap

To implement, customize, and extend the identity lifecycle within an
application, read the technical documentation manuals structured across the
following modules:

- **[Supabase Configuration Manual](https://www.google.com/search?q=supabase-configuration.md)**:
  Details the automated initialization of the infrastructure through the
  `@gear5/create` scaffolding CLI tool, environment variables, and the
  programmatic runtime properties of the `SupabaseAuthServiceFactory`.
- **[How-To-Use & Architecture Guide](https://www.google.com/search?q=how-to-use.md)**:
  Explains the internal request-identity lifecycle, the critical ordering rules
  of the `AppBuilder` pipeline, manual dependency injection overrides, and the
  schemas of output domain claims.
