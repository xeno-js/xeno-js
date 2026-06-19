import type { IDbClient, IFilterBuilder } from '@/domain'
import type { Optional } from '@/shared'

import { AbstractWriteDataSource } from './abstract-write.datasource'

/**
 * @description A class that implements the IDataSource interface using Drizzle ORM for PostgreSQL. This class provides methods to execute SQL queries for finding, inserting, and soft-deleting records in a PostgreSQL database. It uses a schema registry to manage table schemas and constructs SQL queries based on provided filters and data transfer objects (DTOs). The delete method in this class performs a soft delete by setting an "is_deleted" flag instead of actually removing the record from the database.
 *
 * @template T - The type of the records that the data source will handle.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class SoftDeleteDataSource<
  Dto extends object,
  Filter = unknown,
> extends AbstractWriteDataSource<Dto, Filter> {
  /**
   * @description Constructs a new instance of the SoftDeleteDataSource class, which takes a NodePgDatabase instance and a schema registry as parameters. The database instance is used to execute SQL queries against the PostgreSQL database, while the schema registry is a mapping of table names to their corresponding PgTable schemas, which is essential for constructing valid SQL queries based on the structure of the database tables.
   * @param _db - A ORM instance that provides methods for executing SQL queries against a PostgreSQL database. This instance is used by the data source to perform database operations such as finding, inserting, and soft-deleting records.
   * @param _schemaRegistry - A record that maps table names (strings) to their corresponding schemas. This registry is crucial for the data source to understand the structure of the database tables it interacts with, allowing it to construct valid SQL queries based on the defined schemas. The schema registry helps ensure that the data source can correctly reference columns and tables when building queries, and it also provides a layer of abstraction that allows for easier maintenance and updates to the database schema without needing to change the core logic of the data source.
  
   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  constructor(dbClient: IDbClient<Filter>, tableName: string, filter: IFilterBuilder<Filter>) {
    super(dbClient, tableName, filter)
  }

  protected async performDelete(
    dto: Dto,
    filter: Optional<Filter>,
    signal: Optional<AbortSignal>,
  ): Promise<void> {
    await this._dbClient.update(dto, this._tableName, filter, signal)
  }
}
