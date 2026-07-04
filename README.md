<div align="center">
  <img src="website/static/img/logo.png" alt="Xeno Logo" width="140" />
  
  <h1>Xeno</h1>
  
  <p><em>Enterprise-grade DDD & CQRS framework for Node.js</em></p>
  
  <p>
    <a href="https://github.com/Mattia-Carcione/xeno">
      <img src="https://img.shields.io/badge/Powered%20by-Xeno-blueviolet?style=flat-square" alt="Powered by Xeno" />
    </a>
    <a href="https://github.com/Mattia-Carcione/xeno-js/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@xeno?style=flat-square" alt="License: ISC" />
    </a>
    <a href="https://www.npmjs.com/package/@xeno">
      <img src="https://img.shields.io/npm/v/@xeno?style=flat-square" alt="NPM Version" />
    </a>
    <a href="https://buymeacoffee.com/xenojs">
      <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-FFdd00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" />
    </a>
  </p>
</div>

---

> ⚠️ **Beta Status**: `@xeno` is currently in **beta**. The API may undergo
> breaking changes. To install the latest beta version, use:
> `npm install @xeno@beta`

---

**The production-ready TypeScript accelerator. Multi-tenant CQRS, Drizzle ORM,
and solid RBAC out of the box in a fluent API.** Build blazing-fast,
serverless-ready APIs with the elegant DX of .NET, without the vendor lock-in of
heavy frameworks.

---

## 💡 Why Xeno?

Most modern Node.js frameworks rely on heavy abstractions through decorators and
reflection. While they offer rapid setup, these approaches often lead to:

- **"Hidden Magic"**: Debugging and tracing the execution flow becomes
  difficult.
- **Heavy Cold-Starts**: The computational cost of reflection drastically
  reduces performance in serverless environments.
- **Lock-in**: You become tightly coupled to the framework’s opinionated
  architecture and toolset.

**Xeno** inverts this paradigm. It is not a "cage," but an architectural
accelerator that restores full control over your TypeScript stack.

### Why choose Xeno?

- **Zero Magic, Zero Decorators & Cloud Optimized**: Xeno avoids "magic"
  meta-programming in favor of explicit, strongly-typed configuration. The
  result is lightning-fast cold starts and a codebase that is straightforward to
  debug because the code is exactly what you see. Its lightweight footprint
  makes it perfect for serverless and edge computing environments (AWS Lambda,
  Cloudflare Workers, Vercel Edge), allowing you to leverage highly
  cost-effective cloud infrastructure without compromising performance.
- **Transparent & DDD-First Architecture**: Xeno enforces a native "Clean
  Architecture" (`domain`, `application`, `infrastructure`, `presentation`).
  Every component is isolated, and the data flow (CQRS) is fully traceable,
  eliminating the "black box" effect common in traditional frameworks.
- **100% Agnostic & Decoupled**: Xeno acts as a Kernel. It doesn't force you
  into a specific web server; it provides the business logic and execution
  pipelines, leaving you free to choose your preferred transport layer (Express,
  Hono, Fastify, or CLI). By strictly decoupling your business logic from
  infrastructure, external libraries, and frameworks, Xeno ensures your core
  domain remains highly testable, maintainable, and scalable. This isolation
  allows you to swap, upgrade, or mock external components without ever
  impacting your primary business logic.
- **Install Only What You Need**: Xeno utilizes **Optional Peer Dependencies**.
  You only install the external libraries you actually require. The framework is
  designed to strictly lazy-load only the modules you enable in your
  configuration, keeping your node_modules lean, preventing dependency bloat,
  and reducing build sizes.
- **Precision Engineering**: Configuration is handled via a fluent, type-safe
  `AppBuilder`. Dependency management uses `TokenHelper` with nominal branding,
  preventing cross-token resolution errors and ensuring the DI container remains
  consistent and predictable.
- **Enterprise-Ready Out of the Box**: Stop reinventing the wheel for complex
  requirements. Xeno integrates native enterprise patterns:

- **CQRS Pipelines**: Ready-to-use logic for Logging, Validation (Zod),
  Idempotency, and Concurrency.
- **Resilience**: Fault handling via configured `cockatiel` policies (Retry,
  Circuit Breaker, Bulkhead).
- **Database**: Powerful, typed abstraction via `Drizzle ORM`, ensuring
  transactional integrity and performance.

### An "Open" Framework

Xeno hides nothing. Need a custom authorization strategy or a specific log
driver? The modular approach via `IModule` allows you to extend the framework
without fighting its conventions. It is designed for developers who understand
their code and want a robust "backbone" framework that doesn't obstruct
architectural choices.

Xeno doesn't dictate how to write your business logic; it provides the
enterprise-grade infrastructure to run it at peak performance.

---

## 📖 Documentation & Getting Started

To explore the architecture, programmatic configurations, and extension
workflows of Xeno, read our full technical manuals located inside the main
documentation hub:

- **[Framework Documentation Repository](./docs/README.md)**

Inside, you will find exhaustive, step-by-step assembly guides covering core
host building (`AppBuilder`), isolated request middleware lifecycles, functional
`Result` monads, and zero-trust authorization pipeline behavior tracks.

---

## 🚀 Live Executable Demos

Before writing your first corporate use-case, inspect our fully operational
reference environments designed to showcase decoupled enterprise topologies in
action. Read the main entry point documentation at:

- **[Live Demos Directory Overview](./demo/README.md)**

You can dive straight into the explicit source code modules of our specialized
sandbox environments:

- **[`pipelines_middleware_demo/`](./demo/pipelines_middleware_demo/)**: Traces
  an execution thread from the raw HTTP transport presentation layer, executing
  automated header extraction and anchoring metadata variables into
  `AsyncLocalStorage` thread boundaries.
- **[`http_core_demo/`](./demo/http_core_demo/)**: Examines the architectural
  configuration of fault-tolerant external data sources orchestrated
  concurrently via sandboxed Axios instances and Cockatiel policy rings.
- **[`database_drizzle_demo/`](./demo/database_drizzle_demo/)**: Reviews
  automated data mapper isolation, strongly-typed repository components,
  transactional units of work, and Fluent Filter compilation grids interfacing
  with PostgreSQL.

---

## 📦 Installation

Install the core package:

```bash
npm install @xeno

```

Xeno uses **Optional Peer Dependencies**. You only install the external
libraries you actually need. Node.js will strictly lazy-load only the modules
you enable in the configuration.

```bash
# Example: Install tools only if you enable them in the builder
npm install zod pino cockatiel drizzle-orm

```

---

## ⚡ Quick Start (The Magic Moment)

Forget writing hundreds of lines of boilerplate. Instantiate the `AppBuilder`,
configure your architecture using the fluent API, and build your container.

```typescript
import { AppBuilder } from '@xeno/core';

async function bootstrap() {
  const builder = new AppBuilder();

  builder
    // 1. Setup Core Modules
    .addMiddlewares()
    .addContext()

    // 2. Add Logging (e.g., Pino)
    .addLogger((config) => {
      config.console = true;
      config.level = LOG_LEVEL.INFO
    })

    // 3. Configure the CQRS Pipeline
    .addPipeline((config) => {
        config.authorization.tenant = true
        config.commandBus.idempotency = { lockTtlSeconds: 60 }
        config.commandBus.concurrency = { maxRetries: 3 }
    });

    // 4. Configure HTTP Client (Axios) with pattern resilience (Cockatiel)
    .addHttpCore((config) => {
        config.dataSourceToken = TokenHelper.createToken<IRemoteDataSource>('DUMMY_HTTP_CORE_TOKEN')
        config.http.token = TokenHelper.createToken<IHttpClient>('DUMMY_HTTP_TOKEN')
        config.http.client.baseURL = 'https://dummy-http-core.local'
        config.http.client.timeoutMs = 5000
        config.http.client.defaultHeaders = { 'X-Custom-Header': 'dummy-value' }
        config.resilience.retry.attempts = 5
    })

    // 5. Configure DB Client (Drizzle)
    .addDb((config) => {
        config.connectionString = 'postgres://dummy:dummy@localhost:5432/dummy'
        config.tables = { "NAME_TABLE": "NAME_DRIZZLE_PGTABLE" }
    })

    // 6. Configure Authentication with supabase
    .addAuthentication((config) => {
        config.url = 'https://dummy-auth.local'
        config.key = 'dummy-key'
    })


  // 7. Build the DI Container!
  // This resolves the dependency graph safely.
  const container = await builder.build();

  return container;
}

```

### Dispatching a Command

Once your container is built, executing a command through the Mediator
automatically runs it through your configured pipelines (Validation -> Logging
-> Idempotency -> Retry -> Execution).

```typescript
// Resolve the Mediator from the container
const mediator = container.resolve(INJECTION_TOKENS.MEDIATOR)

// Dispatch a command
const command = new CreateUserCommand({ email: 'test@xeno.dev' })
const result = await mediator.send(command)

if (!result.isOk()) {
  console.error('Command failed:', result.getErrorOrThrow())
}
```

---

## 🛠 Scaffold your project with CLI

Xeno includes an official CLI tool, `@xeno/create`, designed to bootstrap your
new application in seconds. It offers an interactive setup to select exactly the
modules you need (Database, HTTP, Auth, Logging, etc.), ensuring you start with
a clean, pre-configured architecture tailored to your specific requirements.

If you want to learn how to use it, see the full options available, or
understand how the scaffolding engine works, check the
**[CLI Documentation](./cli/README.md)**.

---

## 🏗️ Architecture Structure

The framework strictly follows Clean Architecture principles. When using Xeno,
we recommend structuring your application as follows:

```text
src/
 ├── domain/         # Entities, Value Objects, Domain Events, Repository Contracts
 ├── application/    # Use Cases, Command/Query Handlers, DTOs
 ├── infrastructure/ # External Services, DB Adapters (Drizzle), HTTP Clients (Axios)
 └── presentation/   # Your REST/GraphQL Controllers, Edge functions, or CLI
```

---

## 🗺️ Release Roadmap & Lifecycle

Xeno is currently in **Beta**. We are actively stabilizing the architecture of
the core engine while incrementally expanding our developer tooling and
distributed systems primitives.

### 🟢 Current Phase: v1.0.0-beta.x (Core Architecture)

The foundational, transport-agnostic core engine is fully operational and open
for architectural evaluation:

- **Ambient Context Management:** Robust tenant and request isolation powered by
  Node's native `AsyncLocalStorage`.
- **Nominal Branded IoC:** Compile-time, type-safe dependency injection
  utilizing branded token symbols to eliminate runtime resolving errors.
- **CQRS Pipeline Mediator:** Centralized command/query dispatching with support
  for automated pipeline middleware behaviors.
- **Native Service Resilience:** Out-of-the-box fault tolerance (Circuit
  Breakers, Retries) baked into external HTTP data sources via Axios and
  Cockatiel.
- **Day-Zero Scaffolding CLI:** Initial interactive project bootstrapper
  managing environment variables, configurations, and Drizzle ORM integration.

---

### 🟡 In Development: v1.0.0-rc.x (Developer Experience)

We are bridging the gap between rigorous software engineering and rapid daily
development:

- **Multi-Transport Server Scaffolding:** Automated CLI setups for
  pre-configured HTTP servers (Express, Fastify, Hono) pre-wired with the core
  context middleware.
- **Boilerplate Generators:** Aggressive CLI generation commands
  (`xeno g command <name>`) to scaffold commands, queries, and their respective
  handlers instantly.
- **Automated DI Wiring:** Programmatic AST-based injection to automatically
  append tokens and register new handlers within the container bootstrap file.

---

### 🔵 Planned: v1.0.0 Stable (Enterprise Distributed Toolkit)

The final milestone designed to turn Xeno into an elite platform for highly
scalable, event-driven distributed microservices:

- **Unit of Work (UoW):** Coordinated, atomic transaction management across
  decoupled data repositories and message channels.
- **Transactional Outbox Pattern:** Integrated "at-least-once" delivery
  mechanics to guarantee database-to-broker consistency during infrastructure
  failures.
- **Message Broker Bindings:** Native transport-agnostic pub/sub abstractions
  with official production-ready drivers for Kafka and RabbitMQ.
- **Event Sourcing Kernel:** Native tactical primitives for tracking state
  transitions via Aggregate Roots, Event Streams, and Snapshotting.

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
**[Read our support guidelines and find out how to help](./docs/support/README.md)**

Thank you for being part of this decoupled open-source journey!

<amp-bounce></amp-bounce>
<a href="https://www.buymeacoffee.com/xenojs" target="_blank">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="42" style="height: 42px !important;" />
</a>

---

## 🛡️ Powered by Xeno

If you are using Xeno in your project, let the world know! Add this badge to
your README:

```html
<a
  href="[https://github.com/Mattia-Carcione/xeno](https://github.com/Mattia-Carcione/xeno)"
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
