---
title: HTTP Client Configuration
sidebar_position: 2
description:
  Technical developer guide on configuring, initializing, and isolating outbound
  HTTP clients and custom injection tokens in the Xeno framework.
keywords:
  - http client
  - xeno core
  - httpconfig
  - appbuilder http
  - multi-tenant client
  - dependency injection tokens
---

# HTTP Client Configuration

The HTTP Client Configuration documentation defines the out-of-process channel
composition, connection timeout primitives, and programmatic dependency
injection mapping models managed by the egress communication ring.

---

## Direct Definition Block

The HTTP Client Configuration Subsystem manages outbound network integrations
within the Xeno framework. Handled globally via the fluent `.addHttpCore()`
bootstrap container option, it encapsulates raw network transport layers into
isolated, token-bound container registrations, enabling developers to declare
distinct endpoint base URLs, fallback connection thresholds, and default
tracking headers for individual external microservices or downstream REST APIs.

---

## The Channel Isolation Paradigm

### What it is

The channel isolation paradigm is an architectural layout that transforms
distinct outbound network channels into uncoupled, independently tracked
dependencies.

### How it works

Rather than allowing the codebase to share a single un-opinionated network
configuration, each remote integration track is compiled as a standalone
instance within the service container. Use cases or gateways query specific
integrations by resolving distinct branded tokens, isolating connections from
surrounding platform dependencies.

### Why it exists

Hardcoding networking parameters or sharing a singular global client
configuration introduces severe configuration collisions, where distinct
external services require incompatible headers, authorization tokens, or
deadline boundaries. Furthermore, a lack of runtime channel isolation introduces
cascading failure paths: if an external partner API experiences severe
connection lag, a shared client pool blocks the event-loop socket handles across
all unrelated tracks, resource-starving independent background workflows.

---

## HTTP Client Dependency Isolation

The diagram below visualizes how Xeno isolates multiple external target networks
by compiling distinct token keys within the dependency injection container:

```mermaid
flowchart TD
    subgraph Container [Xeno IoC Service Container]
        direction TB
        TokenA[PAYMENT_API_TOKEN] --> ClientA[HttpClient Instance A: base='[https://api.payments.com](https://api.payments.com)']
        TokenB[SHIPMENT_API_TOKEN] --> ClientB[HttpClient Instance B: base='[https://api.logistics.com](https://api.logistics.com)']
    end

    subgraph Handlers [Application Handlers]
        HandlerA[ProcessPaymentHandler] -->|Resolves| TokenA
        HandlerB[DispatchOrderHandler] -->|Resolves| TokenB
    end

    ClientA -->|Targeted Egress Channel| NetA((External Payment Gateway))
    ClientB -->|Targeted Egress Channel| NetB((External Logistics API))

```

---

## Configuration Reference: `HttpConfig` Primitives

When invoking `.addHttpCore()`, you configure connection variables through the
explicit **`opts.http`** block:

- **`token`**: The unique branded `InjectionToken<IHttpClient>` used to identify
  this specific HTTP client instance inside the container.
- **`client.baseURL`**: The baseline host path (e.g.,
  `https://api.service.com/v1`) prepended to all outbound request paths executed
  by this client.
- **`client.timeoutMs`**: The maximum duration in milliseconds to wait for a
  network response before automatically aborting the request.
- **`client.defaultHeaders`**: A key-value dictionary of HTTP headers
  automatically appended to every outbound request packet.

---

## Practical Guide: Configuring Multiple HTTP Clients

The following blueprint maps a scenario where an application communicates with
two entirely separate downstream services: a Payment Gateway and a Notification
Service. Each service requires custom timeout parameters and dedicated
authentication keys.

### 1. Declaring Service Tokens and Bootstrapping inside `src/bootstrap.ts`

Because Xeno completely rejects dynamic directory indexing, every integration
profile must be programmatically registered inside the initialization sequence
using unique nominal tokens:

```typescript
// src/bootstrap.ts
import { AppBuilder, TokenHelper } from '@xeno/core'
import type {
  IHttpClient,
  IRemoteDataSource,
  IServiceContainer,
} from '@xeno/core'

// A. Initialize Unique Injection Tokens for the HTTP Clients
export const PAYMENT_CLIENT_TOKEN =
  TokenHelper.createToken<IHttpClient>('PaymentHttpClient')
export const NOTIFICATION_CLIENT_TOKEN = TokenHelper.createToken<IHttpClient>(
  'NotificationHttpClient',
)

// B. Initialize Unique Injection Tokens for the overarching Remote Data Sources
export const PAYMENT_DATA_SOURCE_TOKEN =
  TokenHelper.createToken<IRemoteDataSource>('PaymentRemoteDataSource')
export const NOTIFICATION_DATA_SOURCE_TOKEN =
  TokenHelper.createToken<IRemoteDataSource>('NotificationRemoteDataSource')

export async function bootstrap(): Promise<IServiceContainer> {
  const builder = new AppBuilder()

  builder
    .addContext()
    .addLogger()

    // 1. Configure the Isolated Payment Gateway Connection Channel
    .addHttpCore((opts) => {
      opts.dataSourceToken = PAYMENT_DATA_SOURCE_TOKEN
      opts.http.client.token = PAYMENT_CLIENT_TOKEN
      opts.http.client.baseURL =
        '[https://api.stripe-mock.internal/v2](https://api.stripe-mock.internal/v2)'
      opts.http.client.timeoutMs = 3000 // Short timeout for critical transactional paths
      opts.http.client.defaultHeaders = {
        'Accept': 'application/json',
        'X-Provider-Key': process.env.PAYMENT_PROVIDER_SECRET ?? 'secret-key',
      }
      opts.resilience.retry.attempts = 3
      opts.resilience.circuitBreaker.consecutiveFailures = 5
    })

    // 2. Configure the Isolated Notification Service Channel
    .addHttpCore((opts) => {
      opts.dataSourceToken = NOTIFICATION_DATA_SOURCE_TOKEN
      opts.http.client.token = NOTIFICATION_CLIENT_TOKEN
      opts.http.client.baseURL =
        '[https://push.comms-cluster.internal](https://push.comms-cluster.internal)'
      opts.http.client.timeoutMs = 8000 // Longer timeout allowed for background notifications
      opts.http.client.defaultHeaders = {
        'Content-Type': 'application/json',
        'X-Application-Identifier': 'XenoCoreApp',
      }
      opts.resilience.retry.attempts = 3
      opts.resilience.circuitBreaker.consecutiveFailures = 5
    })

  return await builder.build()
}
```

### 2. Consuming the Configured Client inside Custom Infrastructure Services

Once registered during bootstrapping, token-bound HTTP channels inject directly
into infrastructure gateways or API wrappers by resolving the designated token
handle from the container graph:

```typescript
// src/infrastructure/gateways/sms-notification.gateway.ts
import type { IRemoteDataSource, HttpRequest } from '@xeno/core'

export class SmsNotificationGateway {
  // Inject the specific client instance mapped to the notification configuration token
  constructor(private readonly _notificationDataSource: IRemoteDataSource) {}

  /**
   * @description Dispatches an outbound SMS payload using the isolated notification client.
   */
  public async dispatchSmsAlert(
    phoneNumber: string,
    message: string,
    signal?: AbortSignal,
  ): Promise<void> {
    const payload = { recipient: phoneNumber, body: message }

    // Executes a POST request to: [https://push.comms-cluster.internal/sms/send](https://push.comms-cluster.internal/sms/send)
    // Automatically includes 'X-Application-Identifier' and enforces an 8000ms timeout
    await this._notificationDataSource.send('/sms/send', payload)
  }
}
```

---

## Architectural Constraints & Trade-offs

- **Injection Token Override Vulnerability Rules**: Outbound HTTP channels are
  compiled programmatically. If you invoke `.addHttpCore()` multiple times using
  identical `opts.http.client.token` references, the engine overwrites the
  matching internal dictionary records without warnings. This results in
  dependency bugs where separate services communicate with the last registered
  URL endpoint, requiring unique token keys.
- **Compulsory Initialization Fallbacks for String Primitives**: When mapping
  parameters like `client.baseURL`, option setups must implement explicit
  structural string fallbacks (`process.env.KEY || 'mock'`) to catch missing
  environment configurations. Allowing parameters to resolve to undefined causes
  the underlying network drivers to throw fatal resolution exceptions during
  compilation, crashing the boot sequence.

---

## Next Steps

Now that your HTTP client network connections and configuration boundaries are
established, explore how to apply self-healing resilience strategies around your
outgoing calls:

- **[Proceed to Resilience & Fault-Tolerance Policies](./resilience-policies)**
