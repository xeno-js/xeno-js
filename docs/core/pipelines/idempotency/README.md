# Idempotency pipeline behavior

The `IdempotencyPipeline` shields the application use-case boundaries from
duplicate command processing. Operating exclusively along the **Command Track**,
it inspects incoming requests using distributed transactional mutex locks. This
ensures that any uniquely identified command token is fully processed exactly
once, guarding the system against duplicate message execution.

---

## Why It Is Needed

- **Network Retry Anomalies**: Due to network unreliability, API clients or
  message brokers (like RabbitMQ or SQS) often dispatch duplicate messages if an
  original HTTP acknowledgment or handshake gets delayed.
- **Double Submission Prevention**: Safeguards critical financial and business
  side-effects against race conditions—such as double-charging a credit card,
  generating duplicate invoices, or submitting a single checkout cart multiple
  times.
- **Stateless Scaling Protection**: When running multiple instances of an app
  across a cluster, local atomic checks are insufficient. This pipeline provides
  distributed locking to guarantee safety across all application instances.

---

## Configuration & Pipeline Behavior

The behavior is bound under **`INJECTION_TOKENS.IDEMPOTENCY_PIPELINE`**. It
depends on the `IRequestContext` to resolve incoming transaction identifiers and
integrates with an `IIdempotencyStore` backed by your cache infrastructure
(In-Memory or Redis).

To activate idempotency, declare the parameters inside the `commandBus` config
block:

```typescript
import { AppBuilder } from '@graviton5'

builder.addPipeline((opts) => {
  opts.commandBus.idempotency = {
    lockTtlSeconds: 120, // Duration an active execution lock is held (Default: 300)
    processedTtlSeconds: 43200, // Cache window for completed payloads (Default: 86400)
  }
})
```

### Multi-Tenant Keyspace Partitioning

To satisfy security isolation criteria in multi-tenant environments, the
underlying storage engine implements the **AWS SaaS Factory Pattern**. Rather
than using generic key paths globally, the store inspects the user context:

- **Standard Key**: `commands:${requestId}`
- **Multi-Tenant Partition**: `tenant:${tenantId}:commands:${requestId}`

### Operational Execution Cycle

1. **Deduplication Check**: The pipeline checks if the unique request ID exists
   in the store. If found, it bypasses handler re-execution entirely and
   immediately returns the pre-calculated success payload.
2. **Lock Acquisition**: If the request is new, it attempts to acquire a
   short-lived atomic lock. If the lock attempt fails (indicating a concurrent
   duplicate request is already processing), it aborts with a `409 Conflict`
   status.
3. **Handler Execution**: If the lock is successfully acquired, execution flows
   down to the target use-case handler.
4. **Finalization**:

- **Success**: The resulting data payload is safely saved in the store with your
  configured TTL, and the temporary lock is released.
- **Failure/Exception**: If the operation fails or crashes, the lock is cleared
  immediately to allow clients to retry the transaction safely.
