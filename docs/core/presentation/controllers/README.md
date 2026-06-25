# BaseController & HTTP Response Contracts

## Overview

The Presentation Layer acts as the final boundary adapter transforming
framework-agnostic domain results into protocol-compliant communication models.
The **`BaseController<TRequest, TResponse>`** class defines the contract for
presentation layer mapping. It injects the centralized `IMediator` bus and
abstracts response compilation using an internal, frozen engine helper known as
**`HttpHelper`**.

---

## Programmatic Response Orchestration

The `BaseController` exposes two explicit methods designed to map domain
outcomes into protocol-compliant payloads seamlessly:

### 1. Success Payload Interception (`this.ok()`)

Compiles a type-safe, standardized success response envelope wrapping the
underlying data structures, returning a status code of `200 OK` or
`201 Created`:

```typescript
protected handle(request: RegisterUserRequest) {
  const result = await this._mediator.send(new RegisterUserCommand(request));
  return this.ok(result.getValueOrThrow(), 201); // Returns SuccessResponseDto
}

```

### 2. Failure Mapping and Translation (`this.fail()`)

Intercepts an `AppError` payload emitted by failed functional tracks, unpacks
its context variables, and outputs a formatted error envelope mapped to its
corresponding HTTP status boundary:

```typescript
if (!result.isOk()) {
  return this.fail(result.getErrorOrThrow(), 'Optional debugging context') // Returns ErrorResponseDto
}
```

---

## Under the Hood: The `HttpHelper` Output Contracts

Every response dispatched through the controller pipeline maps to a highly
predictable JSON serialization schema via **`HttpHelper`**. This consistency
simplifies data consumption for frontend single-page applications (SPAs) or
external webhooks.

### A. The Success Serialization Structure (`SuccessResponseDto<T>`)

When invoking **`HttpHelper.success`**, the engine compiles a structured payload
containing a telemetry flag, the dataset array, and optional metadata blocks:

```json
{
  "success": true,
  "data": {
    "userId": "usr_7b9e12c4",
    "userName": "USER NAME"
  },
  "meta": {
    "executionMode": "cluster_node_a"
  }
}
```

#### Accompanying Protocol Headers:

- `Content-Type`: `application/json`

### B. The Error Serialization Structure (`ErrorResponseDto`)

When invoking **`HttpHelper.error`**, the engine injects system-wide correlation
tracking keys alongside specific validation parameters. This approach provides
robust traceability and prevents data leakage across system boundaries:

```json
{
  "success": false,
  "error": {
    "code": "EXTERNAL_SERVICE_ERROR",
    "message": "The downstream API integration failed to authorize the connection.",
    "details": "AxiosHttpClientException: Request failed with status code 403"
  },
  "correlationId": "8bf192f4-110a-4712-9c32-ab220f18c399",
  "requestId": "4c9e823d-d122-4988-a342-fcc11928df21",
  "timestamp": "2026-06-25T18:19:00.000Z"
}
```

#### Mandatory Security and Tracking Headers:

- `Content-Type`: `application/json`
- `X-Correlation-Id`: `[GUID]` (Correlates events across asynchronous
  distributed tracking logs)
- `X-Request-Id`: `[GUID]` (Identifies the unique request execution loop)
- `Cache-Control`: `no-store, no-cache, must-revalidate, proxy-revalidate`
  (Forces proxies and browsers to bypass local caching for error responses)
- `Pragma`: `no-cache`
- `Expires`: `0`

```

```
