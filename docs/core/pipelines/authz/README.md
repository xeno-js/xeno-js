# Identity Access & Authorization Subsystem (AuthZ)

## Overview

The Gear5 Authorization Subsystem provides a robust, zero-trust infrastructure
designed to secure CQRS message flows before execution context segments cross
into the application core. Managed by the centralized
**`AuthorizationPipeline`**, this architecture encapsulates security rules into
decoupled, single-responsibility structural components known as Authorization
Strategies (`IStrategy<TInput>`).

The subsystem acts as a high-speed firewall within the Mediator execution chain.
It sequentially runs all active access policies and applies a strict _fail-fast_
protocol—aborting execution at the first compliance failure to protect system
resources and ensure data isolation.

---

## The Authorization Layer Stack

Instead of handling authentication and authorization inside unified blocks,
Gear5 divides identity inspection across four distinct security pillars. Each
strategy maps directly to specific operational requirements:

```

```

[ Incoming Request ] ──► [ AuthorizationPipeline ] │ ├──► 1.
UserAuthenticationStrategy │ (Validates User GUID presence) │ ├──► 2.
TenantAuthorizationStrategy │ (Enforces SaaS context isolation) │ ├──► 3.
RoleAuthorizationStrategy │ (Checks macro organizational roles) │ └──► 4.
PermissionAuthorizationStrategy (Verifies micro feature-level claims)

```

```

### 1. User Authentication Strategy

The baseline security boundary. It verifies the presence of an active,
structurally valid User GUID within the resolved execution identity, blocking
anonymous or unauthenticated traffic.

### 2. Tenant Isolation Strategy

A foundational requirement for multi-tenant SaaS applications. It inspects the
resolved identity to ensure the presence of a valid `tenantId`, preventing
cross-tenant data leaks by establishing absolute boundary separation.

### 3. Role-Based Access Control (RBAC)

Maps high-level organizational archetypes (e.g., `Administrator`,
`BillingManager`, `Support`) to request execution flows. It checks the request
intent against custom metadata policies registered within a global policy
registry.

### 4. Permission-Based Access Control (PBAC)

Provides fine-grained, precise operation clearance checks. Rather than relying
on broad roles, it verifies that the identity possesses the exact atomic
capabilities required to execute the target intent (e.g., `users:write`,
`reports:export`).

---

## Documentation Roadmap

To implement, map, and extend security controls within your application
environment, read the following operational manuals:

- **[Pipeline Configuration Manual](./configuration.md)**: Details fluent setup
  keys, pipeline bootstrap workflows, and internal module initialization
  mechanics.
- **[SaaS Multi-Tenant Strategy Blueprint](./tenant-strategy.md)**: Covers
  isolation primitives, cryptographic GUID boundary validation, and context
  error payload structures.
- **[Role-Based Access Control (RBAC) Manual](./policies/role-policy-configuration.md)**:
  Explains declarative intent-to-role registry generation and organizational
  macro gating.
- **[Permission-Based Access Control (PBAC) Manual](./policies/permission-policy-configuration.md)**:
  Outlines micro-capability rule modeling, structural case-insensitive
  operations, and contract validations.
- **[Custom Authorization Strategy Integration](./custom-strategy-authz.md)**:
  Teaches advanced core extensions via `BaseAuthorizationStrategy`, explicit
  `TokenHelper` generation, and custom runtime policy injection.
