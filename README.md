# Anduril Blueprint Monorepo

Scaffolding enterprise orientato a sviluppo rapido di siti SMB, con separazione tra frontend e core.

## Struttura

- `app/`: frontend Vue + Vite
- `kernel/`: core blueprint DDD/Clean (solo struttura)
- `api/`: funzioni Edge per Vercel
- `supabase/functions/`: funzioni Edge per Supabase

## Setup

```bash
npm install
```

## Docker

File ambiente Docker preconfigurato:

```bash
cat .env.docker
```

Se vuoi rigenerarlo dall'esempio:

```bash
copy .env.docker.example .env.docker
```

Avvio ambiente sviluppo containerizzato:

```bash
npm run docker:dev
```

Arresto ambiente sviluppo:

```bash
npm run docker:dev:down
```

Avvio profilo produzione (build statica + nginx):

```bash
npm run docker:prod
```

Arresto profilo produzione:

```bash
npm run docker:prod:down
```

Servizi predisposti:

- `app-dev` (profilo `dev`): Vite dev server
- `app` (profilo `prod`): build frontend servita da nginx
- `postgres`: database PostgreSQL locale

## Husky Enterprise

Hook configurati:

- `pre-commit`: esegue `lint-staged` sui file staged (eslint + prettier)
- `commit-msg`: valida il messaggio commit con `commitlint` (conventional commits)
- `pre-push`: esegue `npm run verify:push` (typecheck, lint, test, build)

Formato commit consigliato:

```bash
feat(scope): descrizione
fix(scope): descrizione
chore(scope): descrizione
```

## ESLint + Prettier Enterprise

Policy configurata:

- ESLint separato per `app` (Vue + TypeScript) e per `api/kernel/supabase` (TypeScript)
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
- `app` include anche `build:ssg` per attivare Vite SSG quando verra cablato il bootstrap SSG.
- Il kernel e scaffoldato con la mappatura richiesta (shared + features template).
