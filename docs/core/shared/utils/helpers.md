# Core Framework Helpers

## Overview

Core Framework Helpers provide strongly-typed, predictable wrappers around
native platform operations. By encapsulating infrastructure tasks like UUID
generation, JSON stringification, and object timestamping, they ensure
consistent behavior across all runtime environments.

---

## 1. Cryptographic Identity Engine (`GuidHelper`)

The **`GuidHelper`** abstracts string identification formatting by wrapping
standard unique ID constraints. It is the primary engine fueling the
**`UniqueId`** domain wrapper.

- **`GuidHelper.generate(): string`**: Computes a cryptographically safe,
  completely random UUID v4 compliant string format.
- **`GuidHelper.isValid(value: string): boolean`**: Runs structural regex and
  length verification over an input string to ensure it matches standard UUID v4
  structural layouts.

```typescript
// Used inside the Presentation layer middleware to assign tracking keys
let correlationId = GuidHelper.generate()
let requestId = GuidHelper.generate()
```

---

## 2. Inversion of Control Tokenizer (`TokenHelper`)

The **`TokenHelper`** handles dependency injection registration and resolution
boundaries. It enforces compile-time type boundaries by generating uniquely
branded `InjectionToken<T>` wrappers around standard JavaScript symbols,
preventing naming collisions inside the global service container map.

- **`TokenHelper.createToken<T>(description: string): InjectionToken<T>`**:
  Generates a uniquely branded token matching type `T`. It logs the token inside
  a private central cache registry using the provided description string to
  prevent duplicate generation.
- **`TokenHelper.get<T>(description: string): InjectionToken<T> | undefined`**:
  Interrogates the local map cache to retrieve a pre-existing token context
  without altering container allocations.

```typescript
// Standard implementation paradigm across Xeno infrastructure modules
export const DB_CLIENT_TOKEN =
  TokenHelper.createToken<IDbClient>('DB_CLIENT_TOKEN')
```

---

## 3. Serialization Safeguard (`StringHelper`)

The **`StringHelper`** addresses serialization edge cases within the JavaScript
runtime environment.

- **`StringHelper.safeStringify(value: unknown): string`**: Standardizes deep
  object stringification. Unlike `JSON.stringify()`, which can fail when
  encountering circular references or BigInt values, `safeStringify` executes
  secure, non-throwing translation fallback loops.

### The Architectural Invariant in Domain Value Objects

The `ValueObject` base class relies directly on `safeStringify` to evaluate deep
equality. By converting complex internal property matrices into deterministic
string layouts, the equality check avoids reference pointer bugs:

```typescript
return (
  StringHelper.safeStringify(this._props) ===
  StringHelper.safeStringify(vo.getValue())
)
```

---

## 4. High-Resolution Time Serialization (`DateHelper`)

The **`DateHelper`** provides uniform time tracking parameters across multi-zone
infrastructure grids.

- **`DateHelper.toISOString(date: Date): string`**: Formats native date
  references into standard high-resolution ISO-8601 string representations
  (`YYYY-MM-DDTHH:mm:ss.sssZ`).

This helper is used by presentation exception filters to append accurate
creation timestamps to `ErrorResponseDto` telemetry payloads before transmitting
data to client logs.
