<div align="center">
  <img src="logo/logo.png" alt="Xeno Logo" width="140" />

  <h1>Xeno Core</h1>

  <p><em>Enterprise-grade DDD & CQRS framework for Node.js</em></p>

  <p>
    <a href="https://github.com/xeno-js/xeno-js">
      <img src="https://img.shields.io/badge/Powered%20by-Xeno-blueviolet?style=flat-square" alt="Powered by Xeno" />
    </a>
    <a href="https://github.com/xeno-js/xeno-js/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@xeno?style=flat-square" alt="License: ISC" />
    </a>
    <a href="https://www.npmjs.com/package/@xeno-js/core">
      <img src="https://img.shields.io/npm/v/@xeno-js/core?style=flat-square" alt="NPM Version" />
    </a>
    <a href="https://buymeacoffee.com/xenojs">
      <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-FFdd00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" />
    </a>
  </p>
</div>

---

## What is Xeno?

**Xeno** is an enterprise-grade, runtime-agnostic architectural framework for
Node.js built natively with TypeScript. It provides structural primitives for
implementing robust **Domain-Driven Design (DDD)** and **Command Query
Responsibility Segregation (CQRS)** patterns. By shifting operational logic away
from delivery mechanisms and transport frameworks, Xeno ensures your core
application architecture remains pristine, testable, and completely isolated
from external infrastructural churn.

---

## 💡 Why Choose Xeno?

Modern Node.js frameworks often tie business workflows tightly to HTTP server
abstractions or rely heavily on experimental language features. Xeno fixes this
with an emphasis on developer experience, type safety, and clean separation of
concerns.

- **Zero Decorators**: Xeno eliminates reliance on experimental or unstable TS
  decorator specifications (`reflect-metadata`). The IoC container
  (`ServiceContainer`) uses pure, explicit functional factories that optimize
  compilation speeds and eliminate runtime black-box behaviors.
- **Complete Server Decoupling**: Xeno does not care if you use Fastify, Hono,
  Express, Koa, or AWS Lambda. The presentation layer handles incoming data
  using plain, primitive contracts, making migration or multi-runtime hosting
  completely seamless.
- **Pay-For-What-You-Use (Opt-in Modularity)**: Core dependencies are
  strategically classified as optional peer dependencies. If your architecture
  doesn't use Redis, Sentry, or Supabase, you do not pull them into your node
  modules.
- **Enterprise-Grade Resiliency & Cross-Cutting Pipelines**: Address complex
  distributed patterns natively without code duplication. Xeno provides
  out-of-the-box composite behaviors:
  - **Idempotency**: Implements multi-tenant logic keyspaces matching advanced
    SaaS factory patterns for logical partitioning.
  - **Concurrency Control**: Mitigates thundering herd impacts via advanced
    backoff retry strategies coupled with randomized jitter.
  - **Resilience Policies**: Deep integration with circuit breakers, bulkheads,
    and fallbacks.
  - **Deterministic Type Safety**: Strong infrastructure validation strategies
    using Zod schemas.

---

## 📖 Documentation & Getting Started

To explore the architecture, programmatic configurations, and extension
workflows of Xeno, read the full technical manuals located inside the main
documentation hub:

- **[Framework Documentation Repository](https://www.xeno-js.it/introduction)**

Inside, you will find exhaustive, step-by-step assembly guides covering core
host building (`AppBuilder`), isolated request middleware lifecycles, functional
`Result` monads, and zero-trust authorization pipeline behavior tracks.

---

## 🚀 Live Executable Demos

Want to see how Xeno works? Check out the functional example application
showcasing end-to-end command/query segregation, multi-tenant databases, and
resilient schema handling.

You can dive straight into the explicit source code modules of specialized
sandbox environments:

- **[`pipelines_middleware_demo/`](./demo/pipelines_middleware_demo/)**: Traces
  an execution thread from the raw HTTP transport presentation layer, executing
  automated header extraction and anchoring metadata variables into
  `AsyncLocalStorage` thread boundaries.

---

## 📦 Installation

Install the core package:

```bash
npm install @xeno-js/core

```

Xeno uses **Optional Peer Dependencies**. You only install the external
libraries you actually need. Node.js will strictly lazy-load only the modules
you enable in the configuration.

```bash
# Example: Install tools only if you enable them in the builder
npm install zod pino cockatiel drizzle-orm

```

---

## ⚡ Bootstrapping & Middleware Example

Below is an architectural example of how to configure the Xeno
`ServiceContainer`, load core modules, and process an incoming application
payload natively inside a server middleware wrapper.

### 1. Initialize the Container and Configure Modules

```typescript
import { AppBuilder, LOG_LEVEL, TOKENS, XenoRegistry } from '@xeno-js/core'
import { FindUserQueryHandler } from './user/cqrs/handlers/index'
import { FindUserController } from './user/controllers/index'
import { UserMapper } from './user/mappers/user.mapper'
import { UserWriteRepository } from './user/repositories/user-write.repository'
import { UserDataSource } from './user/datasources/user.datasource'

// Map your registry token with XenoRegistry<TSchemaDb, TExtension>
type MyRegistry = XenoRegistry<{ /** Your Db Schema here **/}, {
  USER_MAPPER_TOKEN: UserMapper
  USER_DS_TOKEN: UserDataSource
  USER_REPOSITORY_TOKEN: UserWriteRepository
  FIND_USER_QUERY_HANDLER_TOKEN: FindUserQueryHandler
  FIND_USER_CONTROLLER_TOKEN: FindUserController
}>

// Create the root IoC container context
export const xeno = new AppBuilder<MyRegistry>()
        // Configure middleware and only PUBLIC routes
        .addMiddlewares(opts => {
            opts.routeRegistry = {
                '/api/user/:id': ['GET', 'UPDATE', 'DELETE'],
            }
        })
        // Configure the CQRS pipeline
            // Can register Policies for your intent
              .addPipeline((config) => {
                config.authorization.policies = {
                  'FIND_USER_QUERY_HANDLER_TOKEN': {
                    // Add authz by user id
                    userId: true
                    // Add authz by tenant id
                    tenantId: true
                    // Add authz by roles
                    roles: ['admin']
                    // Add authz by perissions
                    permissions: ['read'],
                }
            }
            // Can add idempotency pipeline for command
            config.commandBus.idempotency = { lockTtlSeconds: 30, processedTtlSeconds: 60 }
            // Can add concurrency pipeline for command
            config.commandBus.concurrency = { delayConfig: { baseDelayMs: 100, maxJitterMs: 500 }, maxRetries: 3 }
            // Can add caching pipeline for query
            config.queryBus.isEnabled = true
        })
        // Configure Database with drizzle
        .addDb((opts, config) => {
            opts.connectionString = config.getOrThrow('DATABASE_URL')
        })
        // Configure Authentication with supabase
        .addAuth((opts, config) => {
            opts.key = 'demo-key'
            opts.url = config.getOrThrow('API_BASE_URL')
        })
        // Configure your logger (e.g. Console, Sentry, Pino or custom logger)
        .addLogger((config) => {
            config.level = LOG_LEVEL.INFO
            config.console = true
        })
        // Register your services
        .addServices((services) => {
            // REGISTER MAPPER
            services.addScoped('USER_MAPPER_TOKEN', () => new UserMapper())

            // REGISTER DATASOURCES
            services.addScoped('USER_DS_TOKEN', (c) => new UserDataSource(c.resolve(TOKENS.DB_CONTEXT)))

            // REGISTER REPOSITORIES
            services.addScoped('USER_REPOSITORY_TOKEN', (c) => new UserWriteRepository(c.resolve('USER_DS_TOKEN'), c.resolve('USER_MAPPER_TOKEN')))

            // REGISTER HANDLERS
            services.addScoped('FIND_USER_QUERY_HANDLER_TOKEN', (c) => {
                const requestcontext = c.resolve('USER_CONTEXT_FACTORY')
                const repository = c.resolve('USER_READ_REPOSITORY')
                return new FindUserQueryHandler(repository, requestcontext)
            })

            // REGISTER CONTROLLERS
            services.addTransient('FIND_USER_CONTROLLER_TOKEN', (c) => {
                return new FindUserController(c.resolve(TOKENS.CONTEXT_ACCESSOR), c.resolve(TOKENS.MEDIATOR))
            })
        })

```

### 2. Wrap and Run within Server Middleware (e.g., Fastify / Hono)

```typescript
import 'dotenv/config'
import { ContainerUtils, TOKENS } from '@xeno-js/core'
import fastify from 'fastify'
import { bootstrap } from './bootstrap'

async function runDemo() {
  console.log('⚙️ Initialized Xeno Container...')
  try {
    // 1. Bootstrap the application and get the service container
    const xenoApp = await bootstrap.build()

    console.log('🚀 Starting Fastify server on http://localhost:3000...')

    // 2. Resolve the middleware from the container
    const middleware = xeno.resolve(TOKENS.MIDDLEWARE)
    // 3. Create a Fastify instance to handle HTTP requests
    const app = fastify()

    // ─── ENDPOINT 2: QUERY ────────────────────────────────────────────
    app.get('/api/user/:id', async (request, reply) => {
      // 4. Execute the middleware to handle the request context and authentication, then call the StatusController's handle method with the request payload.
      const responseDto = await middleware.execute(
        {
          path: '/api/user/:id',
          method: 'GET',
          transport: { res: reply, req: request },
        },
        { ...request.headers },
        async () => {
          const { id } = request.params as any
          const controller = ContainerUtils.resolveServiceScoped(
            'FIND_USER_CONTROLLER_TOKEN',
            xenoApp,
          )
          return await controller.handle({ id: id ?? '123' })
        },
      )

      return reply
        .status(responseDto.status)
        .type('application/json')
        .send(responseDto.data)
    })

    console.log('✅ Routes set up. Ready to accept requests.')

    // ─── START SERVER ─────────────────────────────────────────────────
    try {
      await app.listen({ port: 3000 })
      console.log('🚀 Application running on http://localhost:3000')
      console.log('👉 GET  /api/user/:id  (GET: api/user/1)')
    } catch (err) {
      console.error('Error starting Fastify server:', err)
      app.log.error(err)
      process.exit(1)
    }
  } catch (error) {
    console.error('Error during bootstrap or server setup:', error)
    process.exit(1)
  }
}

runDemo()
```

---

## 🛠 Scaffold your project with CLI

Xeno includes an official CLI tool, `@xeno-js/cli`, designed to bootstrap your
new application in seconds. It offers an interactive setup to select exactly the
modules you need (Database, HTTP, Auth, Logging, etc.), ensuring you start with
a clean, pre-configured architecture tailored to your specific requirements.

If you want to learn how to use it, see the full options available, or
understand how the scaffolding engine works, check the
**[CLI Documentation](https://www.xeno-js.it/cli/overview)**.

---

## 🤝 For Contributors

We welcome contributions to Xeno! To maintain the highest code quality and
stability of the core framework, **direct pushes to the `main` and `develop`
branches are strictly prohibited.** Please follow this Git Flow to contribute:

1. **Branch off from `develop`**: Create a new branch for your feature or
   bugfix.

```bash
   git checkout develop
   git pull origin develop
   git checkout -b feat/your-awesome-feature
```

2. **Make your changes**: Write your code and ensure it passes all local checks
   (linting, types, and tests).

```bash
npm run check
```

3. **Commit your changes**: We enforce
   [Conventional Commits](https://www.conventionalcommits.org/). Husky will
   verify your commit message format.

4. **Commit Format:**

```bash
feat(scope): add new feature
fix(scope): resolve bug
chore(scope): update dependencies
```

5. **Submit a Pull Request (PR)**: Push your branch to GitHub and open a Pull
   Request targeting the **`develop`** branch.

6. **Review**: The repository owner will review your code, run pipeline tests,
   and merge it into `develop`.

_Note: The `main` branch is strictly reserved for production releases. Code
flows from feature branches ➡️ `develop` ➡️ `main`._

### Scripts

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run build`         | Builds the TypeScript source code into `dist/` |
| `npm run typecheck`     | Checks types without emitting files            |
| `npm run lint`          | Runs ESLint                                    |
| `npm run format`        | Formats code with Prettier                     |
| `npm run test`          | Runs the Vitest test suite                     |
| `npm run test:coverage` | Runs tests and generates a coverage report     |

### Code Quality (Husky & Git Hooks)

This project strictly enforces code quality rules before pushing to the
repository:

- **`pre-commit`**: Runs `lint-staged` on staged files (ESLint + Prettier).
- **`commit-msg`**: Checks commit messages with `commitlint` (we use
  Conventional Commits).
- **`pre-push`**: Runs type checking, linting, and testing before code leaves
  your machine.

---

## 🌱 Support & Appreciation

Building, benchmarking, and maintaining a progressive, enterprise-ready
open-source framework requires a massive amount of continuous dedication and
architectural engineering.

If Xeno has brought value to your development workflows, helped decouple your
core business logic, or simplified your system infrastructure layout, consider
supporting its open-source lifecycle. Your backing directly accelerates our
strategic roadmap for new out-of-the-box transport integrations (such as gRPC,
RabbitMQ, and GraphQL) and keeps the documentation pristine.

**Want to know how you can contribute or sponsor Xeno?** We rely on the
commitment of our community to keep the project independent and thriving.
Whether you are an individual developer or a business using Xeno, your support
makes a real difference.

👉
**[Read our support guidelines and find out how to help](https://www.xeno-js.it/support-us)**

Thank you for being part of this decoupled open-source journey!

<amp-bounce>
</amp-bounce>
<a href="https://www.buymeacoffee.com/xenojs" target="_blank">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="42" style="height: 42px !important;" />
</a>

---

## 🛡️ Powered by Xeno

If you are using Xeno in your project, let the world know! Add this badge to
your README:

```html
<a
  href="[https://github.com/xeno-js/xeno-js](https://github.com/xeno-js/xeno-js)"
  target="_blank"
>
  <img
    src="[https://img.shields.io/badge/Powered%20by-Xeno-black?style=flat-square](https://img.shields.io/badge/Powered%20by-Xeno-black?style=flat-square)"
    alt="Powered by Xeno"
    height="20"
  />
</a>
```

## 📄 License

Copyright (c) 2026 Xeno. Licensed under the [ISC License](LICENSE).
