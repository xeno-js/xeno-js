# Infrastructure Scaffolding

When provisioning an application ecosystem via the `@Graviton5/create` CLI
initialization engine, enabling remote platform messaging can be accomplished by
confirming the interactive script option:

```bash
Would you like to install Axios and Cockatiel for HTTP requests and resilience? (Y/n)

```

By specifying **`Y`** or supplying the `complete` mode argument to the CLI
executor, the workspace engine injects the required transport drivers straight
into your client workspace properties:

```json
{
  "dependencies": {
    "axios": "^1.16.1"
  }
}
```

---

## Configuration Property Matrix (`HttpClientConfig`)

When declaring custom options during the application bootstrap process, the
transport pipeline maps parameters from your configuration block directly to the
`AxiosFactory` engine:

| Property         | Type                     | Default Value | Description                                                                                                                 |
| ---------------- | ------------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `baseURL`        | `string`                 | `undefined`   | The target root URL endpoint context used for every downstream relative request execution path.                             |
| `defaultHeaders` | `Record<string, string>` | `undefined`   | Global structural HTTP header key-value matrices (e.g., `Content-Type`, custom API keys) appended to all outgoing requests. |
| `timeoutMs`      | `number`                 | `undefined`   | The maximum duration threshold in milliseconds before an incomplete request thread is terminated with a timeout exception.  |

---

## Automated CLI Scaffolding & Environmental Variables

When scaffolding a workspace with the interactive `@Graviton5/create` CLI tool,
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

## Application Initialization Block

To stand up a basic, isolated HTTP client instance, configure the module
directly inside the fluent `AppBuilder` orchestration pipeline using the
`.addHttp()` bootstrap endpoint:

```ts
import { AppBuilder } from '@graviton5'
import { INJECTION_TOKENS } from './di/injection-tokens.constants'

async function bootstrap() {
  const builder = new AppBuilder()

  builder.addHttp((opts) => {
    // 1. Assign the structural lookup registration token
    opts.token = TokenHelper.createToken<IHttpClient>('MY_HTTP_CLIENT')

    // 2. Define transport-level parameters
    opts.client = {
      baseURL:
        process.env.HTTP_BASE_URL || 'https://api.external-service.com/v1',
      timeoutMs: parseInt(process.env.HTTP_TIMEOUT_MS || '5000', 10),
      defaultHeaders: {
        'Accept': 'application/json',
        'X-Client-Identifier': 'Graviton5-core-runtime',
      },
    }
  })

  return await builder.build()
}
```
