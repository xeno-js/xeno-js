# Schema and Bootstrap

XenoJS needs two things to enable database access:

- a PostgreSQL connection string
- a table registry that maps logical table names to Drizzle table definitions

The table registry matters because XenoJS data sources pass table names as
strings. The registered `DrizzleDbClient` uses those names to find the actual
Drizzle `PgTable`.

Before wiring repositories and data sources, create a central `src/tokens.ts`
file for your application-level injection tokens. See
[Injection tokens](../dependency-injection/tokens.md) for the full pattern. The
short version is: use `TokenHelper.createToken<T>()` once, export the token, and
reuse it for both registration and resolution.

## Define a Drizzle Schema

The creator generates a basic `src/schema.ts`. A typical table looks like this:

```ts
import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

export type UserDto = typeof usersTable.$inferSelect
export type NewUserDto = typeof usersTable.$inferInsert
```

Use `$inferSelect` for records loaded from the database and `$inferInsert` for
insert payloads. If you use the same DTO for both read and write flows, make
sure optional/default fields are represented correctly in your mapper.

## Register the Database in `bootstrap.ts`

Import the table and register it through `AppBuilder.addDb`:

```ts
import 'dotenv/config'

import { AppBuilder } from '@xeno/core'

import { usersTable } from './schema.js'

export async function bootstrap() {
  const builder = new AppBuilder()

  builder.addDb((opts) => {
    opts.connectionString = process.env.DATABASE_URL ?? ''
    opts.tables = {
      users: usersTable,
    }
  })

  return await builder.build()
}
```

The key `users` is the logical table name. You will pass the same value to
`ReadDataSource`, `HardDeleteDataSource`, or `SoftDeleteDataSource`.

## Important Imports

Most database integrations start with these imports:

```ts
import 'dotenv/config'

import {
  AppBuilder,
  HardDeleteDataSource,
  INJECTION_TOKENS,
  ReadDataSource,
  Repository,
  SoftDeleteDataSource,
} from '@xeno/core'
```

You will usually import only the pieces you need. `AppBuilder` configures the
container. `INJECTION_TOKENS.DB_CLIENT` resolves the registered database client.
`ReadDataSource`, `HardDeleteDataSource`, and `SoftDeleteDataSource` are
reusable infrastructure adapters. `Repository` and `ReadDao` give you
higher-level persistence APIs. Use `TokenHelper` in `src/tokens.ts`, not
repeatedly inside each registration file.

## Resolve the Database Client

After `builder.build()`, the container can resolve the database client:

```ts
import { type IDbClient, INJECTION_TOKENS } from '@xeno/core'

const container = await bootstrap()
const dbClient = container.resolve<IDbClient>(INJECTION_TOKENS.DB_CLIENT)
```

Most applications should not use `IDbClient` directly outside infrastructure
composition. Prefer resolving repositories or DAOs from the container and
keeping the raw client behind data sources.

## Safety Behavior

`DrizzleDbClient.update` and `DrizzleDbClient.delete` require conditions. If a
datasource or filter builder returns `undefined` for update/delete criteria, the
client throws instead of performing a mass update or mass delete.

That safety rule means your `IFilterBuilder` should always return a condition
for `buildUpdateCriteria` and `buildDeleteCriteria`.
