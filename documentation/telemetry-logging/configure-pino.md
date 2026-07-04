---
title: Configuring Pino Structured Logging
sidebar_position: 3
description:
  Technical developer manual on activating, configuring, and optimizing JSON
  structured log streams using the Pino logger in the Xeno framework.
keywords:
  - pino logger
  - structured logging
  - json logs
  - log management
  - xeno core
  - telemetry logger
---

# Configuring Pino Structured Logging

The Configuring Pino Structured Logging page defines the initialization
parameters, execution options, and performance optimization configurations of
the structured JSON logging utility within the Xeno framework kernel.

---

## Direct Definition Block

The Pino Structured Logger is an infrastructure-layer diagnostic provider that
serializes framework event logs into single-line JSON streams. It allows
automated ingestion agents to parse and index transactional data tracks
efficiently with minimal event-loop blocking overhead.

---

## The Structured Logging Paradigm

### Definition

Structured JSON logging is an infrastructure-layer pattern that translates code
execution telemetry, pipeline states, and error captures into programmatically
queryable object notations.

### Behavior

Rather than writing unstructured text strings to standard output, the logging
module encapsulates diagnostic data fields uniformly. It captures message types,
nominal intents, elapsed handling times, and error stacks, translating them into
single-line JSON objects matching defined serialization layouts.

### Effect

This enables centralized log aggregators and search engines (such as ELK,
Grafana Loki, or Datadog) to parse, filter, and index application traces
directly without parsing raw strings via regular expressions.

---

## Configuration Reference: `PinoLoggerConfig` Options

### Definition

`PinoLoggerConfig` is the structural configuration layout that controls
environment tagging, destination streams, and string-formatting options for the
Pino logger driver.

### Behavior

The `AppBuilder.addLogger()` registration block maps configuration properties
using the following specific interface parameters:

- **`level`**: Specifies the minimum severity threshold layer captured by the
  logging driver (`DEBUG` | `INFO` | `WARN` | `ERROR`).
- **`console`**: A boolean flag used to enable or disable standard terminal
  stream outputs (`stdout`).
- **`pino.config.env`**: Configures the target runtime environment string used
  to adapt internal streaming rules.
- **`pino.config.destination`**: Dictates the physical target boundary where
  logs are emitted (e.g., standard output or a local file handle path).
- **`pino.config.prettyPrint`**: Toggles terminal text colorization and
  human-readable string reconstruction.

### Effect

This exposes complete programmatic control over application verbosity, allowing
the telemetry format to adjust dynamically across local environments and live
production clusters.

---

## Practical Guide: Configuring Multiple Log Drivers

### 1. Programmatic Initialization within the Bootstrap Loop

#### Definition

Programmatic initialization is the setup sequence where developers declare
minimum severity filters and mount structured logging properties into the
container graph.

#### Behavior

The setup logic acts through a programmatic fluent layout inside
`src/bootstrap.ts`, binding configuration parameters to the `LoggerModule`
context maps during the container assembly phase:

```typescript
// src/bootstrap.ts
import { AppBuilder, LOG_LEVEL } from '@xeno/core'
import type { IServiceContainer } from '@xeno/core'

export async function bootstrap(): Promise<IServiceContainer> {
  const builder = new AppBuilder()

  builder
    .addContext()
    .addMiddlewares()
    .addLogger((opts) => {
      // 1. Set the global visibility filter to capture INFO and higher severities
      opts.level = LOG_LEVEL.INFO

      // 2. Keep standard console prints active
      opts.console = true

      // 3. Configure structured JSON log streaming via Pino
      opts.pino.config = {
        env: process.env.NODE_ENV ?? 'production',
        destination: 'stdout',
        prettyPrint: false, // Bypasses runtime text formatting in production
      }
    })

  return await builder.build()
}
```

#### Effect

This replaces basic terminal outputs with uniform JSON line records across all
use-case command and query executions, keeping execution tracking standardized
across the workspace.

### 2. Customizing Destination Paths for Audit File Logging

#### Definition

Customizing destination paths is an alternative deployment layout that routes
structured telemetry rows to local storage hardware instead of standard output
streams.

#### Behavior

Setting `destination: 'file'` instructs the factory worker to initialize an
append-only file write sequence, passing parameters directly to the location
defined inside the `filePath` primitive:

```typescript
// src/bootstrap.ts
import { AppBuilder, LOG_LEVEL } from '@xeno/core'
import type { IServiceContainer } from '@xeno/core'

export async function bootstrap(): Promise<IServiceContainer> {
  const builder = new AppBuilder()

  builder.addLogger((opts) => {
    opts.level = LOG_LEVEL.DEBUG

    opts.pino.config = {
      env: 'staging',
      destination: 'file',
      filePath: './var/logs/xeno-audit.json',
      prettyPrint: false,
    }
  })

  return await builder.build()
}
```

#### Effect

This creates persistent, continuous local operation records on host storage disk
arrays, allowing logs to survive separate container process restarts.

---

## Architectural Constraints & Trade-offs

- **Production Use of `prettyPrint` Formatter Formats Prohibited**: Activating
  `prettyPrint: true` requires heavy string reconstruction and runtime object
  decomposition loops. Under high production traffic, this string formatting
  overhead blocks the single-threaded Node.js event loop, leading to structural
  transaction processing latency and reduced system throughput.
- **Compulsory File Path Specifications for Local Targets**: Configuring the
  output destination parameter to `'file'` without providing a valid string
  inside `opts.pino.config.filePath` prevents the logger factory from opening
  the underlying stream descriptors. This results in missing diagnostic tracking
  states or triggers a fatal initialization failure during bootstrapping.

---

## Next Steps

Now that your high-performance structured logging streams are configured using
Pino, explore how to pair your telemetry setup with automated cloud exception
monitoring using Sentry:

- **[Proceed to Configuring Sentry Error Tracking](./configure-sentry.md)**
