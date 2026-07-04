---
title: Transportation Contract Metadata & Headers Extraction
sidebar_position: 4
description:
  Technical documentation on how Xeno normalizes incoming transport layer
  headers into typed application metadata via the IServiceExtractor contract.
keywords:
  - header extraction
  - iserviceextractor
  - metadata normalization
  - bearer token extractor
  - http headers
  - token parsing
---

# Transportation Contract Metadata & Headers Extraction

## Definition

This page documents how Xeno normalizes transport headers into typed Metadata
through the IServiceExtractor contract.

## What It Is

Definition: The metadata extraction layer is a transport boundary that maps raw
headers to application-friendly values.

Behavior:

- IServiceExtractor defines a single extract operation
- BearerTokenExtractor parses authorization headers into an optional token
- HttpHeaderExtractor composes correlation ID, request ID, token, client IP, and
  span ID

Effect: Command and Query flows consume consistent metadata without direct
dependency on framework-specific request objects.

## How It Works

Definition: Extraction is split into a generic contract and focused
infrastructure implementations.

Behavior:

- Contract:

```typescript
export interface IServiceExtractor<TRequest, TResponse = unknown> {
  extract(headers: TRequest): TResponse
}
```

- Bearer token parsing:
  - Reads authorization with StringHelper.getSingleValue
  - Returns undefined when header is missing
  - Accepts values starting with bearer followed by a space (case-insensitive)
  - Returns the substring after bearer prefix
- Header metadata composition:
  - correlationId and requestId are parsed with GuidHelper.parse
  - token is delegated to BearerTokenExtractor
  - clientIp is read from x-forwarded-for
  - spanId is read from x-span-id
  - The extractor returns a Metadata object

Effect: Middleware receives normalized metadata ready for authentication and
context composition.

## Why It Exists

Definition: The layer isolates parsing concerns at the transport edge.

Behavior: Headers may arrive as string or string array values.
StringHelper.getSingleValue normalizes this shape so extractors can operate
predictably.

Effect: Parsing rules remain centralized and reusable, reducing duplication
across controllers, adapters, and middleware.

## Example

Definition: The following example shows how a custom transport adapter can use
the registered extractor.

Behavior:

- Resolve SERVICE_EXTRACTOR from the container
- Convert incoming headers to HttpHeaders
- Call extract and forward parsed metadata

Effect: Custom transports can integrate with the same metadata contract used by
RequestContextMiddleware.

```typescript
import type { HttpHeaders } from '@xeno/core'
import { INJECTION_TOKENS } from '@xeno/core'

export class CustomTransportAdapter {
  constructor(private readonly _container: any) {}

  public async handle(input: { headers: HttpHeaders }) {
    const extractor = this._container.resolve(
      INJECTION_TOKENS.SERVICE_EXTRACTOR,
    )
    const metadata = extractor.extract(input.headers)

    return metadata
  }
}
```

## Constraints / Limitations

Definition: The current extraction behavior has explicit limits.

Behavior:

- StringHelper.getSingleValue selects only the first value for array headers
- BearerTokenExtractor only supports authorization values beginning with bearer
  prefix
- GuidHelper.parse may return undefined for invalid identifier formats
- Header name handling depends on the incoming HttpHeaders representation used
  by the transport adapter

Effect: Adapters should normalize header keys consistently and avoid duplicating
parsing logic outside extractor components.

## Next Step

Continue with
[CQRS Pipeline Architecture / Mediator Pattern](../cqrs-pipeline-architecture/README.md).
