import type { SQL } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { PgTable, SelectedFields } from 'drizzle-orm/pg-core'

import { AppError, type IDbClient } from '@/domain'
import type { Dictionary, Optional } from '@/shared'
import { Guards } from '@/shared'

/**
 * @description The DrizzleDbClient class is an implementation of the IDbClient interface that utilizes the Drizzle ORM to perform database operations. This class provides methods for selecting multiple records, selecting a single record, inserting new records, updating existing records, and deleting records from a PostgreSQL database. The DrizzleDbClient class abstracts away the complexities of interacting with the database directly, allowing for cleaner and more maintainable code when performing database operations. It also includes error handling to ensure that any issues during database interactions are properly managed and communicated.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export class DrizzleDbClient implements IDbClient<SQL, SelectedFields> {
  constructor(
    private readonly _db: NodePgDatabase<Dictionary<unknown>>,
    private readonly _tables: Dictionary<unknown>,
  ) {}

  public async select<T>(
    schema: string,
    conditions: Optional<SQL>,
    projection: Optional<SelectedFields>,
    signal: Optional<AbortSignal>,
  ): Promise<T[]> {
    AppError.throwIfAborted(signal, 'DrizzleDbClient.select')
    const query = this.createQuery(schema, conditions, projection)
    return (await query) as T[]
  }

  public async selectOne<T>(
    schema: string,
    conditions: Optional<SQL>,
    projection: Optional<SelectedFields>,
    signal: Optional<AbortSignal>,
  ): Promise<Optional<T>> {
    AppError.throwIfAborted(signal, 'DrizzleDbClient.selectOne')
    const query = this.createQuery(schema, conditions, projection)
    const result = (await query.limit(1)) as T[]
    return Guards.isNullOrEmpty(result) ? undefined : result[0]
  }

  public async insert<T extends object>(
    dto: T,
    schema: string,
    signal: Optional<AbortSignal>,
  ): Promise<void> {
    AppError.throwIfAborted(signal, 'DrizzleDbClient.insert')
    const table = this.getTable(schema)
    await this._db.insert(table).values(dto)
  }

  public async update<T>(
    dto: Partial<T>,
    schema: string,
    conditions: Optional<SQL>,
    signal: Optional<AbortSignal>,
  ): Promise<void> {
    AppError.throwIfAborted(signal, 'DrizzleDbClient.update')

    if (!Guards.isDefined(conditions)) {
      throw new Error('Update operations require conditions to prevent mass updates.')
    }

    const table = this.getTable(schema)

    await this._db.update(table).set(dto).where(conditions)
  }

  public async delete(
    schema: string,
    conditions: Optional<SQL>,
    signal: Optional<AbortSignal>,
  ): Promise<void> {
    AppError.throwIfAborted(signal, 'DrizzleDbClient.delete')

    if (!Guards.isDefined(conditions)) {
      throw new Error('Delete operations require conditions to prevent mass deletions.')
    }

    const table = this.getTable(schema)

    await this._db.delete(table).where(conditions)
  }

  private getTable(schemaName: string): PgTable {
    const table = this._tables[schemaName]

    if (!Guards.isDefined(table))
      throw new Error(`[DrizzleDbClient] Table schema '${schemaName}' not found in registry.`)

    return table as PgTable
  }

  private createQuery(
    schema: string,
    conditions: Optional<SQL>,
    projection: Optional<SelectedFields>,
  ) {
    const table = this.getTable(schema)

    let query = Guards.isDefined(projection)
      ? this._db.select(projection).from(table).$dynamic()
      : this._db.select().from(table).$dynamic()

    if (Guards.isDefined(conditions)) query = query.where(conditions)

    return query
  }
}
