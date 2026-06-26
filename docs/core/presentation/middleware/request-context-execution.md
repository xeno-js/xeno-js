# The Execution Context Composition

When an external transaction triggers the middleware, the system encapsulates
tracking fields into a standardized, immutable **`ExecutionContext`** object
matrix. This context aggregates data across three distinct boundaries to empower
downstream use cases:

1. **`identity`**: Contains claims, account UUIDs, or organizational boundaries
   corresponding to the authenticated caller.
2. **`network`**: Captures transient client parameters (such as the incoming
   `requestId` and origin `clientIp`).
3. **`tracing`**: Stores high-resolution performance variables (such as the
   initial execution `startTime` and correlation tracking nodes).

---

## Asynchronous Thread Confinement (`runAsync`)

Once the `ExecutionContext` is composed, the middleware passes it directly to
the `IRequestContext` engine by invoking its `.runAsync()` execution boundary
loop.

This engine acts as an abstraction wrapper around Node.js's native
`AsyncLocalStorage` API. By wrapping the downstream `next()` handler inside this
asynchronous closure, the execution metadata is securely bound to the current
asynchronous execution callstack string.

```typescript
// Core request confinement block inside RequestContextMiddleware
return this._requestContext.runAsync(executionContext, async () => {
  return next()
})
```

### The Architectural Benefit

Downstream application services, DDD command handlers, or database repositories
can transparently query the context from anywhere within the request thread by
calling `requestContext.getContext()`. This completely removes the anti-pattern
of manually passing user identity tokens or correlation tracking fields down
through every single method signature in your application layers.

---

## Isolated Request Scopes and Automatic Disposal

To enforce proper memory separation and prevent cross-cutting resource
pollution, each transaction triggers the provisioning of an isolated dependency
bucket. The middleware calls the injected `IServiceScopeFactory` (registered
under `INJECTION_TOKENS.SERVICE_SCOPE_FACTORY`) to instantiate a fresh
**`IServiceScope`**:

```typescript
scope = this._factoryScope.create()
```

This request-scoped DI sub-container houses transient allocations and scoped
resources (such as request context metadata or unit-of-work database
transactions) that exist strictly for the lifespan of the request.

### The Fail-Safe Cleanup Guardrail

To prevent resource starvation or memory leaks, the middleware uses a strict
`try/catch/finally` structure. The `finally` block guarantees that the request
scope is cleanly dismantled and its allocated resources are released immediately
after the response runs to completion:

```typescript
} finally {
  if (Guards.isDefined(scope)) {
    scope.dispose(); // Destroys scoped allocations and closes active descriptors
  }
}

```
