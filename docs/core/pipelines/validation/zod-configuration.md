# Automated Infrastructure Scaffolding

Declarative schema validation using Zod is integrated out of the box during the
structural workspace generation phase managed by the `@XenoJS/create`
interactive CLI engine.

Confirming the pipeline or core telemetry infrastructure modules during
execution, or selecting the `complete` bootstrap mode, automatically configures
the runtime boundary by appending the immutable schema engine to your client
application's `package.json` file:

```json
{
  "dependencies": {
    "zod": "^4.4.3"
  }
}
```

## Programmatic Integration Block (`AppBuilder`)

To bind Zod schemas to specific entry points, map your schemas inside the
`.addPipeline()` configuration block exposed by the `AppBuilder` fluent host.
The `schemas` record uses the exact `intent` identifier string of your CQRS
request as the lookup key:

```typescript
import { AppBuilder } from '@xeno/core'
import { z } from 'zod'

// 1. Declare your strongly-typed Zod runtime schema
export const RegisterCompanyCommandSchema = z.object({
  id: z.string().uuid(),
  corporateName: z
    .string()
    .min(3, 'Corporate name must contain at least 3 characters'),
  taxIdentifier: z
    .string()
    .regex(/^[0-9A-Z]{11,16}$/, 'Invalid tax identifier footprint'),
})

async function bootstrap() {
  const builder = new AppBuilder()

  builder
    .addContext()
    .addMiddlewares()
    .addPipeline((opts) => {
      opts.performance.thresholdMs = 500

      // 2. Map the request intent directly to the Zod contract
      opts.validation = {
        zod: {
          schemas: {
            RegisterCompanyCommand: RegisterCompanyCommandSchema,
          },
        },
        customValidationStrategy: undefined,
      }
    })

  return await builder.build()
}
```

---

## Under the Hood: Pipeline Pipeline Mechanics

When `builder.build()` evaluates, the framework's internal
`ValidationUtils.addValidation` pipeline triggers a sequence of automated
registration routines:

1. **Service Provisioning**: The `ZodValidatorService` is initialized and
   attached under the immutable `INJECTION_TOKENS.ZOD_VALIDATOR` container
   address.
2. **Strategy Wireup**: The framework attaches the validator to the
   `SchemaValidationStrategy` under the
   `INJECTION_TOKENS.SCHEMA_VALIDATION_STRATEGY` slot.
3. **Pipeline Injection**: The strategy is appended to the `ValidationPipeline`,
   ensuring execution occurs before execution hits the core handlers.

When a message is processed, `ZodValidatorService` queries its internal memory
map using the request's `intent` attribute. If a schema matches, it runs a
non-throwing execution via `safeParse`:

```typescript
// Abstract of XenoJS's structural error-packing runtime behavior
if (!zodResult.success) {
  const errorMessage = zodResult.error.issues
    .map((issue) => `[${issue.path.join('.')}] ${issue.message}`)
    .join(', ')

  return Result.fail(
    AppError.create({
      code: PIPELINE_ERROR_CODES.VALIDATION_ERROR,
      message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.VALIDATION_ERROR],
      status: STATUS_CODES.BAD_REQUEST,
      name: 'ZodValidatorService',
      cause: new Error(`Validation failed for schema: ${errorMessage}`),
    }),
  )
}
```

Any validation violations break execution immediately. The service formats the
nested Zod path issues into a readable structural string (e.g.,
`[body.taxIdentifier] Invalid tax identifier footprint`), returning an
`AppError` payload paired with an HTTP `400 Bad Request` status footprint.
