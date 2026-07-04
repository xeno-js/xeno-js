---
title: Authorization Pipeline & Custom Security Strategies
sidebar_position: 6
description:
  Technical developer manual on configuring the Xeno AuthorizationPipeline,
  creating custom access control strategies, and leveraging the
  BaseAuthorizationStrategy class.
keywords:
  - authorization pipeline
  - xeno core security
  - custom authorization strategy
  - baseauthorizationstrategy
  - rbac permissions
  - zero trust pipeline
---

# Authorization Pipeline & Custom Security Strategies

The Authorization Pipeline & Custom Security Strategies documentation defines
the access control boundaries, runtime policy evaluation sequences, and
programmatic integration rules managed by the security interceptor subsystems.

---

## Direct Definition Block

The `AuthorizationPipeline` is the central access control boundary within the
Xeno messaging engine. Operating as a foundational middleware behavior inside
the mediator ring, it intercepts incoming requests (Commands and Queries) early
in the request lifecycle to evaluate identity metadata, multi-tenant alignment,
and operational permissions before use-case handlers are evaluated.

---

## The Centralized Security Paradigm

### What it is

The centralized security paradigm is an un-bypassable transaction interceptor
chain that separates security credentials evaluation from application use-case
logic.

### How it works

Rather than allowing individual use cases or route handlers to independently
parse user identities, incoming messages are intercepted by the
`AuthorizationPipeline`. The pipeline evaluates identity properties sequentially
against configured policy matrices. If a security criteria violation is
detected, propagation terminates immediately, and a failed `Result` monad
containing an explicit framework error payload is returned directly to the
active transport interface.

### Why it exists

Hardcoding security checks, permission evaluations, and role lookups directly
inside use-case handlers litters the codebase with infrastructure boilerplate
and violates the Single Responsibility Principle (SRP). Fragmented security
validation layers significantly increase technical debt and introduce access
control vulnerabilities if a software engineer omits manual checking code on a
newly written endpoint.

---

## Configuring the Authorization Pipeline

### What it is

Authorization Pipeline configuration represents the declarative assembly of
tenant separation gates, Role-Based Access Control (RBAC), and Permission-Based
Access Control (PBAC) policies inside the application container graph.

### How it works

The security subsystem remains completely inactive until explicitly enabled via
the global pipeline setup block inside the application bootstrap routine
(`src/bootstrap.ts`). It compiles the policy maps programmatically via the fluid
configuration callbacks:

```typescript
// src/bootstrap.ts
import { AppBuilder } from '@xeno/core'
import type { IServiceContainer } from '@xeno/core'

export async function bootstrap(): Promise<IServiceContainer> {
  const builder = new AppBuilder()

  builder
    .addContext()
    .addMiddlewares()
    .addPipeline((opts) => {
      // 1. Enable the overarching authorization behavior subsystem
      opts.authorization.isEnabled = true

      // 2. Activate tenant segmentation guards if building a SaaS application
      opts.authorization.tenant = true

      // 3. Configure native Role-Based (RBAC) and Permission-Based (PBAC) access control
      opts.authorization.policy.role = true
      opts.authorization.policy.permission = true
      opts.authorization.policy.policyRegistry = {
        UpdateCatalogCommand: {
          roles: ['Admin', 'InventoryManager'],
          permissions: ['catalog:write'],
        },
      }

      opts.queryBus.isEnabled = true
    })

  return await builder.build()
}
```

### Why it exists

Centralizing intent mappings inside a single unified policy configuration matrix
replaces fragmented, ad-hoc access control logic with a single source of truth,
enabling comprehensive compliance audits across all application entry paths.

---

## Leveraging `BaseAuthorizationStrategy`

### What it is

The `BaseAuthorizationStrategy<TRequest>` is an abstract template utility that
encapsulates shared context-parsing routines and pre-flight identity checkpoints
for bespoke security rule evaluations.

### How it works

The base class implements structural verification hooks that execute prior to
invoking custom validation rules:

- **Automated Thread Context Resolution**: Dynamically extracts the active
  thread-local data memory cell via the injected `IRequestContext` wrapper.
- **Pre-Flight Authentication Guard**: Verifies if an authenticated user session
  profile exists within the storage thread. If a non-authenticated payload
  reaches the loop, it intercepts execution instantly and returns an HTTP 401
  Unauthorized status code, shielding downstream custom evaluation rules from
  handling undefined identity states.

The class exposes targeted protected helpers to maintain uniform error
normalization:

- `this.createUnauthorizeError(request, message)`: Standardizes HTTP 401
  Unauthorized result payloads (`PIPELINE_ERROR_CODES.AUTHORIZATION_FAILED`).
- `this.createForbiddenError(request, message)`: Standardizes HTTP 403 Forbidden
  result payloads (`PIPELINE_ERROR_CODES.AUTH_FORBIDDEN`).

### Why it exists

Bespoke authorization checks—including resource data ownership validation, IP
address blacklisting, or temporal access constraints—require stable access to
system primitives. Standardizing these behaviors inside an abstract base class
guarantees that all custom components reuse identical identity validation
structures and preserve uniform error formatting.

---

## Writing a Custom Authorization Strategy

To implement custom security logic, extend `BaseAuthorizationStrategy` and
override the abstract `performAuthorizationCheck(request, auth)` lifecycle hook:

```typescript
// src/infrastructure/security/resource-ownership.strategy.ts
import { BaseAuthorizationStrategy, Result } from '@xeno/core'
import type {
  IRequest,
  Identity,
  ResultType,
  IRequestContext,
  ExecutionContext,
} from '@xeno/core'

export class ResourceOwnershipStrategy extends BaseAuthorizationStrategy<IRequest> {
  constructor(requestContext: IRequestContext<ExecutionContext>) {
    super(requestContext)
  }

  /**
   * @description Executes specialized data access evaluation after authentication validation.
   */
  protected async performAuthorizationCheck(
    request: IRequest,
    auth: Identity,
  ): Promise<ResultType<void>> {
    const command = request as any

    if (command.intent === 'DeleteDocumentCommand') {
      const documentOwnerId = command.payload.ownerId

      // Verify if the authenticated user matches the resource owner or is a super admin
      const isOwner = auth.userId === documentOwnerId
      const isSuperAdmin = auth.roles
        .map((r) => r.toLowerCase())
        .includes('superadmin')

      if (!isOwner && !isSuperAdmin) {
        return this.createForbiddenError(
          request,
          `Authorization denied: User ${auth.userId} does not own the requested document resource.`,
        )
      }
    }

    return Result.ok()
  }
}
```

---

## Registering Custom Strategies in the Pipeline

Because Xeno avoids automated class crawling, custom security modules must be
explicitly appended to the `AppBuilder` container registration graph via
explicit symbolic tokens:

```typescript
// src/bootstrap.ts
import { AppBuilder, TokenHelper, INJECTION_TOKENS } from '@xeno/core'
import type { IServiceContainer } from '@xeno/core'
import { ResourceOwnershipStrategy } from './infrastructure/security/resource-ownership.strategy.js'

const OWNERSHIP_STRATEGY_TOKEN = TokenHelper.createToken(
  'ResourceOwnershipStrategy',
)

export async function bootstrap(): Promise<IServiceContainer> {
  const builder = new AppBuilder()

  // 1. Register custom strategy class within service container graph
  builder.addServices((services) => {
    services.addSingletonFactory(OWNERSHIP_STRATEGY_TOKEN, (container) => {
      const requestContext = container.resolve(INJECTION_TOKENS.REQUEST_CONTEXT)
      return new ResourceOwnershipStrategy(requestContext)
    })
  })

  // 2. Map token hook into pipeline configuration arrays
  builder.addPipeline((opts) => {
    opts.authorization.isEnabled = true
    opts.authorization.customAuthorizationStrategy = [OWNERSHIP_STRATEGY_TOKEN]
  })

  return await builder.build()
}
```

---

## Architectural Constraints & Trade-offs

- **Raw Javascript Error Throwing Prohibited**: Software engineers cannot use
  raw `throw new Error()` statements inside custom strategy hooks. Bypassing the
  pipeline's structured resolution path breaks error handling uniformity and
  leaks internal code layouts back to presentation clients. Security failures
  must return structured result monads via `this.createForbiddenError()` or
  `this.createUnauthorizeError()`.
- **Compulsory IRequestContext Constructor Invariants**: Custom security
  components depend directly on asynchronous thread storage. Forgetting to
  resolve `INJECTION_TOKENS.REQUEST_CONTEXT` and passing it to the base class
  `super()` constructor breaks container compilation, causing an immediate
  startup initialization failure.

---

## Next Steps

Now that your access control rules and custom strategies are securely
established, explore how to protect your application core from structurally
malformed payloads:

- **[Validation Pipeline Behavior](./validation-pipeline-behaviors.md)**
