import type { SQL } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { PgTable } from 'drizzle-orm/pg-core'

import type { IBaseDataSource, IFilterBuilder } from '@/domain'
import { AppError } from '@/domain'
import type { Dictionary, IPaginationParams, Maybe, Optional } from '@/shared'
import { Guards } from '@/shared'

/**
 * @description An abstract base class for DrizzleDataSource that provides common functionality for executing SQL queries against a PostgreSQL database using Drizzle ORM. This class includes methods for retrieving table schemas from a schema registry and executing queries with support for cancellation via AbortSignal. It serves as a foundation for concrete implementations of data sources that interact with specific tables and schemas in the database, allowing them to focus on implementing the specific data access logic while leveraging the common query execution logic provided by this base class.
 *
 * @template T - The type of the records that the data source will handle.
 * @template TFilter - The type of the filter that the data source will use.
 */
export class BaseDrizzleDataSource<T, TFilter = IPaginationParams> implements IBaseDataSource<
  T,
  TFilter
> {
  constructor(
    protected readonly _db: NodePgDatabase<Dictionary>,
    protected readonly _tableSchema: PgTable,
    protected readonly _filterBuilder: IFilterBuilder<SQL | undefined>,
  ) {}

  public async findById(id: string, signal: Optional<AbortSignal>): Promise<Maybe<T>> {
    const where = this._filterBuilder.build({ id })

    const results = await this.executeQuery(where, signal, 'findById')
    if (Guards.isNullOrEmpty(results)) return undefined

    return results[0]
  }

  public async find(filter: TFilter, signal: Optional<AbortSignal>): Promise<T[]> {
    const where = this._filterBuilder.build(filter)

    return await this.executeQuery(where, signal, 'find')
  }

  /**
   * @description Executes a SQL query against the database using the provided schema, where clause, and signal for cancellation. This method is a helper function that centralizes the logic for executing queries, allowing for consistent handling of query execution and cancellation across different types of queries (e.g., find, findById). It constructs a dynamic SQL query based on the provided schema and where clause, checks for cancellation using the provided signal, and then executes the query against the database. The results are returned as an array of type T.
   * @param schema - The PgTable schema to use for constructing the SQL query. This schema defines the structure of the table being queried.
   * @param where - An optional SQL where clause to filter the results of the query. This clause is used to specify conditions that must be met for records to be included in the results.
   * @param signal - An optional AbortSignal that can be used to cancel the query execution if needed. This allows for responsive cancellation of long-running queries, improving the user experience and resource management.
   * @param method - A string representing the name of the method that is executing the query (e.g., 'find', 'findById'). This is used for error handling and logging purposes to provide context about where the query execution is taking place.
   * @returns A promise that resolves to an array of type T, representing the results of the executed query.
   */
  protected async executeQuery(
    where: Optional<SQL>,
    signal: Optional<AbortSignal>,
    method: string,
  ): Promise<T[]> {
    let query = this._db.select().from(this._tableSchema).$dynamic()

    if (Guards.isDefined(where)) {
      query = query.where(where)
    }

    AppError.throwIfAborted(signal, `BaseDrizzleDataSource.${method}`)

    return (await query) as T[]
  }
}
