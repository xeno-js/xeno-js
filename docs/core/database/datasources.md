# Data Sources

Gear5 data sources sit between the low-level `IDbClient` and your repositories.
They know which table they operate on and ask an `IFilterBuilder` to translate
criteria into database-specific query conditions.

The framework provides three database data sources:

- `ReadDataSource`
- `HardDeleteDataSource`
- `SoftDeleteDataSource`

## ReadDataSource

`ReadDataSource` is for query-only flows. It supports `find` and `findById`,
builds projections from `criteria.cols`, and calls `IDbClient.select` or
`IDbClient.selectOne`.

```ts
import {
  ReadDataSource,
  type IDbClient,
  type IFilterBuilder,
} from '@gear5/core'
import type { SQL } from 'drizzle-orm'
import type { SelectedFields } from 'drizzle-orm/pg-core'

import type { UserDto } from './schema.js'

export function createUserReadDataSource(
  dbClient: IDbClient<SQL, SelectedFields>,
  filterBuilder: IFilterBuilder<SQL, SelectedFields>,
) {
  return new ReadDataSource<UserDto, SQL, SelectedFields>(
    dbClient,
    filterBuilder,
    'users',
  )
}
```

Use the same table key that you registered in `addDb`: in this example, `users`.

## HardDeleteDataSource

`HardDeleteDataSource` performs physical deletes. Its `delete` method eventually
calls:

```ts
dbClient.delete(tableName, filter, signal)
```

Example:

```ts
import {
  HardDeleteDataSource,
  type IDbClient,
  type IFilterBuilder,
} from '@gear5/core'
import type { SQL } from 'drizzle-orm'

import type { UserDto } from './schema.js'

export function createUserWriteDataSource(
  dbClient: IDbClient<SQL>,
  filterBuilder: IFilterBuilder<SQL>,
) {
  return new HardDeleteDataSource<UserDto, SQL>(
    dbClient,
    'users',
    filterBuilder,
  )
}
```

Choose hard delete when deleting a record should remove it from the table.

## SoftDeleteDataSource

`SoftDeleteDataSource` does not remove the row. Its `delete` method calls:

```ts
dbClient.update(dto, tableName, filter, signal)
```

That means the DTO passed to `delete` must already contain the soft-delete
fields you want to persist, such as `isDeleted: true` and `deletedAt`.

```ts
import {
  SoftDeleteDataSource,
  type IDbClient,
  type IFilterBuilder,
} from '@gear5/core'
import type { SQL } from 'drizzle-orm'

import type { UserDto } from './schema.js'

export function createSoftDeleteUserDataSource(
  dbClient: IDbClient<SQL>,
  filterBuilder: IFilterBuilder<SQL>,
) {
  return new SoftDeleteDataSource<UserDto, SQL>(
    dbClient,
    'users',
    filterBuilder,
  )
}
```

For soft delete flows, a common pattern is to mark the domain entity as deleted
before calling repository `delete`, then let the mapper include those deletion
fields in the DTO.

```ts
user.markDeleted(new Date())
await usersRepository.delete(user, signal)
```

The mapper might produce:

```ts
{
  id: user.id,
  name: user.name,
  email: user.email,
  isDeleted: true,
  deletedAt: user.deletedAt,
}
```

`SoftDeleteDataSource` will build the delete criteria from that DTO and update
the row with the same DTO.

## Register a Data Source in the Container

Register data sources in `builder.addServices` after `addDb`:

```ts
import {
  HardDeleteDataSource,
  INJECTION_TOKENS,
  type IDbClient,
} from '@gear5/core'
import type { SQL } from 'drizzle-orm'

import { USER_FILTER_BUILDER, USER_WRITE_DATASOURCE } from './tokens.js'
import { UserFilterBuilder } from './users/user-filter-builder.js'
import type { UserDto } from './schema.js'

builder.addServices((services) => {
  services.addSingleton(USER_FILTER_BUILDER, UserFilterBuilder, [])

  services.addSingletonFactory(USER_WRITE_DATASOURCE, (container) => {
    const dbClient = container.resolve<IDbClient<SQL>>(
      INJECTION_TOKENS.DB_CLIENT,
    )
    const filter = container.resolve(USER_FILTER_BUILDER)

    return new HardDeleteDataSource<UserDto, SQL>(dbClient, 'users', filter)
  })
})
```

This example assumes `USER_FILTER_BUILDER` and `USER_WRITE_DATASOURCE` are
exported from `src/tokens.ts`. Keeping tokens there gives the application one
place to inspect the services that can be registered and resolved.
