# Injection Tokens

An injection token is the stable key used by the Graviton5 service container to
register and resolve a dependency. Instead of resolving services by class name
or string literals scattered across the codebase, you create a token once and
use that token everywhere.

Graviton5 exposes framework tokens through `INJECTION_TOKENS`. For example, when
you call `builder.addDb(...)`, Graviton5 registers the database client under:

```ts
INJECTION_TOKENS.DB_CLIENT
```

Your application should do the same for repositories, data sources, mappers,
filter builders, handlers, clients, and services.

## Why Tokens Matter

Tokens give you three practical advantages:

- They make dependency registration explicit.
- They keep code decoupled from concrete implementations.
- They preserve TypeScript types when resolving services from the container.

For example, a repository can be registered behind a token typed as
`IRepository<User>`. The rest of the application depends on the repository
contract, not on the concrete `Repository<User, UserDto>` class.

## Create `src/tokens.ts`

Create one application-level token file and keep your custom tokens there:

```ts
import {
  HardDeleteDataSource,
  ReadDataSource,
  TokenHelper,
  type IFilterBuilder,
  type IMapper,
  type IReadDao,
  type IRepository,
} from '@graviton5/core'
import type { SQL } from 'drizzle-orm'
import type { SelectedFields } from 'drizzle-orm/pg-core'

import type { UserDto } from './schema.js'
import type { User } from './users/user.entity.js'

export const USER_FILTER_BUILDER = TokenHelper.createToken<
  IFilterBuilder<SQL, SelectedFields>
>('USER_FILTER_BUILDER')

export const USER_MAPPER =
  TokenHelper.createToken<IMapper<User, UserDto>>('USER_MAPPER')

export const USER_WRITE_DATASOURCE = TokenHelper.createToken<
  HardDeleteDataSource<UserDto, SQL>
>('USER_WRITE_DATASOURCE')

export const USER_READ_DATASOURCE = TokenHelper.createToken<
  ReadDataSource<UserDto, SQL, SelectedFields>
>('USER_READ_DATASOURCE')

export const USER_REPOSITORY =
  TokenHelper.createToken<IRepository<User>>('USER_REPOSITORY')

export const USER_READ_DAO =
  TokenHelper.createToken<IReadDao<User>>('USER_READ_DAO')
```

The token description string, such as `USER_REPOSITORY`, should be stable and
readable. It is mainly useful for diagnostics and debugging.

## Register with Tokens

Use the same tokens in `builder.addServices`:

```ts
import {
  HardDeleteDataSource,
  INJECTION_TOKENS,
  Repository,
  type IDbClient,
} from '@graviton5/core'
import type { SQL } from 'drizzle-orm'

import {
  USER_FILTER_BUILDER,
  USER_MAPPER,
  USER_REPOSITORY,
  USER_WRITE_DATASOURCE,
} from './tokens.js'
import { UserFilterBuilder } from './users/user-filter-builder.js'
import { UserMapper } from './users/user.mapper.js'

builder.addServices((services) => {
  services.addSingleton(USER_FILTER_BUILDER, UserFilterBuilder, [])
  services.addSingleton(USER_MAPPER, UserMapper, [])

  services.addSingletonFactory(USER_WRITE_DATASOURCE, (container) => {
    const dbClient = container.resolve<IDbClient<SQL>>(
      INJECTION_TOKENS.DB_CLIENT,
    )
    const filter = container.resolve(USER_FILTER_BUILDER)

    return new HardDeleteDataSource(dbClient, 'users', filter)
  })

  services.addSingletonFactory(USER_REPOSITORY, (container) => {
    const dataSource = container.resolve(USER_WRITE_DATASOURCE)
    const mapper = container.resolve(USER_MAPPER)

    return new Repository(dataSource, mapper)
  })
})
```

## Resolve with Tokens

After `builder.build()`, resolve application services by token:

```ts
const container = await bootstrap()
const usersRepository = container.resolve(USER_REPOSITORY)
```

This pattern scales well as your application grows. The token file becomes a
compact map of the application dependencies that are meant to be resolved from
the container.
