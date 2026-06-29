# Create Graviton5 Project

The `packages/create-graviton5` package contains the scaffolding CLI for new
Graviton5 projects.

## Package Metadata

- package name: `@graviton5/create`
- bin: `create-graviton5`
- compiled entrypoint: `dist/index.js`
- source: `packages/create-graviton5/src/index.ts`

## Syntax

```bash
create-graviton5 [targetDir] [mode]
```

Arguments:

- `targetDir`: project folder name or path. Default: `my-graviton5-app`.
- `mode`: optional. Supported values: `empty`, `complete`.

If `mode` is not provided, the CLI interactively asks which modules to install.

## Empty Mode

```bash
create-graviton5 my-app empty
```

Generates a minimal app with:

- `@graviton5`
- `zod`
- `typescript`
- `tsx`
- `@types/node`
- `src/bootstrap.ts`
- `src/main.ts`

This mode is useful when you want to add infrastructure manually.

## Complete Mode

```bash
create-graviton5 my-app complete
```

Enables every option:

- database with Drizzle, PostgreSQL drivers, and `dotenv`
- HTTP with Axios and Cockatiel
- Supabase auth
- logging with Pino
- Sentry
- Redis with ioredis

The generated project also includes database scripts:

```json
{
  "db:generate": "drizzle-kit generate",
  "db:push": "drizzle-kit push",
  "db:migrate": "drizzle-kit migrate"
}
```

## Interactive Mode

```bash
create-graviton5 my-app
```

The CLI asks for confirmation for:

- Drizzle ORM and PostgreSQL drivers
- Axios and Cockatiel
- Supabase for authentication
- Pino for logging
- Sentry for error tracking
- ioredis for cache and idempotency

If you cancel the prompt, scaffolding exits with status code `1`.

## Generated Files

The CLI always creates:

```text
package.json
tsconfig.json
.gitignore
.env.example
README.md
src/bootstrap.ts
src/main.ts
```

With the database option, it also creates:

```text
drizzle.config.ts
src/schema.ts
```

## Automatic Install

At the end of scaffolding, the CLI runs:

```bash
npm install
```

If installation fails, the project remains generated and you can rerun
installation manually from the app folder.
