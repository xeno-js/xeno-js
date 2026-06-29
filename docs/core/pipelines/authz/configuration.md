# Authorization Pipeline Configuration

## Programmatic Integration Mechanics

Authorization behaviors are activated and tuned inside the `.addPipeline()`
configuration block of the fluent **`AppBuilder`** startup script. When this
callback executes, the framework compiles the provided flags and maps the
resulting strategy array directly into the dependency injection container.

Under the hood, the orchestration is handled by the framework's internal
`AuthUtils.addAuthZ` utility. If all security options are omitted or passed as
`false`, the helper returns an empty array, optimizing performance by entirely
avoiding pipeline processing overhead.

---

## Comprehensive Bootstrap Blueprint

The following blueprint demonstrates how to initialize the core authorization
behavior stack alongside required policy records using the `AppBuilder`
pipeline:

```typescript
import { AppBuilder, TokenHelper } from '@graviton5/core'
import type { AuthPolicy } from '@Graviton5/shared'

// 1. Declare the unified security policy mapping request intents to required claims
const applicationPolicyRegistry: Record<string, AuthPolicy> = {
  ArchiveAccountCommand: {
    roles: ['administrator', 'compliance_officer'],
    permissions: ['account:archive', 'system:sudo'],
  },
  ExportFinancialReportQuery: {
    roles: ['billing_manager'],
    permissions: ['financials:read'],
  },
}

async function bootstrap() {
  const sandboxHost = new AppBuilder()

  sandboxHost
    .addContext()
    .addMiddlewares() // Provision bearer extractors and basic context wrappers
    .addAuth((opts) => {
      // Initialize identity providers (e.g., Supabase Auth Service)
      opts.url = process.env.SUPABASE_URL || ''
      opts.key = process.env.SUPABASE_KEY || ''
    })
    .addPipeline((opts) => {
      opts.performance.thresholdMs = 300

      // 2. Calibrate and wire up the active authorization behavior matrix
      opts.authorization = {
        // Toggles multi-tenant boundary checks
        tenant: true,

        policy: {
          role: true, // Enables RBAC checks via RoleAuthorizationStrategy
          permission: true, // Enables PBAC checks via PermissionAuthorizationStrategy

          // Connects the declarative intent policy lookup matrix
          policyRegistry: applicationPolicyRegistry,
        },

        // Array reserved for manual bespoke strategy injection tokens
        customAuthorizationStrategy: [],
      }
    })

  return await sandboxHost.build()
}
```

---

## Under the Hood: Container Wiring Sequence

When the initialization routine executes `.addPipeline()`, the internal builder
processes your option flags to assemble the behavioral stack:

1. **User Gating**: The framework automatically registers the
   `UserAuthorizationStrategy` as a baseline filter.
2. **Tenant Enclosure**: If `opts.authorization.tenant` is true, the
   `TenantAuthorizationStrategy` is injected into the pipeline sequence.
3. **Registry Provisioning**: If role or permission validation is active,
   `AuthUtils` creates a singleton `PolicyRegistry` instance, binds it under
   `INJECTION_TOKENS.POLICY_REGISTRY`, and loops through your dictionary to load
   each `AuthPolicy` rule.
4. **Strategy Aggregation**: The `RoleAuthorizationStrategy` and
   `PermissionAuthorizationStrategy` classes are instantiated, passing the
   resolved policy registry and current request context as dependencies.
5. **Pipeline Resolution**: Finally, all active strategies are resolved from
   their tokens and bundled into a single **`AuthorizationPipeline`** instance
   registered under `INJECTION_TOKENS.AUTHORIZATION_PIPELINE`.
