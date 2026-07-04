# Role-Based Access Control (RBAC) Manual

## Overview

The `RoleAuthorizationStrategy` handles high-level organizational access control
within the Xeno pipeline behavior stack. It matches macro organizational roles
assigned to a user's identity against the minimum role permissions required to
execute a specific command or query intent.

---

## Why It Is Needed

- **Macro Access Control**: RBAC provides coarse-grained security checkpoints,
  grouping sets of operational capabilities under high-level corporate titles
  (e.g., `Administrator`, `ComplianceOfficer`, `Guest`).
- **Declarative Intent Gating**: Instead of scattering hardcoded imperate
  checking hooks (`if (user.isInRole(...))`) inside business use-cases, security
  parameters are declared centrally, making access rules simple to audit and
  maintain.

---

## Configuration and Rule Modeling

To activate role evaluation, toggle the `role` option flag to `true` inside the
pipeline configuration callback block, and map allowed role configurations
directly within your `policyRegistry` dictionary:

```typescript
// Part of your centralized application bootstrap configuration
builder.addPipeline((opts) => {
  opts.authorization = {
    tenant: true,
    policy: {
      role: true, // Allocates and activates RoleAuthorizationStrategy
      permission: false,

      policyRegistry: {
        // Intent Identifier Key: Required matching claims profiles
        TerminateSubscriptionCommand: {
          roles: ['administrator', 'billing_manager'],
          permissions: [], // Evaluated separately by the PBAC engine
        },
      },
    },
    customAuthorizationStrategy: [],
  }
})
```

---

## Under the Hood: The RBAC Match Engine

When an incoming request passes through the pipeline loop, the strategy
interrogates the central `IPolicyRegistry` dependency using the request's exact
`intent` string:

1. **Policy Lookup**: It extracts the `AuthPolicy` rule mapped to the target
   request intent. If no policy is found, it safely aborts with an unconfigured
   failure exception.
2. **Case-Insensitive Normalization**: The strategy pulls the user's assigned
   `auth.roles` array. It loops through the policy's required roles list,
   running a case-insensitive evaluation by lowercasing the search tokens
   (`role.toLowerCase()`) to match against user claims.
3. **Failure Routing**: If the user's role list does not contain at least one of
   the required matching roles, the engine returns a structured
   **`AUTH_FORBIDDEN`** `AppError` paired with an HTTP `403 Forbidden` status
   code.
