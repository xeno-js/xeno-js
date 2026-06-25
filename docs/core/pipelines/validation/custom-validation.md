# Extending `BaseValidationStrategy`

While Zod handles structural data contracts, complex business validations—such
as verifying multi-field logical boundaries, performing async state evaluations,
or interrogating external database constraints—belong inside custom strategy
modules.

To author a custom validation checkpoint, extend the abstract
**`BaseValidationStrategy`** class provided by the framework core and implement
the required `execute` loop:

```typescript
import { BaseValidationStrategy, Result, AppError } from '@gear5/core'
import type { IRequest, ResultType } from '@gear5/core'

interface ProcessPayoutRequest extends IRequest {
  intent: 'ProcessPayoutCommand'
  accountId: string
  amount: number
  currency: string
}

/**
 * @description Advanced business rule validation strategy checking account payout allowances.
 */
export class PayoutAllowanceValidationStrategy extends BaseValidationStrategy {
  public async execute(request: IRequest): Promise<ResultType<boolean>> {
    // 1. Enforce strategy containment by verifying the targeting intent
    if (request.intent !== 'ProcessPayoutCommand') {
      return Result.ok(true)
    }

    const payoutRequest = request as ProcessPayoutRequest

    // 2. Evaluate specialized business invariants
    if (payoutRequest.currency === 'USD' && payoutRequest.amount > 50000) {
      // Leverage the protected base class helper to emit a uniform validation error footprint
      return this.createValidationError(
        request,
        'International cross-border transactions in USD cannot exceed a single volume threshold of $50,000.',
      )
    }

    return Result.ok(true)
  }
}
```

---

## Token Provisioning & IoC Registration

> 🛡️ **ARCHITECTURAL CRITICAL STANDARD**: To maintain compile-time type
> boundaries and absolute structural isolation, the use of raw strings or native
> global `Symbol.for` allocations is forbidden within the Gear5 workspace
> ecosystem. All custom extensions must generate uniquely branded tracking
> identifiers utilizing the framework's **`TokenHelper.createToken<T>()`**
> utility.

Standard tokens used to hook into system-wide pipelines are already exposed via
the framework's core `INJECTION_TOKENS` module (e.g.,
`INJECTION_TOKENS.ZOD_VALIDATOR`, `INJECTION_TOKENS.VALIDATION_PIPELINE`). To
append custom rules alongside them, register your module within the
`addServices` block of the container host:

```typescript
import { AppBuilder, TokenHelper } from '@gear5/core'
import type { IStrategy, IRequest } from '@gear5/core'
import { PayoutAllowanceValidationStrategy } from './strategies/payout-allowance.validation'

// 1. Provision a uniquely branded, strongly-typed injection token via TokenHelper
export const PAYOUT_ALLOWANCE_VALIDATION_TOKEN = TokenHelper.createToken<
  IStrategy<IRequest, boolean>
>('PAYOUT_ALLOWANCE_VALIDATION_STRATEGY')

async function bootstrap() {
  const builder = new AppBuilder()

  builder
    .addContext()
    .addMiddlewares()
    // 2. Inject the concrete strategy class into the ServiceContainer allocation space
    .addServices((container) => {
      container.addSingleton(
        PAYOUT_ALLOWANCE_VALIDATION_TOKEN,
        PayoutAllowanceValidationStrategy,
        [], // Pass upstream token bindings here if your constructor demands dependencies (e.g., IDbClient)
      )
    })
    // 3. Mount the strategy into the CQRS pipeline configuration grid
    .addPipeline((opts) => {
      opts.validation = {
        zod: {
          schemas: {
            /* ... standard schemas ... */
          },
        },
        // Appends your custom strategies directly to the evaluation engine array
        customValidationStrategy: [PAYOUT_ALLOWANCE_VALIDATION_TOKEN],
      }
    })

  return await builder.build()
}
```

During initialization, the internal `ValidationPipeline` loops over both the
declarative `SchemaValidationStrategy` (Zod) and your manual
`PayoutAllowanceValidationStrategy` sequentially. This approach ensures
decoupled data defense across your enterprise boundaries.
