# Application Base Handler

## Overview

The `BaseHandler` is an abstract class that implements the `IHandler` interface.
It provides a standardized foundation for handling incoming command and query
payloads, managing request lifecycles, and executing pre-handling validation or
authorization strategies.

### What the Base Handler Offers

- **Sequential Strategy Execution**: It accepts an array of
  `IStrategy<TRequest>` implementations and executes them in order during the
  pre-handling phase. If any strategy fails, execution stops immediately and
  throws the corresponding error.
- **Unified Context Resolution**: Through its protected `_getCurrentUser(req)`
  method, it extracts the current authenticated user identity (`userId` and
  `tenantId`) from the multi-tenant `IRequestContext`.
- **Defensive Error Handling**: It checks if the execution context is present;
  if no authenticated context is defined, it throws an `AppError` with
  `AUTHENTICATION_FAILED` details.

---

## Implementing Concrete Handlers

To implement a new command or query handler using the base infrastructure, your
class must extend `BaseHandler<TRequest, TResponse>` and implement the abstract
`handle` method.

### Implementation Example

```typescript
import { BaseHandler } from '@/application'
import { AppError, ICommand, Result, type ResultType } from '@/domain'

export class UnauthorizedCommandHandler extends BaseHandler<
  ICommand<null>,
  null
> {
  public async handle(
    request: ICommand<null>,
    _signal?: AbortSignal,
  ): Promise<ResultType<null>> {
    // Enforce strategy resolution and obtain identity information
    const { userId, tenantId } = await this._getCurrentUser(request)

    if (!userId || !tenantId) {
      return Result.fail(
        AppError.unauthorized(
          'UnauthorizedCommandHandler',
          'User is not authorized to perform this action.',
        ),
      )
    }

    return Result.ok(null)
  }
}
```

---

## Configuring Strategies

The `BaseHandler` constructor takes an array of strategies (`IStrategy[]`). This
allows granular control over what constraints are evaluated for each specific
handler.

Depending on your security and operational requirements, you can configure your
handlers with different combinations of strategies during registration inside
`bootstrap.ts`:

### 1. Passing Both User and Tenant Strategies

When a handler requires validation for both individual user properties and
tenant-specific isolation constraints, resolve and pass both tokens:

```typescript
services.addTransientFactory(
  TokenHelper.createToken<IHandler<ICommand<null>, null>>(
    'UnauthorizedAccessCommand',
  ),
  (c) => {
    const userStrategy = c.resolve(INJECTION_TOKENS.USER_AUTHORIZATION_PIPELINE)
    const tenantStrategy = c.resolve(
      INJECTION_TOKENS.TENANT_AUTHORIZATION_PIPELINE,
    )

    return new UnauthorizedCommandHandler(
      c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT),
      [userStrategy, tenantStrategy],
    )
  },
)
```

### 2. Passing Only User Strategy

If the handler is globally applicable but requires strict individual user
context or permission validation, pass only the user strategy:

```typescript
services.addTransientFactory(TOKEN, (c) => {
  const userStrategy = c.resolve(INJECTION_TOKENS.USER_AUTHORIZATION_PIPELINE)
  return new CustomHandler(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), [
    userStrategy,
  ])
})
```

### 3. Passing Only Tenant Strategy

If the command or query is anonymous but must obey tenant scoping or validation
rules, pass only the tenant strategy:

```typescript
services.addTransientFactory(TOKEN, (c) => {
  const tenantStrategy = c.resolve(
    INJECTION_TOKENS.TENANT_AUTHORIZATION_PIPELINE,
  )
  return new CustomHandler(c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT), [
    tenantStrategy,
  ])
})
```

### 4. Passing No Strategies

If a handler does not require pre-execution strategy evaluations (e.g., public
endpoints), you can register it without passing any strategies, falling back to
an empty array:

```typescript
services.addTransient(
  TokenHelper.createToken<IHandler<PingCommand, unknown>>('PingCommand'),
  PingCommandHandler,
)
```

---

## Bootstrap Pipeline Configuration & Strategy Availability

In order to resolve the user or tenant strategy tokens within your service
container factories, they must be explicitly configured and enabled in the
bootstrap configuration block.

### How It Works

Inside your application `bootstrap()` function, the `AppBuilder` exposes a
pipeline configuration callback via `.addPipeline()`:

```typescript
const builder = new AppBuilder()

builder
  .addContext()
  .addMiddlewares()
  .addPipeline((config) => {
    // Enables the core authorization engine infrastructure
    config.authorization.isEnabled = true

    // Activates multi-tenant pipeline strategy bindings
    config.authorization.tenant = true

    config.queryBus.isEnabled = true
  })
```

:::info Setting `config.authorization.isEnabled = true` and
`config.authorization.tenant = true` flags the framework initialization sequence
to dynamically register the concrete implementations for
`INJECTION_TOKENS.USER_AUTHORIZATION_PIPELINE` and
`INJECTION_TOKENS.TENANT_AUTHORIZATION_PIPELINE` into the central service
container.

If these flags are left false or unconfigured, the corresponding tokens will not
be populated in the container, causing resolving attempts inside
`addTransientFactory` to fail at application initialization time. :::
