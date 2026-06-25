# Permission-Based Access Control (PBAC) Manual

## Overview

The `PermissionAuthorizationStrategy` implements granular, feature-level
capability verification inside the Gear5 pipeline behavior stack. Operating
under a least-privilege security model, it enforces fine-grained authorization
rules by checking that an authenticated user possesses the explicit permissions
required to execute a given request.

---

## Why It Is Needed

While Role-Based access control (RBAC) is effective for broad organizational
groupings, it introduces liabilities when applied to complex security contexts:

- **Role Explosion**: As applications grow, creating separate macro roles for
  every micro capability variant (e.g., `UserReader`, `UserWriter`,
  `UserDeleter`) can quickly lead to role explosion, making management unwieldy.
- **Granular Least Privilege**: PBAC treats actions as unique, decoupled
  capabilities (e.g., `finance:invoice:void`). This allows security
  administrators to grant precise permissions to users independently of their
  high-level organizational roles.

---

## Configuration and Rule Modeling

To activate fine-grained capability checks, toggle the `permission` option flag
to `true` inside the pipeline configuration callback block, and declare the
exact capability strings required for each request intent:

```typescript
// Part of your centralized application bootstrap configuration
builder.addPipeline((opts) => {
  opts.authorization = {
    tenant: true,
    policy: {
      role: false,
      permission: true, // Allocates and activates PermissionAuthorizationStrategy

      policyRegistry: {
        // Intent Identifier Key: Required matching capability claims
        VoidInvoiceCommand: {
          roles: [],
          permissions: ['finance:invoice:write', 'finance:invoice:void'],
        },
      },
    },
    customAuthorizationStrategy: [],
  }
})
```

---

## Under the Hood: The PBAC Evaluation Engine

When an incoming request crosses into the authorization pipeline, the execution
behavior evaluates permissions via an integrated validation loop:

1. **Policy Lookup**: It calls the shared `IPolicyRegistry` to extract the
   `AuthPolicy` rule mapped to the request's current `intent` label. If no
   policy is configured for the intent, it aborts immediately.
2. **Case-Insensitive Intersection**: It extracts the user's verified
   `auth.permissions` array. It then evaluates if the user's permissions
   intersect with the policy's required permissions using case-insensitive
   string matching (`permission.toLowerCase()`).
3. **Failure Routing**: If the user's permissions array does not contain at
   least one of the required matching capability tokens, the engine blocks the
   request, returning an **`AUTH_FORBIDDEN`** `AppError` paired with an HTTP
   `403 Forbidden` status code.
