import type { SQL } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { PgTable, SelectedFields } from 'drizzle-orm/pg-core'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Dictionary } from '@/shared'

import { DrizzleDbClient } from '../drizzle.client'

interface UserRow {
  id: string
  name: string
}

function createDynamicQuery<T>(rows: T[], limitedRows: T[] = rows) {
  const where = vi.fn()
  const limit = vi.fn().mockResolvedValue(limitedRows)

  const promise = Promise.resolve(rows)
  const query = {
    where,
    limit,
    then: promise.then.bind(promise),
  }

  where.mockReturnValue(query)

  return { query, where, limit }
}

function createSelectBuilder(query: unknown) {
  const dynamic = { $dynamic: vi.fn().mockReturnValue(query) }
  const from = vi.fn().mockReturnValue(dynamic)

  return { dynamic, from }
}

function makeSut(table: PgTable = {} as PgTable) {
  const select = vi.fn()
  const insertValues = vi.fn().mockResolvedValue(undefined)
  const insert = vi.fn().mockReturnValue({ values: insertValues })

  const updateWhere = vi.fn().mockResolvedValue(undefined)
  const updateSet = vi.fn().mockReturnValue({ where: updateWhere })
  const update = vi.fn().mockReturnValue({ set: updateSet })

  const deleteWhere = vi.fn().mockResolvedValue(undefined)
  const del = vi.fn().mockReturnValue({ where: deleteWhere })

  const db = {
    select,
    insert,
    update,
    delete: del,
  } as unknown as NodePgDatabase<Dictionary<never>>

  const client = new DrizzleDbClient(db, { users: table })

  return {
    client,
    mocks: {
      select,
      insert,
      insertValues,
      update,
      updateSet,
      updateWhere,
      del,
      deleteWhere,
    },
    table,
  }
}

describe('DrizzleDbClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('select uses projection and conditions when both are provided', async () => {
    const rows: UserRow[] = [{ id: '1', name: 'Alice' }]
    const projection = { id: {} } as unknown as SelectedFields
    const conditions = { eq: ['id', '1'] } as unknown as SQL
    const dynamicQuery = createDynamicQuery(rows)
    const selectBuilder = createSelectBuilder(dynamicQuery.query)

    const { client, mocks, table } = makeSut()
    mocks.select.mockReturnValueOnce({ from: selectBuilder.from })

    const result = await client.select<UserRow>('users', conditions, projection, undefined)

    expect(mocks.select).toHaveBeenCalledWith(projection)
    expect(selectBuilder.from).toHaveBeenCalledWith(table)
    expect(selectBuilder.dynamic.$dynamic).toHaveBeenCalledOnce()
    expect(dynamicQuery.where).toHaveBeenCalledWith(conditions)
    expect(result).toEqual(rows)
  })

  it('select works without projection and without conditions', async () => {
    const rows: UserRow[] = [{ id: '2', name: 'Bob' }]
    const dynamicQuery = createDynamicQuery(rows)
    const selectBuilder = createSelectBuilder(dynamicQuery.query)

    const { client, mocks, table } = makeSut()
    mocks.select.mockReturnValueOnce({ from: selectBuilder.from })

    const result = await client.select<UserRow>('users', undefined, undefined, undefined)

    expect(mocks.select).toHaveBeenCalledWith()
    expect(selectBuilder.from).toHaveBeenCalledWith(table)
    expect(dynamicQuery.where).not.toHaveBeenCalled()
    expect(result).toEqual(rows)
  })

  it('selectOne returns first element when query returns records', async () => {
    const rows: UserRow[] = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]
    const dynamicQuery = createDynamicQuery(rows, rows)
    const selectBuilder = createSelectBuilder(dynamicQuery.query)

    const { client, mocks } = makeSut()
    mocks.select.mockReturnValueOnce({ from: selectBuilder.from })

    const result = await client.selectOne<UserRow>('users', undefined, undefined, undefined)

    expect(dynamicQuery.limit).toHaveBeenCalledWith(1)
    expect(result).toEqual(rows[0])
  })

  it('selectOne returns undefined when query returns an empty list', async () => {
    const dynamicQuery = createDynamicQuery<UserRow>([], [])
    const selectBuilder = createSelectBuilder(dynamicQuery.query)

    const { client, mocks } = makeSut()
    mocks.select.mockReturnValueOnce({ from: selectBuilder.from })

    const result = await client.selectOne<UserRow>('users', undefined, undefined, undefined)

    expect(dynamicQuery.limit).toHaveBeenCalledWith(1)
    expect(result).toBeUndefined()
  })

  it('insert resolves and sends dto to db values', async () => {
    const dto = { id: '1', name: 'Alice' }
    const { client, mocks, table } = makeSut()

    await client.insert(dto, 'users', undefined)

    expect(mocks.insert).toHaveBeenCalledWith(table)
    expect(mocks.insertValues).toHaveBeenCalledWith(dto)
  })

  it('update throws when conditions are not provided', async () => {
    const { client, mocks } = makeSut()

    await expect(client.update({ name: 'Alice' }, 'users', undefined, undefined)).rejects.toThrow(
      'Update operations require conditions to prevent mass updates.',
    )
    expect(mocks.update).not.toHaveBeenCalled()
  })

  it('update resolves and sends set + where when conditions exist', async () => {
    const dto = { name: 'Alice' }
    const conditions = { eq: ['id', '1'] } as unknown as SQL
    const { client, mocks, table } = makeSut()

    await client.update(dto, 'users', conditions, undefined)

    expect(mocks.update).toHaveBeenCalledWith(table)
    expect(mocks.updateSet).toHaveBeenCalledWith(dto)
    expect(mocks.updateWhere).toHaveBeenCalledWith(conditions)
  })

  it('delete throws when conditions are not provided', async () => {
    const { client, mocks } = makeSut()

    await expect(client.delete('users', undefined, undefined)).rejects.toThrow(
      'Delete operations require conditions to prevent mass deletions.',
    )
    expect(mocks.del).not.toHaveBeenCalled()
  })

  it('delete resolves and applies where when conditions exist', async () => {
    const conditions = { eq: ['id', '1'] } as unknown as SQL
    const { client, mocks, table } = makeSut()

    await client.delete('users', conditions, undefined)

    expect(mocks.del).toHaveBeenCalledWith(table)
    expect(mocks.deleteWhere).toHaveBeenCalledWith(conditions)
  })

  it('throws schema registry error when table does not exist', async () => {
    const db = {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as NodePgDatabase<Dictionary<never>>

    const client = new DrizzleDbClient(db, {})

    await expect(client.select('missing', undefined, undefined, undefined)).rejects.toThrow(
      "[DrizzleDbClient] Table schema 'missing' not found in registry.",
    )
  })
})
