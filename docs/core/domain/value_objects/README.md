# Value Objects & Immutability

## Overview

A **Value Object** is an immutable domain pattern that represents a descriptive
concept, measurement, or metric within the business boundary. Unlike Entities,
Value Objects possess no identity lineage or persistent ID reference.

Two Value Objects are considered identical if all their structural attributes
intersect completely. Within XenoJS, this contract is implemented by the
**`ValueObject<T>`** abstract base class.

---

## Technical Design Principles

The `ValueObject<T>` component enforces deep structural data safety at the
framework layer:

### 1. Absolute Immutability

Upon instantiation, the object seals its inner parameter dictionary completely
using `Object.freeze()`:

```typescript
protected constructor(props: T) {
  this._props = Object.freeze({ ...props })
  Object.freeze(this)
}

```

Any attempt to overwrite a value object attribute at runtime triggers a severe
structural assignment crash, protecting the system against implicit side-effects
across parallel application tracks.

### 2. Structural Value-Based Equality

Value Objects cannot use standard reference comparisons (`vo1 === vo2`). XenoJS
overrides the **`.equals()`** routine, implementing deep value comparison by
serializing the properties into a deterministic JSON string matrix via
`StringHelper.safeStringify`:

```typescript
public equals(vo: Optional<IValueObject<T>> = undefined): boolean {
  if (Guards.isNullOrEmpty(vo) || Guards.isNullOrEmpty(vo.getValue())) {
    return false
  }
  return StringHelper.safeStringify(this._props) === StringHelper.safeStringify(vo.getValue())
}

```

---

## Enterprise Implementation Blueprint

The following blueprint outlines how to structure a Value Object to encapsulate
complex business attributes safely:

```typescript
import { ValueObject } from '@xeno/core'

export interface MoneyProps {
  amount: number
  currency: string
}

/**
 * @description Immutable Value Object enclosing currency operational mechanics.
 */
export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props)
  }

  public static create(amount: number, currency: string): Money {
    if (amount < 0) {
      throw new Error(
        'Financial transaction monetary amounts cannot be negative values.',
      )
    }
    return new Money({ amount, currency })
  }

  /**
   * Operative business extension returning a fresh immutable structure
   */
  public add(other: Money): Money {
    if (!this.equals(other)) {
      throw new Error(
        `Currency mismatch mismatch: Cannot merge ${this._props.currency} with ${other.getValue().currency}`,
      )
    }
    return new Money({
      amount: this._props.amount + other.getValue().amount,
      currency: this._props.currency,
    })
  }
}
```
