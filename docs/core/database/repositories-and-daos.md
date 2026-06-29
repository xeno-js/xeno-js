# Repositories and DAOs

Graviton5 provides two higher-level persistence helpers:

- `Repository<T, TDto>` for write models and CRUD-style flows.
- `ReadDao<T, TDto>` for read models and query-only flows.

Both depend on a datasource and a mapper. The datasource talks to the database.
The mapper translates between domain entities and database DTOs.

## Mapper

Create an `IMapper` for each persisted model.

```ts
import type { IMapper } from '@graviton5/core'

import type { UserDto } from '../schema.js'
import { User } from './user.entity.js'

export class UserMapper implements IMapper<User, UserDto> {
  toDto(entity: User): UserDto {
    return {
      id: Number(entity.id),
      name: entity.name,
      email: entity.email,
      isDeleted: entity.isDeleted,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
    }
  }

  toEntity(dto: UserDto): User {
    return User.restore({
      id: String(dto.id),
      name: dto.name,
      email: dto.email,
      isDeleted: dto.isDeleted,
      deletedAt: dto.deletedAt,
      createdAt: dto.createdAt,
    })
  }

  toPartialDto(entity: Partial<User>): Partial<UserDto> {
    return {
      name: entity.name,
      email: entity.email,
      isDeleted: entity.isDeleted,
      deletedAt: entity.deletedAt,
    }
  }
}
```

The exact entity API is yours. Graviton5 only needs the mapper contract.

## Register a Repository

Register the mapper, datasource, and repository in `builder.addServices`.

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
} from '../tokens.js'
import type { UserDto } from '../schema.js'
import type { User } from './user.entity.js'
import { UserFilterBuilder } from './user-filter-builder.js'
import { UserMapper } from './user.mapper.js'

builder.addServices((services) => {
  services.addSingleton(USER_FILTER_BUILDER, UserFilterBuilder, [])
  services.addSingleton(USER_MAPPER, UserMapper, [])

  services.addSingletonFactory(USER_WRITE_DATASOURCE, (container) => {
    const dbClient = container.resolve<IDbClient<SQL>>(
      INJECTION_TOKENS.DB_CLIENT,
    )
    const filter = container.resolve(USER_FILTER_BUILDER)

    return new HardDeleteDataSource<UserDto, SQL>(dbClient, 'users', filter)
  })

  services.addSingletonFactory(USER_REPOSITORY, (container) => {
    const dataSource = container.resolve(USER_WRITE_DATASOURCE)
    const mapper = container.resolve(USER_MAPPER)

    return new Repository<User, UserDto>(dataSource, mapper)
  })
})
```

The tokens in this example should live in `src/tokens.ts`. That keeps
registration readable and prevents the same token from being accidentally
recreated in multiple files.

The repository now exposes:

```ts
await usersRepository.findById('1', signal)
await usersRepository.find(criteria, signal)
await usersRepository.save(user, signal)
await usersRepository.update(partialUser, criteria, signal)
await usersRepository.delete(user, signal)
```

Every method returns a Graviton5 `ResultType`, so application code should
inspect the result before reading the value.

```ts
const result = await usersRepository.findById('1', undefined)

if (!result.isOk()) {
  throw result.getErrorOrThrow()
}

const user = result.getValueOrThrow()
```

## Register a Read DAO

Use `ReadDao` when the model is read-only or optimized for queries.

```ts
import {
  INJECTION_TOKENS,
  ReadDao,
  ReadDataSource,
  type IDbClient,
  type IFilterBuilder,
} from '@graviton5/core'
import type { SQL } from 'drizzle-orm'
import type { SelectedFields } from 'drizzle-orm/pg-core'

import {
  USER_FILTER_BUILDER,
  USER_MAPPER,
  USER_READ_DAO,
  USER_READ_DATASOURCE,
} from '../tokens.js'
import type { UserDto } from '../schema.js'
import type { User } from './user.entity.js'

builder.addServices((services) => {
  services.addSingletonFactory(USER_READ_DATASOURCE, (container) => {
    const dbClient = container.resolve<IDbClient<SQL, SelectedFields>>(
      INJECTION_TOKENS.DB_CLIENT,
    )
    const filter =
      container.resolve<IFilterBuilder<SQL, SelectedFields>>(
        USER_FILTER_BUILDER,
      )

    return new ReadDataSource<UserDto, SQL, SelectedFields>(
      dbClient,
      filter,
      'users',
    )
  })

  services.addSingletonFactory(USER_READ_DAO, (container) => {
    const dataSource = container.resolve(USER_READ_DATASOURCE)
    const mapper = container.resolve(USER_MAPPER)

    return new ReadDao<User, UserDto>(dataSource, mapper)
  })
})
```

Example read criteria:

```ts
const criteria = {
  where: [{ field: 'email', operator: 'eq', value: 'alice@example.com' }],
  limit: null,
  offset: null,
  orderBy: null,
  cols: ['id', 'name', 'email'],
}

const result = await usersReadDao.find(criteria, undefined)
```

## Hard Delete vs Soft Delete in Repositories

The repository does not know whether delete means "remove the row" or "mark the
row as deleted". That behavior belongs to the datasource you register.

Use `HardDeleteDataSource` when:

- the row should disappear from the database
- audit or recovery is handled elsewhere
- the table does not have deletion state columns

Use `SoftDeleteDataSource` when:

- the table has fields like `isDeleted` or `deletedAt`
- reads should normally ignore deleted records
- recovery, audit, or history matters

With soft delete, remember that the datasource updates the row with the DTO
passed into `delete`. Mark the entity first:

```ts
const result = await usersRepository.findById('1', undefined)
const user = result.getValueOrThrow()

if (user !== undefined) {
  user.markDeleted(new Date())
  await usersRepository.delete(user, undefined)
}
```

That keeps the soft-delete decision explicit in the domain or application layer
while letting the infrastructure layer persist it consistently.
