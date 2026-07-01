# Entities & Unique Identifiers

## Overview

In Domain-Driven Design, an **Entity** represents an object whose identity
remains continuous, unique, and traceable throughout the entire application
lifecycle, spanning across multiple system-state mutations. Within the XenoJS
framework, this invariant is guaranteed by the abstract **`Entity<T>`** base
class, which decouples an entity's continuous identity from its underlying state
properties (`props`).

---

## Technical Architecture & Invariants

The `Entity<T>` implementation enforces strict enterprise guardrails out of the
box to avoid common architectural anti-patterns:

### 1. True Encapsulation of State Properties

The concrete fields of the entity are wrapped inside a generic data class
parameter (`T`) assigned to a `private readonly props` storage slot. This
architecture ensures that developer handlers cannot bypass domain invariants by
mutating state properties directly.

Any mutations must go through dedicated, expressive methods declared on the
concrete domain class (e.g., `order.shipItems()`), which explicitly validate
business logic before applying values.

### 2. Deep Cloning of State Data

To maintain structural immutability outside the entity perimeter, reading the
underlying parameter map via **`.getProps()`** evaluates a recursive copy
utilizando `structuredClone()`:

```typescript
public getProps(): T {
  return structuredClone(this.props)
}

```

This ensures that upper layer consumers cannot mutate the entity's inner memory
arrays accidentally when mapping models to presentation DTOs or telemetry
structures.

### 3. Automatic Unique Identity Assignment

The constructor automatically provisions an immutable **`UniqueId`** instance.
The constructor accepts a pre-existing identity (crucial when re-hydrating
aggregates from a database layer) or automatically handles creation using a
cryptographically safe UUID v4 generator.

---

## Core Unique ID Wrapping (`UniqueId`)

The framework prohibits the usage of raw primitive types (such as `string` or
`number`) to model entity identities. XenoJS wraps values inside a dedicated
value-holder class known as **`UniqueId`**:

- **Private Construction**: Direct execution of `new UniqueId()` is blocked to
  control structural validity. Instances must generate via the static factory
  **`UniqueId.create()`**.
- **Deep Equality**: Equality checking bypasses standard JavaScript reference
  pointer evaluations. Invoking **`.equals(other)`** safely checks string layout
  values directly:

```typescript
public equals(other: UniqueId): boolean {
  return this._value === other.getValue()
}

```

---

## Enterprise Implementation Blueprint

Below is an explicit blueprint demonstrating how to declare a concrete domain
Entity aggregate inside your use-case modules:

```typescript
import { Entity, UniqueId } from '@xeno/core'
import type { Optional } from '@XenoJS/shared'

export interface CustomerProps {
  firstName: string
  lastName: string
  email: string
  isActive: boolean
}

/**
 * @description Domain Entity managing customer account lifecycle invariants.
 */
export class Customer extends Entity<CustomerProps> {
  // Enforce structural factory boundaries over raw constructors
  private constructor(props: CustomerProps, id?: UniqueId) {
    super(props, id)
  }

  public static create(props: CustomerProps, id?: UniqueId): Customer {
    // Insert corporate validation constraints here before returning instance
    return new Customer(props, id)
  }

  // Explicit expressivity wrapping a property mutation loop
  public deactivateAccount(): void {
    const activeState = this.getProps()
    if (!activeState.isActive) {
      throw new Error('Account is already deactivated.')
    }

    // Assigning updated parameters to the inner props map is done by reconstruction
    // or mutating non-primitive parameters through state methods.
    // Inside XenoJS, props are frozen on construction to lock state stability:
    // this._props.isActive = false; // -> Throws error at runtime
  }

  public get corporateEmail(): string {
    return this.getProps().email
  }
}
```
