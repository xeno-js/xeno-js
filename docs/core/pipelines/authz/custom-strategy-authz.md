# Custom Authorization Strategy Integration

## Authoring Bespoke Strategy Modules

While multi-tenant boundaries, organizational roles, and feature permissions
handle standard security compliance profiles, complex enterprise operations—such
as IP address whitelisting, time-of-day constraints, or dynamic database
resource ownership verification—require bespoke authorization logic.

To implement a custom security strategy, extend the abstract
**`BaseAuthorizationStrategy<IRequest>`** class provided by the core framework
and override its internal `performAuthorizationCheck` lifecycle method:

```typescript
import { BaseAuthorizationStrategy, Result } from '@graviton5'
import type { IRequest, Identity, AppError } from '@graviton5'

interface UpdateProjectRepositoryRequest extends IRequest {
  intent: 'UpdateProjectRepositoryCommand'
  repositoryOwnerId: string
}

/**
 * @description Advanced authorization strategy validating real-time resource data ownership.
 */
export class ResourceOwnershipAuthorizationStrategy extends BaseAuthorizationStrategy<IRequest> {
  protected async performAuthorizationCheck(
    request: IRequest,
    auth: Identity,
  ): Promise<Result<void, AppError>> {
    // 1. Enforce strategy scope by checking the incoming message intent
    if (request.intent !== 'UpdateProjectRepositoryCommand') {
      return Result.ok()
    }

    const repositoryRequest = request as UpdateProjectRepositoryRequest

    // 2. Evaluate dynamic business rule context rules
    if (repositoryRequest.repositoryOwnerId !== auth.userId) {
      // Return a forbidden status token (403 Forbidden) utilizing the class base helper
      return this.createAuthError(
        request,
        'Access Denied: The authenticated user profile is not the designated owner of this resource.',
      )
    }

    return Result.ok()
  }
}
```

---

## Token Provisioning & IoC Registration

> 🛡️ **ARCHITECTURAL CRITICAL STANDARD**: To maintain compile-time type
> boundaries and absolute structural isolation, the use of raw strings or native
> global `Symbol.for` allocations is forbidden within the Graviton5 workspace
> ecosystem. All custom extensions must generate uniquely branded tracking
> identifiers utilizing the framework's **`TokenHelper.createToken<T>()`**
> utility.

Standard system-wide tokens are managed inside the central `INJECTION_TOKENS`
constant registry. To append a custom authorization filter alongside the
framework's default strategies, declare a type-safe token, register your service
class inside the `addServices` block, and attach the token to the
`customAuthorizationStrategy` options array inside `.addPipeline()`:

```typescript
import { AppBuilder, TokenHelper } from '@graviton5'
import type { IStrategy, IRequest } from '@graviton5'
import { ResourceOwnershipAuthorizationStrategy } from './strategies/resource-ownership.authorization'

// 1. Provision a uniquely branded, strongly-typed injection token via TokenHelper
export const RESOURCE_OWNERSHIP_AUTHZ_TOKEN = TokenHelper.createToken<
  IStrategy<IRequest, void>
>('RESOURCE_OWNERSHIP_AUTHORIZATION_STRATEGY')

async function bootstrap() {
  const applicationBuilder = new AppBuilder()

  applicationBuilder
    .addContext()
    .addMiddlewares()
    // 2. Inject the custom strategy module into the dependency container allocation space
    .addServices((container) => {
      container.addSingleton(
        RESOURCE_OWNERSHIP_AUTHZ_TOKEN,
        ResourceOwnershipAuthorizationStrategy,
        [INJECTION_TOKENS.REQUEST_CONTEXT], // Injects request context to access identity attributes
      )
    })
    // 3. Mount the token directly into the CQRS pipeline configuration grid
    .addPipeline((opts) => {
      opts.authorization = {
        tenant: true,
        policy: { role: true, permission: true, policyRegistry: {} },

        // Appends your custom strategies directly to the evaluation engine array
        customAuthorizationStrategy: [RESOURCE_OWNERSHIP_AUTHZ_TOKEN],
      }
    })

  return await applicationBuilder.build()
}
```

During the initialization sequence, the internal builder engine loops over all
active strategies sequentially, executing the declarative user checks, tenant
isolation parameters, role/permission configurations, and your custom
`ResourceOwnershipAuthorizationStrategy` in a secure, unified validation
pipeline.
