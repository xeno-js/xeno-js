# Filter Builder

Graviton5 criteria are framework-level objects. Drizzle expects SQL expressions
and selected fields. `IFilterBuilder` is the adapter between those two worlds.

The framework does not ship one universal Drizzle filter builder because every
application has different column names, allowed filters, projections, and
soft-delete rules. You implement a builder per table or per aggregate.

## Contract

```ts
import type { IFilterBuilder } from '@graviton5'

export interface IFilterBuilder<
  TQueryConditions = unknown,
  TQueryProjections = unknown,
> {
  buildFindCriteria(filter: unknown): TQueryConditions
  buildQueryCriteria(
    filter: unknown,
    params?: Record<string, unknown>,
  ): TQueryConditions
  buildDeleteCriteria(filter: unknown): TQueryConditions
  buildUpdateCriteria(filter: unknown): TQueryConditions
  buildProjections(cols: string[] | undefined): TQueryProjections
}
```

For Drizzle/PostgreSQL, `TQueryConditions` is usually `SQL` and
`TQueryProjections` is usually `SelectedFields`.

## Criteria Types

Read flows use `ReadCriteria`:

```ts
const criteria = {
  where: [{ field: 'email', operator: 'eq', value: 'alice@example.com' }],
  limit: null,
  offset: null,
  orderBy: null,
  cols: ['id', 'email'],
}
```

Write flows use `WriteCriteria`:

```ts
const criteria = {
  where: [{ field: 'id', operator: 'eq', value: 'user-1' }],
  relationsToLoad: undefined,
}
```

The supported operators in Graviton5 criteria are:

- `eq`
- `neq`
- `gt`
- `lt`
- `in`

## Example Drizzle Filter Builder

This example keeps the implementation explicit. It maps only fields your
application allows, which prevents accidentally exposing arbitrary columns
through API input.

```ts
import type { IFilterBuilder, ReadCriteria, WriteCriteria } from '@graviton5'
import { and, eq, gt, inArray, lt, ne, type SQL } from 'drizzle-orm'
import type { AnyPgColumn, SelectedFields } from 'drizzle-orm/pg-core'

import { usersTable } from '../schema.js'

type Criteria = ReadCriteria | WriteCriteria

const columns = {
  id: usersTable.id,
  name: usersTable.name,
  email: usersTable.email,
  isDeleted: usersTable.isDeleted,
  createdAt: usersTable.createdAt,
} satisfies Record<string, AnyPgColumn>

export class UserFilterBuilder implements IFilterBuilder<SQL, SelectedFields> {
  buildFindCriteria(filter: unknown): SQL {
    return this.buildWhere(filter as Criteria)
  }

  buildQueryCriteria(filter: unknown, params?: Record<string, unknown>): SQL {
    const criteria = filter as Partial<ReadCriteria>
    const where = [...(criteria.where ?? [])]

    if (params?.id !== undefined) {
      where.push({ field: 'id', operator: 'eq', value: params.id })
    }

    return this.buildWhere({ ...criteria, where })
  }

  buildDeleteCriteria(filter: unknown): SQL {
    const dto = filter as { id?: string | number }

    if (dto.id === undefined) {
      throw new Error('User delete requires an id.')
    }

    return eq(usersTable.id, Number(dto.id))
  }

  buildUpdateCriteria(filter: unknown): SQL {
    return this.buildWhere(filter as WriteCriteria)
  }

  buildProjections(cols: string[] | undefined): SelectedFields {
    if (cols === undefined || cols.length === 0) {
      return undefined as unknown as SelectedFields
    }

    return cols.reduce<SelectedFields>((projection, col) => {
      const column = columns[col]

      if (column === undefined) {
        throw new Error(`Unsupported projection column: ${col}`)
      }

      return { ...projection, [col]: column }
    }, {})
  }

  private buildWhere(criteria: Criteria): SQL {
    const conditions = criteria.where
      .filter(
        (item): item is NonNullable<typeof item> =>
          item !== null && item !== undefined,
      )
      .map((item) => {
        const column = columns[item.field]

        if (column === undefined) {
          throw new Error(`Unsupported filter field: ${item.field}`)
        }

        switch (item.operator) {
          case 'eq':
            return eq(column, item.value)
          case 'neq':
            return ne(column, item.value)
          case 'gt':
            return gt(column, item.value)
          case 'lt':
            return lt(column, item.value)
          case 'in':
            return inArray(column, item.value as unknown[])
        }
      })

    return and(...conditions) as SQL
  }
}
```

## Soft Delete Filtering

If a table uses soft deletes, decide whether normal reads should hide deleted
rows. A common approach is to append `isDeleted = false` in `buildFindCriteria`
and `buildQueryCriteria`.

```ts
buildFindCriteria(filter: unknown): SQL {
  const criteria = filter as ReadCriteria

  return this.buildWhere({
    ...criteria,
    where: [
      ...(criteria.where ?? []),
      { field: 'isDeleted', operator: 'eq', value: false },
    ],
  })
}
```

Keep admin or recovery flows separate if they need to read deleted rows.

## Update and Delete Must Be Specific

`DrizzleDbClient` refuses update and delete operations without conditions. Your
filter builder should enforce the same idea at the application boundary:

```ts
buildUpdateCriteria(filter: unknown): SQL {
  const criteria = filter as WriteCriteria

  if (criteria.where.length === 0) {
    throw new Error('Update requires at least one where condition.')
  }

  return this.buildWhere(criteria)
}
```

This makes failures clear before the request reaches the database client.
