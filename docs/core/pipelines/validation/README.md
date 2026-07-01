# Validation pipeline behavior

The XenoJS Validation Subsystem enforces data integrity and structural safety
before any command or query reaches its corresponding domain handler within the
CQRS mediator loop. Built upon the _Pipe and Filter_ architectural pattern, the
core pipeline leverages a dedicated `ValidationPipeline` to intercept requests,
sequentially evaluate an array of strongly-typed validation filters
(`IStrategy`), and execute a strict fail-fast routine if any input parameters
violate system constraints.

```
       [ CQRS Request Envelope ]
                   │
                   ▼
       ┌───────────────────────┐
       │  ValidationPipeline   │
       └───────────┬___________┘
                   │
                   ├─► [ Filter 1 ] SchemaValidationStrategy (Zod Schema Engine)
                   │                      │ (On Violation: Fail-Fast Breakout)
                   │                      ▼
                   │         [ AppError (400 Bad Request) ]
                   │
                   ├─► [ Filter 2 ] CustomValidationStrategy (Bespoke Rules)
                   │
                   ▼
         [ Domain Command/Query Handler ]

```

---

## Why It Is Needed

- **Garbage-In, Garbage-Out Prevention**: Malformed request models or invalid
  parameters can cause unexpected failures deep inside your business logic
  layer. Restricting handler access to clean payloads ensures system
  reliability.
- **Declarative Parameter Verification**: By utilizing Zod schema integration,
  developers can write clean, declarative input constraints (type safety, format
  checking, length boundaries) directly alongside message definitions.
- **Separation of Validation Concerns**: Decouples simple structural contract
  checks (handled via Zod schemas) from complex domain business checks (handled
  via custom validation strategies extending `BaseValidationStrategy`),
  organizing code cleanly around the Single Responsibility Principle.

---

## Configuration & Pipeline Behavior

The behavior maps under **`INJECTION_TOKENS.VALIDATION_PIPELINE`**. It evaluates
data contracts sequentially across two main validation tracks:

```typescript
import { AppBuilder } from '@xeno/core'
import { z } from 'zod'

export const ResetPasswordSchema = z.object({
  token: z.string().uuid(),
  newPassword: z.string().min(8),
})

builder.addPipeline((opts) => {
  opts.validation = {
    // Track A: Declarative Zod Schema Registry
    zod: {
      schemas: {
        ResetPasswordCommand: ResetPasswordSchema,
      },
    },
    // Track B: Array of custom validation strategies extending BaseValidationStrategy
    customValidationStrategy: [],
  }
})
```

### Operational Execution Cycle

1. **Strategy Loop**: When a request hits the pipeline, the `ValidationPipeline`
   loops through all registered strategy filters sequentially.
2. **Track A Evaluation**: The `SchemaValidationStrategy` uses the request's
   `intent` name as a lookup key. If an associated Zod schema exists, it runs a
   non-throwing validation check via `safeParse`.
3. **Track B Evaluation**: The pipeline then executes any custom strategies
   registered within the `customValidationStrategy` array.
4. **Outcome Routing**:

- **Success**: If all validation strategies pass successfully, the request
  proceeds smoothly to the final domain use-case handler.
- **Failure**: If any strategy fails, a structured **`VALIDATION_ERROR`**
  `AppError` is thrown immediately. This drops out with an HTTP
  `400 Bad Request` status, providing a clear list of the specific fields that
  failed validation.

## Documentation Roadmap

To implement, customize, and orchestrate validation layers within a XenoJS
enterprise application, consult the following dedicated technical manuals:

- **[Zod Schema Configuration Guide](./zod-configuration.md)**: Outlines
  automated CLI setup routines, declarative intent-to-schema mapping, and the
  internal engine mechanics driving structural JSON schema analysis.
- **[Custom Validation & Business Rules Manual](./custom-validation.md)**:
  Explains advanced pipeline extension via `BaseValidationStrategy`, strict
  type-safe dependency injection token provisioning using `TokenHelper`, and
  cross-cutting multi-strategy execution.
