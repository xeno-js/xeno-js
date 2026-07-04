---
title: Functional Monads & Core Errors
sidebar_position: 4
description:
  Practical developer manual for handling operational outcomes and domain errors
  using Xeno Result monad and AppError architecture.
keywords:
  - result monad
  - apperror
  - functional programming
  - error handling
  - resulttype
  - domain validations
---

# Functional Monads & Core Errors

## Definition

Functional Monads and Core Errors in Xeno describe two complementary constructs:
`Result<TValue, TError>` for explicit operation outcomes, and `AppError` for
structured thrown errors.

## What It Is

Definition: `Result` is a Domain container with two channels (success or
failure). `AppError` is a typed error envelope extending `Error` with `code` and
`status`.

Behavior:

- `Result` instances are created through `Result.ok()` and `Result.fail()`
- `Result` exposes `isOk()`, `getValueOrThrow()`, and `getErrorOrThrow()`
- `AppError` instances are created through static factories such as
  `AppError.create`, `AppError.throw`, and `AppError.aborted`
- `AppError.throwIfAborted` checks an optional `AbortSignal` and throws when
  aborted

Effect: Application and Domain flows can express expected failures as values
while preserving a structured path for thrown runtime errors.

## How It Works

Definition: The current implementation separates value-based failure handling
from thrown exceptions.

Behavior:

- Result flow:
  - `Result.ok(value)` creates a success instance
  - `Result.fail(error)` creates a failure instance
  - `isOk()` selects the branch
  - `getValueOrThrow()` throws when called on failure
  - `getErrorOrThrow()` throws when called on success
- AppError flow:
  - `AppError.create(payload)` returns a configured error object
  - `AppError.throw(payload)` throws immediately
  - `AppError.aborted(name)` builds a standardized aborted error
  - `AppError.throwIfAborted(signal, name)` enforces cancellation boundaries
- Type alias:
  - `ResultType<T, E = AppError>` maps to `Result<T, E>`

Effect: The framework enables explicit branching for business outcomes and
consistent error metadata for thrown failures.

## Why It Exists

Definition: The model is designed to make outcome handling explicit at call
sites.

Behavior: Consumers must check the result state before unwrapping values, and
can use a shared error shape when propagating thrown failures.

Effect: This reduces ambiguous control flow and improves consistency across
Application, Domain, Infrastructure, and Presentation boundaries.

## Example

Definition: The example returns `Result.fail` for a Domain rule violation and
`Result.ok` for a successful path.

Behavior:

- A debit command validates balance before mutation
- Failure returns `Result.fail(AppError.create(...))`
- Success returns `Result.ok(receipt)`
- Consumer branches with `isOk()` before unwrapping

Effect: The caller handles both outcomes without relying on exceptions for
expected business paths.

```typescript
import {
  AppError,
  ERROR_CODES,
  Result,
  ResultType,
  STATUS_CODES,
} from '@xeno/core'

interface TransferReceipt {
  transactionId: string
  processedAt: Date
}

class BankAccount {
  private balanceInCents = 50000

  public executeDebit(amountInCents: number): ResultType<TransferReceipt> {
    if (amountInCents > this.balanceInCents) {
      return Result.fail(
        AppError.create({
          name: 'InsufficientFundsException',
          code: ERROR_CODES.BAD_REQUEST,
          status: STATUS_CODES.BAD_REQUEST,
          message: 'Insufficient funds.',
          cause: undefined,
        }),
      )
    }

    this.balanceInCents -= amountInCents

    return Result.ok({
      transactionId: 'TXN-' + Date.now().toString(36).toUpperCase(),
      processedAt: new Date(),
    })
  }
}

async function handleTransfer(
  command: { amount: number },
  signal?: AbortSignal,
) {
  AppError.throwIfAborted(signal, 'handleTransfer')

  const account = new BankAccount()
  const result = account.executeDebit(command.amount)

  if (!result.isOk()) {
    const error = result.getErrorOrThrow()
    return {
      success: false,
      error: { code: error.code, message: error.message },
    }
  }

  return { success: true, data: result.getValueOrThrow() }
}
```

## Constraints / Limitations

Definition: The current implementation has explicit behavior constraints that
should be considered in handler design.

Behavior:

- `getValueOrThrow` and `getErrorOrThrow` throw generic `Error` when used on the
  wrong branch
- `Result` does not enforce exhaustiveness by itself; callers must branch via
  `isOk()`
- `Result.ok()` allows `undefined` values
- `AppError` payload construction is manual; consistency depends on caller
  conventions

Effect: Teams should adopt disciplined usage patterns, especially in Query and
Command Handler code, to keep outcome handling deterministic.

## Next Step

Continue with
[The Request-Identity Storage Lifecycle](../execution-context-middleware/README.md)
to connect Result-based flows with request-scoped execution context.
