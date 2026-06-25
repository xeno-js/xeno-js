# Defensive Type Guards (`Guards`)

## Overview

The **`Guards`** utility engine delivers static, high-performance execution
checkpoints across the application workspace. Acting as a predictive type
assertion layer, it empowers the TypeScript compiler to infer exact types inside
complex runtime blocks while providing synchronous fail-fast boundaries to
intercept anomalies before they propagate deep into the domain model.

---

## Operational Method Matrix

### 1. `Guards.isDefined<T>(value: Optional<T>): value is T`

Evaluates whether a targeted reference contains a concrete, operational payload.
It explicitly filters out occurrences of `null` or `undefined`.

- **Use Case**: Guarding conditional blocks against property resolution failures
  on uninitialized domain entities.

```typescript
if (Guards.isDefined(props.email)) {
  // Compiler automatically narrows type from Optional<string> to string
  this.sendNotification(props.email)
}
```

### 2. `Guards.isNullOrEmpty(value: unknown): boolean`

A broad boundary check targeting empty strings, unassigned object references, or
unpopulated arrays.

- **Use Case**: Used by the base `Entity` constructor to decide whether to
  trigger automated unique ID creation or process a pre-existing identifier.

```typescript
if (Guards.isNullOrEmpty(id)) {
  this.id = UniqueId.create() // Automatically scaffold fresh UUID
}
```

### 3. `Guards.isObject(value: unknown): boolean`

Validates that an incoming untyped parameter payload structurally represents a
standard JavaScript object dictionary.

- **Use Case**: Intercepting raw network response error objects inside HTTP
  transportation blocks before parsing key-value fields.

### 4. `Guards.throwIfNegative(value: number, message: string): void`

A strict metric boundary guard. If the checked integer evaluates to a negative
value (`< 0`), it halts execution immediately by throwing a structural
application exception.

- **Use Case**: Validating timeout parameters, bulkhead concurrent ceilings, or
  retry counts inside the `CockatielResilienceFactory` bootstrap pipeline.

```typescript
Guards.throwIfNegative(config.retry.attempts, 'Attempts cannot be negative')
```
