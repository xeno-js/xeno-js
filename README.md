# @anduril/kernel

Core agnostico — DDD + Clean Architecture npm package.

## Struttura

```
src/
  application/    # use cases, command/query handlers
  domain/         # entities, value objects, domain events, repository contracts
  infrastructure/ # adapters, persistence, external services
  presentation/   # DI container, controllers, mappers
```

## Installazione

```bash
npm install @anduril/kernel
```

## Setup sviluppo

```bash
npm install
```

## Script

| Comando             | Descrizione                   |
| ------------------- | ----------------------------- |
| `npm run build`     | Compila TypeScript in `dist/` |
| `npm run typecheck` | Controllo tipi senza emit     |
| `npm run lint`      | ESLint su `src/`              |
| `npm run lint:fix`  | ESLint con autofix            |
| `npm run format`    | Prettier                      |
| `npm run check`     | typecheck + lint              |

## Dipendenze principali

- `inversify` — IoC container
- `mediatr-ts` — CQRS / Mediator
- `zod` — schema validation
- `drizzle-orm` — ORM agnostico
- `pino` — structured logging
- `cockatiel` — resilienza (retry, circuit breaker)
- `axios` — HTTP client

## Husky Enterprise

Hook configurati:

- `pre-commit`: esegue `lint-staged` sui file staged (eslint + prettier)
- `commit-msg`: valida il messaggio commit con `commitlint` (conventional
  commits)
- `pre-push`: esegue `npm run verify:push` (typecheck, lint, test, build)

Formato commit consigliato:

```bash
feat(scope): descrizione
fix(scope): descrizione
chore(scope): descrizione
```

## ESLint + Prettier Enterprise

Policy configurata:

- ESLint separato per `app` (Vue + TypeScript) e per `api/kernel/supabase`
  (TypeScript)
- Prettier centralizzato a livello root con override per markdown/yaml
- `lint-staged` con fix automatico su file staged
- bracket access con `[]` consentito
- `enum` consentiti

Comandi utili:

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Comandi principali

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run test:e2e:install
npm run test:e2e
npm run build
npm run check
```

## Note

- `app` include setup per Vitest + coverage e Playwright.
- `app` include anche `build:ssg` per attivare Vite SSG quando verra cablato il
  bootstrap SSG.
- Il kernel e scaffoldato con la mappatura richiesta (shared + features
  template).
