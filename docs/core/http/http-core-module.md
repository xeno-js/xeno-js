# The Orchestration Strategy via `addHttpCore`

While utilizing `.addHttp()` and `.addResilience()` as independent
initialization nodes is valid, production environments demand that communication
and resilience behave as a single, coordinated mechanism.

The `HttpCoreModule` completely automates this step. When calling
`.addHttpCore()`, the framework registers an isolated Axios instance, attaches a
Cockatiel engine under `INJECTION_TOKENS.RESILIENCE_CLIENT`, and transparently
glues them together inside an instances of the **`RemoteDataSource`** engine.

---

## Automated CLI Scaffolding & Environmental Variables

When scaffolding a workspace with the interactive `@Gantry5/create` CLI tool,
selecting the `http` option automatically prepares your runtime environment
matrix. The CLI appends a granular blueprint block directly to your project's
local `.env.example` file:

```env
# --- HTTP Client (Axios & Cockatiel) ---
HTTP_BASE_URL=https://api.example.com
HTTP_RETRY_ATTEMPTS=3
HTTP_RETRY_BASE_DELAY_MS=100
HTTP_RETRY_MAX_DELAY_MS=1000
HTTP_CIRCUIT_BREAKER_CONSECUTIVE_FAILURES=5
HTTP_CIRCUIT_BREAKER_HALF_OPEN_TIMEOUT_MS=30000
HTTP_BULKHEAD_MAX_CONCURRENT_OPERATIONS=10

```

By separating these definitions into distinct environmental values, you can
adapt timeouts, concurrent execution ceilings, and retry backoff behaviors
dynamically across hosting infrastructure without altering compiled TypeScript
application bundles.

---

## Application Bootstrap Declaration

Inside your src/bootstrap.ts file, you can map these environmental definitions
straight into the unified addHttpCore configuration block. Note the use of
strongly-typed internal tokens for container tracking:

```ts
import {
  AppBuilder,
  IRemoteDataSource,
  IHttpClient,
  TokenHelper,
} from '@gantry5/core'

// Define the injection identifier token used by your domain repositories
export const DISPATCH_DATA_SOURCE_TOKEN =
  TokenHelper.createToken<IRemoteDataSource>('DISPATCH_DATA_SOURCE_TOKEN')
export const DISPATCH_CLIENT_TOKEN = TokenHelper.createToken<IHttpClient>(
  'DISPATCH_HTTP_CLIENT',
)

async function bootstrap() {
  const builder = new AppBuilder()

  builder.addHttpCore((opts) => {
    // 1. Assign the structural token where the RemoteDataSource will be stored
    opts.dataSourceToken = DISPATCH_DATA_SOURCE_TOKEN

    // 2. Provision the transport block
    opts.http = {
      token: DISPATCH_CLIENT_TOKEN,
      client: {
        baseURL: process.env.HTTP_BASE_URL,
        timeoutMs: parseInt(process.env.HTTP_TIMEOUT_MS || '5000', 10),
        defaultHeaders: { 'Content-Type': 'application/json' },
      },
    }

    // 3. Provision the resilience parameters
    opts.resilience = {
      retry: { attempts: 3, baseDelayMs: 500, maxDelayMs: 5000 },
      circuitBreaker: { consecutiveFailures: 5, halfOpenTimeoutMs: 15000 },
      bulkhead: { maxConcurrent: 25 },
    }
  })

  return await builder.build()
}
```

---

## Architectural Guardrail: Consume `RemoteDataSource`

> 🛡️ **ARCHITECTURAL STANDARD PRINCIPLE**: Do not resolve or consume
> `IHttpClient` or `IServiceResilience` directly within your application
> controllers or domain use cases.

Always extract the registered `IRemoteDataSource` token. The `RemoteDataSource`
class abstracts raw implementation details, ensuring that:

- You never write code that manually handles HTTP verbs alongside circuit
  breaker execution blocks.
- Your domain layer remains independent of Axios or Cockatiel signatures.
- Outgoing request parameters pass safely through framework error translation
  barriers, mapping native exceptions to clean, testable `AppError` structures.

---

## Practical Blueprint: Executing a Resilient Request

Below is an explicit enterprise implementation example demonstrating how an
application repository extracts the configured `IRemoteDataSource` from the IoC
container to dispatch highly resilient, strongly typed transaction requests:

```typescript
import type { IServiceContainer, IRemoteDataSource } from '@gantry5/core'
import { DISPATCH_DATA_SOURCE_TOKEN } from './bootstrap'

// 1. Define strongly typed interfaces for data contracts
interface OrderPayload {
  itemId: string
  quantity: number
  userId: string
}

interface ShipmentResponse {
  shipmentId: string
  estimatedDelivery: string
  trackingUrl: string
}

export class OrderShipmentRepository {
  private readonly _dataSource: IRemoteDataSource

  constructor(container: IServiceContainer) {
    // Resolve the centralized RemoteDataSource adapter via its registered token
    this._dataSource = container.resolve<IRemoteDataSource>(
      DISPATCH_DATA_SOURCE_TOKEN,
    )
  }

  public async dispatchOrder(
    order: OrderPayload,
    abortSignal?: AbortSignal,
  ): Promise<ShipmentResponse> {
    // 2. Build the decoupled HttpRequest transaction envelope
    const requestEnvelope = {
      method: 'POST' as const,
      query: undefined,
      body: order,
      signal: abortSignal,
      headers: {
        'X-Idempotency-Key': `idemp_${order.userId}_${Date.now()}`,
      },
      timeoutMs: 8000, // Granular override option extending past factory defaults
    }

    // 3. Dispatch via the facade. Resilience policies automatically intercept execution
    const result = await this._dataSource.send<ShipmentResponse, OrderPayload>(
      '/shipments/dispatch', // Target endpoint path concatenated automatically onto baseURL
      requestEnvelope,
    )

    // 4. Evaluate execution safety using the DDD functional result block
    if (!result.isOk()) {
      const error = result.getErrorOrThrow()
      // [Inferenza] Error mapping architecture routes Axios errors safely to standard domain failures
      throw new Error(
        `Failed to process order routing infrastructure: ${error.message}`,
        { cause: error },
      )
    }

    // Return the strongly-typed payload unpacked securely from the response abstraction layer
    return result.getValueOrThrow()
  }
}
```

# The Orchestration Strategy via `addHttpCore`

While utilizing `.addHttp()` and `.addResilience()` as independent
initialization nodes is perfectly valid, enterprise production environments
demand that outward integration pipelines and fault-tolerance sub-systems behave
as a single, fully coordinated mechanism.

The `HttpCoreModule` completely automates this architectural convergence. When
calling `.addHttpCore()`, the framework registers an isolated Axios engine
instance, builds an underlying Cockatiel execution sandbox, and transparently
pairs them together inside a unified **`RemoteDataSource`** engine.
