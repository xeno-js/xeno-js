---
id: installation
sidebar_position: 2
---

# Installation

Xeno is an agnostic TypeScript core for applications based on DDD, Clean
Architecture, CQRS, and dependency injection. The fastest way to start is the
CLI in `cli/`, which generates a TypeScript project with `AppBuilder`,
`bootstrap.ts`, `main.ts`, `tsconfig.json`, `.env.example`, and the optional
dependencies you choose.

## Prerequisites

- Node.js `>=20.0.0`
- npm
- TypeScript, installed as a dev dependency by the generated project

## Create a New Project

Once `@xeno/create` is published, the recommended flow will be:

```bash
npm create @xeno@latest my-xeno-app
cd my-xeno-app
npm run dev
```

Alternatively, you can use `npm exec`:

```bash
npm exec @xeno/create@latest -- my-xeno-app
cd my-xeno-app
npm run dev
```

The CLI accepts the project name as the first argument. If you do not pass one,
it creates `my-xeno-app`.

## Available Modes

The second argument controls the scaffold type:

```bash
npm exec @xeno/create@latest -- my-xeno-app empty
```

`empty` generates the minimum project: `@xeno`, `zod`, TypeScript, `tsx`,
`bootstrap.ts`, and `main.ts`.

```bash
npm exec @xeno/create@latest -- my-xeno-app full
```

`full` enables all available modules: database, HTTP, Supabase auth, logging,
Sentry, and Redis.

Without a mode, the CLI enters interactive mode and asks which modules to
install.

## Local Usage From the Repository

While developing the monorepo, you can run the creator directly:

```bash
cd cli
npm install
npm run build
node dist/index.js ../../demo/my-xeno-app empty
```

To install the beta channel directly:

```bash
npm install @xeno@beta
```

## What Gets Generated

A scaffolded project contains:

```text
my-xeno-app/
  package.json
  tsconfig.json
  .gitignore
  .env.example
  README.md
  src/
    bootstrap.ts
    main.ts
```

If you enable the database option, these files are also added:

```text
drizzle.config.ts
src/schema.ts
```

## Start the App

After scaffolding:

```bash
cd my-xeno-app
npm run dev
```

The `dev` command runs:

```bash
tsx watch src/main.ts
```

The `start` command runs:

```bash
tsx src/main.ts
```

## First Bootstrap

The creator generates `src/bootstrap.ts` based on `AppBuilder`:

```ts
import { AppBuilder } from '@xeno/core'

export async function bootstrap() {
  const builder = new AppBuilder()

  return await builder.build()
}
```

You can enable modules incrementally:

```ts
import { AppBuilder, LOG_LEVEL } from '@xeno/core'

export async function bootstrap() {
  const builder = new AppBuilder()

  builder
    .addContext()
    .addMiddlewares()
    .addLogger((opts) => {
      opts.level = LOG_LEVEL.INFO
      opts.console = true
    })

  return await builder.build()
}
```

## Environment Configuration

The `.env.example` file is populated according to the selected options:

- `DATABASE_URL` when you enable Drizzle/PostgreSQL.
- `REDIS_URL` when you enable Redis.
- `SUPABASE_URL` and `SUPABASE_KEY` when you enable Supabase.
- `SENTRY_DSN` when you enable Sentry.

Copy `.env.example` to `.env` in the generated project and update the values
before connecting real services.
