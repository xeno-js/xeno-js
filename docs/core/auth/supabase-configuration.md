# Infrastructure Provisioning

Integrating Supabase as the underlying identity provider can be fully automated
during the initialization of a brand new project via the `@Graviton5/create`
scaffolding CLI tool.

When prompted by the interactive CLI engine:

```bash
Would you like to install Supabase for Authentication? (Y/n)

```

Selecting **`Y`** or invoking the script directly in `complete` execution mode
automatically alters the compiled structural layout by injecting required
dependencies, configuring environmental templates, and generating application
bootstrap blocks.

### Dependency Manifestation

The framework adds the official, isomorphic Supabase client package directly to
your application's `package.json` manifest:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.35.0"
  }
}
```

---

## Mapped Environment Matrix

The CLI appends granular authentication configuration parameters directly to
your local `.env.example` file. These variables ensure that the runtime can
communicate with your Supabase Auth instance across different hosting topologies
without recompiling the application bundle:

```env
# --- Authentication (Supabase) ---
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

```

- **`SUPABASE_URL`**: The secure API URL gateway found within your Supabase
  project dashboard settings (`Settings -> API`).
- **`SUPABASE_KEY`**: The standard client anonymous public token
  (`anon/public`), allowing the application server to securely interact with the
  Supabase GoTrue authentication daemon.

---

## Programmatic Integration Strategy

The connection is registered via the `.addAuth()` method exposed by the
`AppBuilder` fluent pipeline. The underlying factory
(`SupabaseAuthServiceFactory`) accepts the structurally typed `AuthClientConfig`
contract, allowing full customization of the client options:

```ts
import { AppBuilder } from '@graviton5/core'
import { LOG_LEVEL } from '@graviton5/core'

async function bootstrap() {
  const builder = new AppBuilder()

  builder
    .addContext()
    .addMiddlewares() // Registers basic extractors and fallback gatekeepers
    .addAuth((opts) => {
      // 1. Assign base credentials
      opts.url = process.env.SUPABASE_URL || ''
      opts.key = process.env.SUPABASE_KEY || ''

      // 2. Pass strongly-typed internal Supabase options safely
      opts.options = {
        auth: {
          persistSession: false, // Essential for stateless server runtimes
          autoRefreshToken: false, // Disables background browser timers
        },
      }
    })

  return await builder.build()
}
```
