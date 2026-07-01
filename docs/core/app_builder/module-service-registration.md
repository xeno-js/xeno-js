# Module & Service Registration Guide

## Extending the Core Application Workspace

The XenoJS core framework remains agnostically uncoupled from your explicit
business use-cases or enterprise features. To register domain logic, repository
persistence layers, or external communication adapters into the shared IoC
engine, `AppBuilder` provides two extension mechanisms: direct service
allocation and macro asynchronous module partitioning.

---

## Direct Service Allocation (`addServices`)

For granular use-case injections, domain services, or custom application-level
adapters, you can interact with the underlying container blueprint directly
before invoking the final assembly phase by using the `.addServices()`
registration hook.

This method executes an immediate callback passing the raw `IServiceContainer`
reference as the targeted payload context, allowing developers to inject custom
dependencies directly into the host:

```typescript
import { AppBuilder, TokenHelper } from '@xeno/core'
import { InvoiceRepository } from './repositories/invoice.repository.js'
import { ProcessInvoiceHandler } from './handlers/process-invoice.handler.js'

// 1. Always provision uniquely branded, strongly-typed tokens via TokenHelper
export const INVOICE_REPOSITORY_TOKEN =
  TokenHelper.createToken<InvoiceRepository>('INVOICE_REPOSITORY')
export const PROCESS_INVOICE_HANDLER_TOKEN =
  TokenHelper.createToken<ProcessInvoiceHandler>('PROCESS_INVOICE_HANDLER')

builder.addMiddlewares().addServices((container) => {
  // 2. Register your persistence engine mapping dependencies explicitly
  container.addSingleton(INVOICE_REPOSITORY_TOKEN, InvoiceRepository, [])

  // 3. Inject use-case behaviors passing required upstream dependency tracking tokens
  container.addTransient(PROCESS_INVOICE_HANDLER_TOKEN, ProcessInvoiceHandler, [
    INVOICE_REPOSITORY_TOKEN,
  ])
})
```

---

## Macro Asynchronous Module Partitioning (`addModule`)

When structuring microservices or modular monoliths, separating an application
into logical domain boundaries (e.g., Billing Module, Identity Module, Shipping
Module) prevents registration blocks from becoming bloated and unmaintainable.

The `.addModule()` registration system accepts an explicit module name, an
asynchronous dynamic factory import, and an optional custom configuration
options object:

```typescript
// Blueprint usage within your central src/bootstrap.ts
builder.addModule(
  'BillingModule',
  async () => {
    const { BillingModule } = await import('./modules/billing.module.js')
    return new BillingModule()
  },
  { enableTaxMetrics: true },
)
```

### Designing a Structural Component Module

Custom feature packages must implement the core framework's structural `IModule`
contract interface. The module encapsulates its internal infrastructure, keeping
the global configuration footprint clean:

```typescript
import type { IModule, IServiceContainer } from '@xeno/core'
import { TokenHelper } from '@xeno/core'
import { PostgresBillingDao } from './infra/postgres-billing.dao.js'

export interface BillingModuleOptions {
  enableTaxMetrics: boolean
}

export const BILLING_DAO_TOKEN =
  TokenHelper.createToken<PostgresBillingDao>('BILLING_DAO')

/**
 * @description Decoupled structural encapsulation boundary for billing use-cases.
 */
export class BillingModule implements IModule<BillingModuleOptions> {
  public async configure(
    container: IServiceContainer,
    opts?: BillingModuleOptions,
  ): Promise<void> {
    // 1. Evaluate feature parameter flags passed by the orchestrator
    const runTaxHydration = opts?.enableTaxMetrics === true

    // 2. Hydrate the local domain dependency layout inside the sub-container
    container.addScoped(BILLING_DAO_TOKEN, PostgresBillingDao, [])

    if (runTaxHydration) {
      // Dynamic internal condition adjustments...
    }
  }
}
```

### The Delayed Initialization Pipeline Under the Hood

When invoking `.addModule()`, `AppBuilder` does not trigger the execution of
your module's code immediately. Instead, it pushes an execution payload object
into an internal FIFO (`First-In-First-Out`) task array queue named `_modules`.

The actual dynamic import statement and configuration loops run sequentially
when you call `await builder.build()`. This approach keeps boot-up times fast
and prevents memory overhead from unallocated modules during the early
structural configuration steps.
