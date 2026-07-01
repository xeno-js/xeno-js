# Functional Monads & Application Errors

## The Railway Oriented Programming (ROP) Pattern

To achieve high-throughput resilience, XenoJS replaces standard runtime
exceptions (`throw new Error`) with the **Result Monad** pattern. By wrapping
execution execution paths inside a structured container, operations propagate
success values or logical errors explicitly. This allows downstream handlers to
process outcomes predictably using type-safe pipelines without crashing active
worker nodes.

---

## Operation Containers (`Result` & `ResultType`)

The framework implements this workflow using the concrete
**`Result<TValue, TError>`** class, alongside a highly specialized enterprise
utility alias named **`ResultType<T>`**:

```typescript
// Core frame declaration of the central functional type contract
export type ResultType<T, E = AppError> = Result<T, E>
```

### Static Instantiation Factory API

- **`Result.ok<U>(value)`**: Compiles a successful track payload container.
  Calling `.isOk()` evaluates `true`.
- **`Result.fail<U, V>(error)`**: Compiles a failed execution path container.
  Calling `.isOk()` evaluates `false`.

### Unpacking Handlers

- **`.getValueOrThrow()`**: Unpacks the success data payload. Attempting to call
  this helper on a failed result raises an immediate, protective framework
  exception.
- **`.getErrorOrThrow()`**: Unpacks the encapsulated error payload context from
  a failed result.

---

## Standardized Application Errors (`AppError`)

When an operation track drops into a failed state, the error is encapsulated
inside an instance of **`AppError`**, which extends the native JavaScript
`Error` root structure. This architecture ensures full callstack capture while
attaching explicit context variables:

```typescript
interface ErrorPayload {
  message: string // Human-readable error description context
  code: string // Categorized machine-readable error token string
  status: number // Direct HTTP status equivalent mapping integer
  name: string // Diagnostic component layer origin name
  cause: Optional<unknown> // Root-cause nested trace object or upstream raw error
}
```

### Connections Disconnect & Abort Guardrails

`AppError` implements advanced infrastructure monitoring hooks to detect network
dropouts early. The **`.throwIfAborted()`** method inspects network context
signals (`AbortSignal`), throwing an automatic, normalized aborted failure
footprint if a connection drops before process completion:

```typescript
public static throwIfAborted(signal: Maybe<AbortSignal>, name: string): void {
  if (Guards.isDefined(signal) && signal.aborted) {
    throw AppError.aborted(name)
  }
}

```

---

## Enterprise Operational Integration Blueprint

```typescript
import { Result, AppError } from '@xeno/core'
import type { ResultType } from '@xeno/core'

export class AccountService {
  public async withdrawFunds(
    accountId: string,
    amount: number,
  ): Promise<ResultType<boolean>> {
    // 1. Evaluate explicit domain boundary constraints
    if (amount <= 0) {
      return Result.fail(
        AppError.create({
          code: 'INVALID_AMOUNT',
          message: 'Withdrawal amounts must be greater than zero.',
          status: 400,
          name: 'AccountService.withdrawFunds',
          cause: undefined,
        }),
      )
    }

    try {
      // 2. Process data changes inside your infrastructure client layers
      const processingSuccess = true
      return Result.ok(processingSuccess)
    } catch (infraError) {
      // 3. Intercept raw system exceptions and wrap them inside an AppError footprint
      return Result.fail(
        AppError.create({
          code: 'LEDGER_CONNECTION_TIMEOUT',
          message:
            'The central transactional ledger failed to acknowledge the request.',
          status: 503,
          name: 'AccountService.withdrawFunds',
          cause: infraError,
        }),
      )
    }
  }
}
```
