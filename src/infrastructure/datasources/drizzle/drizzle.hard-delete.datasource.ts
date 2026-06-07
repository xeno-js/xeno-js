import type { SQL } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { PgTable } from 'drizzle-orm/pg-core'

import type { IFilterBuilder } from '@/domain'
import { AbstractDrizzleDataSource } from '@/infrastructure'
import type { Dictionary } from '@/shared'

/**
 * @description A class that implements the IDataSource interface using Drizzle ORM for PostgreSQL. This class provides methods to execute SQL queries for finding, inserting, and hard-deleting records in a PostgreSQL database. It uses a schema registry to manage table schemas and constructs SQL queries based on provided filters and data transfer objects (DTOs). The delete method in this class performs a hard delete by actually removing the record from the database instead of setting an "is_deleted" flag.
 *
 * @template T - The type of the records that the data source will handle.
 */
export class DrizzleHardDeleteDataSource<T> extends AbstractDrizzleDataSource<T> {
  /**
   * @description Constructs a new instance of the DrizzleHardDeleteDataSource class, which takes a NodePgDatabase instance and a schema registry as parameters. The database instance is used to execute SQL queries against the PostgreSQL database, while the schema registry is a mapping of table names to their corresponding PgTable schemas, which is essential for constructing valid SQL queries based on the structure of the database tables.
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

  protected async performDelete(where: SQL): Promise<void> {
    await this._db.delete(this._tableSchema).where(where)
  }
}
