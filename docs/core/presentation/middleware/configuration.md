# AppBuilder Registration Workflow

The presentation middleware layer is activated and wired into your application's
service container during the bootstrap phase by calling the
**`.addMiddlewares()`** method exposed by `AppBuilder`.

```typescript
import { AppBuilder } from '@xeno/core'

async function bootstrap() {
  const hostBuilder = new AppBuilder()

  hostBuilder
    .addContext()
    // Initializes, maps, and caches the Presentation Middleware behavior stack
    .addMiddlewares()

  return await applicationBuilder.build()
}
```

When `.addMiddlewares()` is invoked, it queues the `MiddlewareModule` task.
During container build, this module automatically resolves cross-dependencies
and binds the primary execution component (`RequestContextMiddleware`) under the
immutable framework key **`INJECTION_TOKENS.MIDDLEWARE`**.

---

## The Zero-Auth Default Guardrail

A core design requirement of the XenoJS framework is to guarantee **fail-safe
operational security**. If an application layout includes `.addMiddlewares()`
but completely omits an identity provider configuration (i.e., skipping
`.addAuth()`), the application will not fail during the container compilation
phase.

To handle this scenario gracefully, the `MiddlewareModule` automatically
registers a default placeholder fallback gateway service known as the
**`NoAuthGateKeeper`**:

```typescript
// Default guardrail registration behavior inside MiddlewareModule
const { NoAuthGateKeeper } = await import('@/application')
container.addSingleton(INJECTION_TOKENS.GATE_KEEPER, NoAuthGateKeeper, [])
```

### Guest Identity Generation Mechanics

When the `NoAuthGateKeeper` intercepts a request envelope via the middleware, it
bypasses network lookup routines entirely. Rather than failing or rejecting the
unauthenticated call, it generates a standard anonymous user representation
known as the **`GUEST`** identity matrix.

This layout allows development servers or public endpoints to execute requests
cleanly under guest conditions. When you later chain `.addAuth()` to your
bootstrap configuration script, the container replaces the fallback
`NoAuthGateKeeper` with your active identity provider service (such as the
`SupabaseAuthService`), cleanly activating credential gating across all your
middleware endpoints.
