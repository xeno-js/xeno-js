## The Request-Identity Lifecycle

When an incoming execution context triggers the presentation layer, identity
validation is executed deterministically across an asynchronous pipeline managed
inside the `RequestContextMiddleware`:

1. **Extraction**: The `BearerTokenExtractor` isolates the raw cryptographic
   string from the incoming HTTP `Authorization: Bearer <token>` header.
2. **Authentication**: The isolated token is routed to the `GateKeeper`
   component. The gatekeeper invokes the active implementation of `IAuthService`
   (e.g., `SupabaseAuthService`), which calls
   `this._supabase.auth.getUser(token)`.
3. **Claims Mapping**: The raw user object provided by the cloud service is
   processed by the internal `SupabaseClaimsMapper` and converted into a
   normalized, decoupled `AuthClaims` domain representation.
4. **Context Binding**: The mapped user identity is saved inside the scoped
   `IRequestContext` wrapper, making it fully available to all down-stream
   command handlers, queries, and business rules.

---

## Critical Rules & Pipeline Ordering

> ⚠️ **CRITICAL ARCHITECTURAL CONSTRAINTS**: The execution sequence of the
> initialization blocks inside your bootstrap file changes how security tokens
> are processed. Review the following rules to prevent unauthenticated access or
> system-wide bootstrapping errors.

### Rule 1: The GateKeeper Overwrite Sequence

When `builder.addMiddlewares()` is processed, the internal `MiddlewareModule`
provisions a placeholder security service called `NoAuthGateKeeper` under the
`INJECTION_TOKENS.GATE_KEEPER` registration identifier. This architecture
guarantees that the application layout does not throw resolution errors if an
application does not require identity enforcement.

To enforce active authentication check routines, **always call `.addAuth(...)`
after
`.addMiddlewares()**`. Calling them out of order causes the base middleware initialization routine to overwrite your active `SupabaseAuthService`
with the anonymous bypass fallback.

```ts
// ❌ WRONG: SupabaseAuthService will be overwritten by NoAuthGateKeeper
builder
  .addAuth((opts) => { ... })
  .addMiddlewares()

//  CORRECT: SupabaseAuthService successfully replaces the fallback gatekeeper
builder
  .addMiddlewares()
  .addAuth((opts) => { ... })

```

### Rule 2: Authorization Strategy Pipeline Ordering

When implementing access control constraints (Roles, Permissions, multi-tenant
boundaries), the authorization middleware pipelines are appended via
`builder.addPipeline()`. The validation pipeline must be attached **after** the
identity metadata has been loaded.

```ts
//  CORRECT WORKFLOW: Context -> Extraction -> Authentication -> Policy Verification
builder
  .addContext()
  .addMiddlewares()
  .addAuth((opts) => { ... })
  .addPipeline((opts) => {
    opts.authorization.tenant = true
    opts.authorization.policy.role = true
    opts.authorization.policy.permission = true
    opts.authorization.policy.policyRegistry = myPolicyRegistry
  })

```

---

## Manual Dependency Injection Overrides

If an application must run without Supabase (e.g., switching to an internal
OAuth2 provider, a custom JWT infrastructure, or localized testing stubs), the
system allows developers to bypass the automatic factory pipeline entirely.

Because the underlying framework uses un-mutated token registries inside the
Inversion of Control (IoC) container, a custom implementation of `IAuthService`
can be attached manually right before invoking the final `.build()` phase using
`.addServices()`:

```ts
import type { IAuthService, ResultType } from '@gear5/core'
import { AppBuilder, Result } from '@gear5/core'
import { INJECTION_TOKENS } from './di/injection-tokens.constants' // Path to framework registry tokens

// 1. Create your custom, decoupled Authentication Adapter
class CustomAuthService implements IAuthService {
  public async authenticate(token: string): Promise<ResultType<AuthClaims>> {
    // Implement your custom verification mechanism (e.g., jsonwebtoken verify)
    if (token === 'valid-local-token') {
      return Result.ok({
        sub: 'usr_12345',
        tenantId: 'tenant_beta',
        roles: ['Administrator'],
        permissions: ['users:write'],
      })
    }
    return Result.fail(new Error('Invalid token'))
  }

  public async isAuthenticated(): Promise<boolean> {
    return true
  }
}

// 2. Force inject the custom implementation into the IoC Container
async function bootstrap() {
  const builder = new AppBuilder()

  builder
    .addMiddlewares()
    // Supposing we skip .addAuth(), we write the token directly into the container:
    .addServices((container) => {
      container.addSingleton(
        INJECTION_TOKENS.AUTH_SERVICE,
        CustomAuthService,
        [],
      )
    })

  return await builder.build()
}
```

---

## The Result Payload Contract

Every successful authentication run converts provider-specific structures into a
immutable `AuthClaims` representation. This contract defines the domain payload
layout made available throughout the execution lifecycle:

### `AuthClaims` Property Matrix

| Property      | Type       | Nullability      | Description                                                                                                          |
| ------------- | ---------- | ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| `sub`         | `string`   | **Non-Nullable** | The Unique Subject Identifier representing the individual user profile (maps directly to the Supabase Account UUID). |
| `tenantId`    | `string`   | _Optional_       | Identifies the organizational database boundary when operating under multi-tenant runtime policies.                  |
| `roles`       | `string[]` | _Optional_       | Array of assigned security roles used to evaluate high-level Role-Based Access Control (RBAC) rules.                 |
| `permissions` | `string[]` | _Optional_       | Array of precise permission strings evaluated by individual route-level policy validation checks.                    |
