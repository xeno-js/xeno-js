---
title: Value Objects & Defensive Immutability in Domain Drive Desing (DDD)
sidebar_position: 3
description:
  Detailed guide on designing immutable, identity-less domain concepts using the
  Xeno ValueObject base class.
keywords:
  - value object
  - ddd primitives
  - immutability
  - object equality
  - structural equality
  - defensive coding
---

# Value Objects & Defensive Immutability

## Definition

A Value Object in Xeno is a Domain type that has no identity and is compared by
its value. In the current implementation, `ValueObject<T>` provides a base class
for immutable properties and structural equality.

## What It Is

Definition: `ValueObject<T>` is an abstract class in the Domain layer used to
model concepts such as money, email, or other constrained domain values.

Behavior: It stores its internal state in `_props`, freezes the copied object in
the constructor, and exposes value operations through `equals`, `getValue`, and
`toString`.

Effect: The Domain can represent business concepts as explicit types instead of
raw primitives, reducing scattered validation and comparison logic.

## How It Works

Definition: The base class applies defensive immutability and value-based
comparison.

Behavior:

- Constructor:
  - Copies incoming props with `{ ...props }`
  - Applies `Object.freeze` to the copied props
  - Applies `Object.freeze(this)` to the instance
- Equality:
  - `equals` returns `false` when the compared instance is null/empty
  - Otherwise it compares `StringHelper.safeStringify(this._props)` with
    `StringHelper.safeStringify(vo.getValue())`
- Value access:
  - `getValue` returns a shallow copy of `_props`
  - `toString` returns `StringHelper.safeStringify(this._props)`

Effect: The class enforces an immutable public surface and a consistent
comparison contract for Value Objects.

## Why It Exists

Definition: Value Objects isolate Domain invariants in dedicated types.

Behavior: Instead of passing raw primitives through Application and Domain code,
a Value Object centralizes construction rules and equality semantics in one
place.

Effect: This design reduces duplicated rule checks and makes Domain behavior
more predictable.

## Example

Definition: The following example defines a `MoneyValueObject` with factory
validation and an additive operation that returns a new instance.

Behavior:

- `create` validates amount and currency format before constructing
- `add` rejects currency mismatch
- Every state change returns a new Value Object

Effect: Consumers work with explicit Domain values while preserving
immutability.

```typescript
import { Guards, ValueObject } from '@xeno/core'

export interface MoneyProps {
  amountInCents: number
  currency: string
}

export class MoneyValueObject extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props)
  }

  public static create(
    amountInCents: number,
    currency: string,
  ): MoneyValueObject {
    if (amountInCents < 0) {
      throw new Error('Monetary values cannot be negative.')
    }

    if (Guards.isNullOrEmpty(currency) || currency.trim().length !== 3) {
      throw new Error('Currency must be a valid 3-letter code.')
    }

    return new MoneyValueObject({
      amountInCents,
      currency: currency.toUpperCase().trim(),
    })
  }

  public get amountInCents(): number {
    return this._props.amountInCents
  }

  public get currency(): string {
    return this._props.currency
  }

  public add(other: MoneyValueObject): MoneyValueObject {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add values with different currencies.')
    }

    return new MoneyValueObject({
      amountInCents: this.amountInCents + other.amountInCents,
      currency: this.currency,
    })
  }
}

const a = MoneyValueObject.create(1500, 'EUR')
const b = MoneyValueObject.create(1500, 'EUR')
const c = MoneyValueObject.create(2500, 'EUR')

console.log(a.equals(b)) // true
console.log(a.equals(c)) // false
```

## Constraints / Limitations

Definition: The current implementation applies shallow immutability and
serialization-based comparison.

Behavior:

- `Object.freeze` is shallow: nested objects are not recursively frozen
- `getValue` returns a shallow copy
- `equals` depends on `StringHelper.safeStringify` output
- The base class does not enforce invariants by itself; subclasses must enforce
  them (commonly through factory methods)

Effect: Subclasses should keep props flat where possible or implement additional
defensive strategies when nested mutable structures are required.

## Next Step

For error propagation patterns in Domain and Application flows, continue with
[Functional Monads & Core Errors](./functional-monads-core-errors).
