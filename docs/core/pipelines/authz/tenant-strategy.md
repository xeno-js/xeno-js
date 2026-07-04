# SaaS Multi-Tenant Strategy Blueprint

## Overview

The `TenantAuthorizationStrategy` provides robust data isolation for
multi-tenant SaaS environments. Operating early in the security validation
stack, this strategy ensures that any command or query dispatching through the
Mediator belongs to a validated tenant boundary before it can interact with the
core domain layer.

---

## Why It Is Needed

In cloud-native B2B platforms, multiple separate corporations share the same
underlying computing resources and database clusters
(Shared-Process/Shared-Schema models).

- **Data Leakage Prevention**: Failing to strictly validate tenant scopes at the
  request perimeter can allow malicious or malformed requests to cross
  organizational boundaries and read or mutate another tenant's data.
- **Fail-Fast Structural Defense**: This strategy completely eliminates the risk
  of developers forgetting to include manual multi-tenant context filters inside
  individual use-case handlers or SQL query blocks by enforcing tenant
  validation globally at the gateway.

---

## Architectural Compliance & Runtime Evaluation

The strategy extends `BaseAuthorizationStrategy<IRequest>` and overrides the
internal `performAuthorizationCheck` lifecycle method:

```typescript
protected async performAuthorizationCheck(
  command: IRequest,
  auth: Identity,
): Promise<Result<void, AppError>> {
  if (Guards.isNullOrEmpty(auth.tenantId) || !GuidHelper.isValidGuid(auth.tenantId))
    return this.createUnauthorizeError(command, 'Tenant is not authenticated.')

  return Result.ok()
}

```

### Evaluation Protocol

1. **Context Extraction**: The strategy reads the currently loaded execution
   scope via the injected `IRequestContext` instance.
2. **Identity Verification**: It extracts the `Identity` envelope attached by
   upstream auth providers. If the request context is entirely missing, it
   short-circuits with an unauthenticated failure.
3. **Structural Verification**: It inspects the `auth.tenantId` attribute using
   two strict validation layers:

- **Emptiness Check**: Ensures the string is populated and not blank
  (`Guards.isNullOrEmpty`).
- **Cryptographic Check**: Validates that the tenant string conforms to a
  strict, cryptographically valid GUID footprint layout
  (`GuidHelper.isValidGuid`).

4. **Failure Routing**: If either check fails, the pipeline breaks execution
   immediately, returning a structured **`AUTHORIZATION_FAILED`** `AppError`
   paired with an HTTP `401 Unauthorized` status footprint.
