# Transportation Contract Metadata

The extraction of raw protocol data is managed by the unified
**`HttpHeaderExtractor`** service (bound to
`INJECTION_TOKENS.SERVICE_EXTRACTOR`). This component maps incoming HTTP string
key matrices directly into a normalized `Metadata` transport model.

```

| Metadata Property | Target HTTP Header Key | Fallback Generation Logic | Purpose                                                                                                 |
| ----------------- | ---------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `correlationId`   | `x-correlation-id`     | `GuidHelper.generate()`   | Global cross-system operational identifier used to stitch distributed microservice trace logs together. |
| `requestId`       | `x-request-id`         | `GuidHelper.generate()`   | Local transaction tracker identifying a single, isolated execution loop request.                        |
| `token`           | `authorization`        | `undefined`               | Cryptographic bearer string containing account claim structures.                                        |
| `clientIp`        | `x-forwarded-for`      | `x-real-ip`               | `undefined`                                                                                             | Network tracking variable capturing the origin IP of the client agent. |
| `spanId`          | `x-span-id`            | `undefined`               | Granular telemetry span node marker passed directly to tracking collectors (e.g., Sentry).              |

```

---

## Nested Token Extraction Infrastructure

The processing of the cryptographic credential string uses a highly decoupled
strategy pattern. The `HttpHeaderExtractor` does not parse raw authentication
headers internally. Instead, it delegates token isolation to a specialized
**`BearerTokenExtractor`** dependency:

```typescript
// Internal composition strategy wire-up inside MiddlewareModule
container.addSingleton(
  INJECTION_TOKENS.BEARER_TOKEN_EXTRACTOR,
  BearerTokenExtractor,
  [],
)
container.addSingleton(
  INJECTION_TOKENS.SERVICE_EXTRACTOR,
  HttpHeaderExtractor,
  [INJECTION_TOKENS.BEARER_TOKEN_EXTRACTOR],
)
```

The nested extractor checks the header formatting rules, automatically stripping
away the `Bearer ` string prefix to isolate the clean JWT signature required by
downstream identity verification providers.

---

## Protocol Transportation Schema Blueprint

For an incoming transaction to pass safely through the extraction layer,
external HTTP requests must match the following header string formatting
footprint:

```http
POST /api/v1/payments/process HTTP/1.1
Host: gateway.Xeno-enterprise.io
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTIzIn0...
X-Correlation-ID: 7b9e12c4-84d1-4db5-9e67-ea22f183d201
X-Request-ID: 1d88f6c3-11a2-4789-b349-fcc119283f55
X-Span-ID: telemetry_span_88421
X-Forwarded-For: 192.168.1.45

```
