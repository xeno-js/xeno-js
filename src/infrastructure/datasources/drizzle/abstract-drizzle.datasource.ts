import type { SQL } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { PgTable } from 'drizzle-orm/pg-core'

import type { IFilter, IFilterBuilder } from '@/domain'
import { AppError } from '@/domain'
import { BaseDrizzleDataSource } from '@/infrastructure'
import { type Dictionary, Guards, type Optional } from '@/shared'

/**
 * @description An abstract base class for DrizzleDataSource that provides common functionality for executing SQL queries against a PostgreSQL database using Drizzle ORM. This class includes methods for retrieving table schemas from a schema registry and executing queries with support for cancellation via AbortSignal. It serves as a foundation for concrete implementations of data sources that interact with specific tables and schemas in the database, allowing them to focus on implementing the specific data access logic while leveraging the common query execution logic provided by this base class.
 * @template T - The type of the records that the data source will handle.
 */
export abstract class AbstractDrizzleDataSource<T> extends BaseDrizzleDataSource<T, IFilter> {
  /**
   * @description Constructs a new instance of the AbstractDrizzleDataSource class, which takes a NodePgDatabase instance and a schema registry as parameters. The database instance is used to execute SQL queries against the PostgreSQL database, while the schema registry is a mapping of table names to their corresponding PgTable schemas, which is essential for constructing valid SQL queries based on the structure of the database tables.
   * @param _db - An instance of NodePgDatabase from Drizzle ORM, which provides methods for executing SQL queries against a PostgreSQL database. This instance is used throughout the class to perform database operations such as selecting, inserting, and updating records.
   * @param _schemaRegistry - A record that maps table names (strings) to their corresponding PgTable schemas. This registry is crucial for the data source to understand the structure of the database tables it interacts with, allowing it to construct valid SQL queries based on the defined schemas. The schema registry helps ensure that the data source can correctly reference columns and tables when building queries, and it also provides a layer of abstraction that allows for easier maintenance and updates to the database schema without needing to change the core logic of the data source.
   */
  constructor(
    db: NodePgDatabase<Dictionary>,
    tableSchema: PgTable,
    filterBuilder: IFilterBuilder<SQL | undefined>,
  ) {
    super(db, tableSchema, filterBuilder)
  }

  public async insert<TDto>(
    dto: TDto extends Dictionary ? TDto : never,
    signal: Optional<AbortSignal>,
  ): Promise<void> {
    AppError.throwIfAborted(signal, 'AbstractDrizzleDataSource.insert')

    await this._db.insert(this._tableSchema).values(dto)
  }

  public async delete<TDto>(
    dto: TDto extends Dictionary ? TDto : never,
    signal: Optional<AbortSignal>,
  ): Promise<void> {
    const where = this._filterBuilder.build(dto)
    if (!Guards.isDefined(where))
      throw new Error(
        'Unable to build delete query: no valid filter could be constructed from the provided DTO.',
      )

    AppError.throwIfAborted(signal, 'AbstractDrizzleDataSource.delete')

    await this.performDelete(where)
  }

  /**
   * @description The task method is an abstract method that must be implemented by subclasses of AbstractDrizzleDataSource. It is called within the delete method after the where clause has been built and the signal has been checked for abortion. The specific implementation of the task method will depend on whether the subclass is implementing a soft delete (e.g., setting an "is_deleted" flag) or a hard delete (e.g., actually removing the record from the database). By making this method abstract, we enforce that each concrete data source must provide its own logic for how deletions are handled, while still benefiting from the common logic for building filters and handling cancellation provided by the base class.
   */
  protected abstract performDelete(where: SQL): Promise<void>
}
