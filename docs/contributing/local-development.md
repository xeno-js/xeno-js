# Local Development

This guide is for developers working on the Graviton5 repository.

## Repository Install

From the repository root:

```bash
npm install
```

## Main Scripts

```bash
npm run build
npm run typecheck
npm run lint
npm run test
npm run check
```

`npm run check` runs typecheck, lint, and tests.

## Develop the Core

The root package is `@graviton5`. Public exports are defined in:

```text
src/index.ts
```

Before publishing:

```bash
npm run prepublishOnly
```

This command runs checks and builds the package.

## Develop the Creator

The creator lives in:

```text
packages/create-graviton5
```

Setup:

```bash
cd packages/create-graviton5
npm install
npm run build
```

Local execution:

```bash
node dist/index.js ../../demo/my-graviton5-app empty
```

Or in TypeScript development mode:

```bash
npm run dev -- ../../demo/my-graviton5-app empty
```

## Verify the Scaffold

After generating a project:

```bash
cd demo/my-graviton5-app
npm run dev
```

If you selected the database option:

```bash
npm run db:generate
npm run db:push
```

Make sure `DATABASE_URL` is configured in `.env` first.
