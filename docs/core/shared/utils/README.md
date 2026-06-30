# Shared Utilities & Defensive Toolkit

## Overview

The `utils/` directory houses the foundational, cross-cutting operational
utilities and type-safety primitives of the Gantry5 framework. Operating as a
shared kernel framework layout, these utilities implement strict **Defensive
Programming** patterns to enforce data integrity, run deterministic runtime
type-checking, and provide unified formatting primitives across all layers of
the application—from infrastructure adapters to core domain aggregates.

---

```
 [ Infrastructure / Presentation / Application Layer ]
                          │
                          ▼ Leverages
             ┌──────────────────────────┐
             │    Shared Utilities      │
             └────────────┬─────────────┘
                          │
    ┌─────────────────────┼─────────────────────┐
    ▼                     ▼                     ▼

```

```

[ Guards ]           [ TokenHelper ]       [ Data Helpers ]
(Type Assertions)    (DI Branded Symbols)   (GUID, Date, String)

```

## Module Directory Structure

The utility toolkit is divided into two operational core modules:

- **[Defensive Type Guards (guards.md)](./guards.md)**: Zero-dependency type
  assertions and fail-fast validation checks used to preserve structural
  invariants and block erratic data state corruption.
- **[Core Framework Helpers (helpers.md)](./helpers.md)**: Domain-agnostic
  formatting and tokenization engines covering cryptographically secure GUID
  generation, consistent Date serialization, and type-safe dependency injection
  token provisioning.
