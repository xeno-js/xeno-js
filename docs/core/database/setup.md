# Database Setup

The quickest way to start with database support is to scaffold the application
with the database option enabled. The creator asks whether you want to install
Drizzle ORM and PostgreSQL drivers. Answer `yes`.

## Interactive Scaffold

Run the creator without a mode:

```bash
npm exec @Gantry5/create@latest -- my-Gantry5-app
```

When prompted:

```text
Would you like to install Drizzle ORM and PostgreSQL drivers?
```

Select `yes`.

The creator installs:

```json
{
  "drizzle-orm": "^0.45.2",
  "pg": "^8.22.0",
  "postgres": "^3.4.9",
  "dotenv": "^16.4.5"
}
```

It also installs database dev tooling:

```json
{
  "drizzle-kit": "^0.31.10",
  "@types/pg": "^8.11.0"
}
```

## Complete Scaffold

If you want every optional module, including the database, use `complete`:

```bash
npm exec @Gantry5/create@latest -- my-Gantry5-app complete
```

## Generated Database Files

With the database option enabled, the generated project includes:

```text
drizzle.config.ts
src/schema.ts
.env.example
```

The generated `.env.example` includes:

```bash
DATABASE_URL=postgres://postgres:password@localhost:5432/Gantry5_db
```

Create your real `.env` file:

```bash
cp .env.example .env
```

Then update `DATABASE_URL` to point to your PostgreSQL instance.

## Generated Scripts

The creator adds these scripts to `package.json`:

```json
{
  "db:generate": "drizzle-kit generate",
  "db:push": "drizzle-kit push",
  "db:migrate": "drizzle-kit migrate"
}
```

Use them as you would in a normal Drizzle project:

```bash
npm run db:generate
npm run db:push
```
