# Dependency Injection Lifetimes Manual

## The Instance Allocation Core Engine

The underlying **`ServiceContainer`** client tracks dependency resolution chains
through three explicit lifetime boundaries. Choosing the correct registration
boundary changes how resources are allocated, how long instances remain in
memory, and how state properties behave across asynchronous threads.

---

## Architectural Lifetime Definitions

### 1. Singleton (`lifetime: 'singleton'`)

A single instance is instantiated exactly once per container lifetime and cached
inside an internal system memory map. Every subsequent resolution call across
the application fetches the same shared reference.

- **Ideal Use Cases**: Stateless infrastructure engines, thread-safe
  communication pool configurations, or memory stores (e.g., Redis cluster
  managers, Sentry loggers, global configuration singletons).
- **Registration**: `container.addSingleton(Token, Class, [Deps])`

### 2. Transient (`lifetime: 'transient'`)

No internal caching occurs. The container executes a clean instantiation routine
on every single resolution invoke, returning a brand-new instance.

- **Ideal Use Cases**: Lightweight domain services, stateless command
  validators, or localized data transformation utilities where data fields must
  never persist across separate operations.
- **Registration**: `container.addTransient(Token, Class, [Deps])`

### 3. Scoped (`lifetime: 'scoped'`)

A single instance is created exactly once per operational execution scope window
(`IServiceScope`). If multiple application targets request this token within the
same active scope, they receive the same shared instance reference.

- **Critical Constraint**: Attempting to resolve a scoped token directly through
  the root container structure triggers an immediate, fatal framework exception:
  _"Scoped services must be resolved through a scope. Use createScope()."_.
  Scoped tokens are isolated to request boundaries, such as an incoming HTTP
  transaction web request.
- **Ideal Use Cases**: Per-request context stores, units of work, or
  user-identity correlation trackers.
- **Registration**: `container.addScoped(Token, Class, [Deps])`

---

## Programmatic Resolution Factories (`add*Factory`)

When a class requires dynamic runtime evaluations, complex constructor inputs,
or manual configuration parameters that cannot be inferred via static dependency
lists, you can bypass standard class parsing entirely by utilizing the **Factory
Registration System**.

The factory methods—`addSingletonFactory`, `addScopedFactory`, and
`addTransientFactory`—accept a custom programmatic closure callback that
receives the active `IServiceContainer` instance as an execution argument,
giving you complete manual control over construction mechanics:

```typescript
import { AppBuilder, TokenHelper } from '@gantry5/core'
import { CryptoService } from './services/crypto.service.js'

export const CRYPTO_CLIENT_TOKEN =
  TokenHelper.createToken<CryptoService>('CRYPTO_CLIENT')

builder.addServices((container) => {
  // Registering a custom programmatic instantiation factory
  container.addSingletonFactory(CRYPTO_CLIENT_TOKEN, (currentContainer) => {
    // 1. Manually resolve upstream dependencies from the container if required
    // const coreLogger = currentContainer.resolve(INJECTION_TOKENS.LOGGER);

    // 2. Run complex programmatic setup logic
    const encryptionAlgorithm = process.env.CRYPTO_ALGORITHM || 'aes-256-gcm'
    const privateKeyBits =
      encryptionAlgorithm === 'chacha20-poly1305' ? 256 : 512

    // 3. Return the fully configured instance manually
    return new CryptoService(encryptionAlgorithm, privateKeyBits)
  })
})
```

Factories respect their declared structural lifetimes exactly like class
registrations. For example, a `singletonFactory` runs its instantiation callback
exactly once on the first resolution call and caches the result for all
subsequent cycles.
