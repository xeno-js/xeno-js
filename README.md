# ⚙️ @gear5/core

[![Powered by Gear5](https://img.shields.io/badge/Powered%20by-Gear5-blueviolet?style=for-the-badge)](https://github.com/Mattia-Carcione/gear5)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**The production-ready TypeScript accelerator. Multi-tenant CQRS, Drizzle ORM,
and solid RBAC out of the box in a fluent API.** Build blazing-fast,
serverless-ready APIs with the elegant DX of .NET, without the vendor lock-in of
heavy frameworks.

## 💡 Why Gear5?

Modern Node.js frameworks (like NestJS) provide great structures but come with
heavy costs: massive boilerplate, vendor lock-in, and slow cold-starts due to
decorators and reflection magic.

**Gear5** takes a different approach. It provides a lightweight,
highly-engineered Kernel based on **Domain-Driven Design (DDD)** and **Clean
Architecture**.

- 🚀 **Zero Magic, Zero Decorators:** Ultra-fast cold starts, making it perfect
  for Serverless (AWS Lambda, Cloudflare Workers, Vercel Edge).
- 🧩 **100% Agnostic:** Bring your own framework (Express, Hono, Fastify). Gear5
  handles the logic, you handle the transport.
- 🏗️ **.NET-Style Builder:** A fluent, strongly-typed `AppBuilder` to configure
  your DI container seamlessly.
- 🛡️ **Enterprise Ready:** Native support for CQRS pipelines (Logging,
  Validation, Idempotency, Concurrency Retries) out of the box.

---

## 📦 Installation

Install the core package:

```bash
npm install @gear5/core

```

Gear5 uses **Optional Peer Dependencies**. You only install the external
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
import { AppBuilder } from '@gear5/core';

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
const command = new CreateUserCommand({ email: 'test@gear5.dev' })
const result = await mediator.send(command)

if (!result.isOk()) {
  console.error('Command failed:', result.getErrorOrThrow())
}
```

---

## 🏗️ Architecture Structure

The framework strictly follows Clean Architecture principles. When using Gear5,
we recommend structuring your application as follows:

```text
src/
 ├── domain/         # Entities, Value Objects, Domain Events, Repository Contracts
 ├── application/    # Use Cases, Command/Query Handlers, DTOs
 ├── infrastructure/ # External Services, DB Adapters (Drizzle), HTTP Clients (Axios)
 └── presentation/   # Your REST/GraphQL Controllers, Edge functions, or CLI
```

---

## 🗺️ Roadmap to v1.0.0

Gear5 is currently in Beta. I'm actively working on expanding its enterprise
capabilities to fully support distributed systems and complex domains.

- [ ] **Distributed CQRS:** Event-driven architecture support with **Kafka** and
      **RabbitMQ** bindings.
- [ ] **Transactional Outbox Pattern:** Guaranteed message delivery and reliable
      domain event dispatching.
- [ ] **Unit of Work (UoW):** Coordinated, atomic transaction management across
      repositories and message buses.
- [ ] **Event Sourcing Kernel:** Native support for Aggregate Roots, Event
      Streams, and Snapshots.

---

## 🤝 For Contributors

We welcome contributions to Gear5! To maintain the highest code quality and
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

## 🛡️ Powered by Gear5

If you are using Gear5 in your project, let the world know! Add this badge to
your README:

## 📄 License

Copyright (c) 2026 Mattia Carcione. Licensed under the [ISC License](LICENSE).
