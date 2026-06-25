# Overview

The `ExceptionPipeline` acts as the ultimate protective perimeter for the
application host. Placed at the very beginning of the Mediator's decoration
loop, it functions as a global try/catch safety net. It catches any unhandled
exceptions, intercepts unexpected environment crashes, and normalizes them into
structured, type-safe error footprints before they cascade out to presentation
layer response handlers.

---

## Why It Is Needed

In enterprise software design, letting unhandled runtime exceptions escape out
to the network layer introduces severe architectural liabilities:

- **Security & Stack Leakage**: Raw runtime errors often expose file paths,
  database query structural profiles, or cluster connectivity credentials within
  their stack traces, violating basic security hardening standards.
- **Contract Violation**: Presentation clients (REST APIs, GraphQL endpoints,
  message brokers) expect predictable contractual responses. Raw engine failures
  degrade contract uniformity.
- **Data Flow Unification**: By translating standard JavaScript errors into the
  framework’s custom domain representation (`AppError`), Gear5 handles failure
  tracking deterministically using clean functional programming semantics
  (`Result.fail`) instead of throwing chaotic exceptions.

---

## Configuration & Pipeline Behavior

The `ExceptionPipeline` requires no manual registration parameters because it is
critical to the basic operational health of the CQRS engine. It is registered as
a singleton service under **`INJECTION_TOKENS.EXCEPTION_PIPELINE`** during the
evaluation phase of the framework's internal `CqrsModule`.

### Operational Workflow

1. The Mediator receives a request and invokes `ExceptionPipeline.handle()`.
2. The pipeline forwards execution to the subsequent behaviors in the chain via
   `next()`.
3. If downstream handling succeeds, the clean `Result` payload passes backwards
   unmodified.
4. If a downstream module throws a native error, the catch block intercepts
   execution:

- If the caught anomaly is already a structured `AppError`, it is returned
  directly as a clean failure result.
- If the caught anomaly is a raw system exception, it is securely mapped into a
  standard **`SYSTEM_EXCEPTION`** wrapper with an HTTP
  `500 Internal Server Error` status profile.

```typescript
// Core implementation summary of Gear5 exception isolation
try {
  return await next()
} catch (error: unknown) {
  if (error instanceof AppError) return Result.fail(error)

  const appError = AppError.create({
    code: PIPELINE_ERROR_CODES.SYSTEM_EXCEPTION,
    message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.SYSTEM_EXCEPTION],
    status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    name: request.intent,
    cause: error,
  })
  return Result.fail(appError)
}
```
