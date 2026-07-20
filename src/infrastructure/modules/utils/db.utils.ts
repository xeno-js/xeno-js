import type { DbConfig } from '@/domain'
import type { Dictionary } from '@/shared'

import type { DbContext } from '../../db/db.types'

/**
 * @description Utility functions for database operations, including the creation of database clients based on configuration options. These utilities provide a convenient way to initialize and manage database connections, supporting both SQLite and other database engines as specified in the configuration.
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export const DbUtils = Object.freeze({
  /**
   * @description Creates a new instance of a database client configured for SQLite using the provided database configuration options. This utility function encapsulates the logic for initializing a SQLite database client, allowing for easy integration with the application's dependency injection system. It ensures that the necessary connection string and other configuration parameters are correctly applied to create a functional database client instance.
   *
   * @param opts - The database configuration options, including the connection string and any other relevant settings required for establishing a connection to the SQLite database.
   * @returns A new instance of a database client configured for SQLite, ready for use in the application.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  async addSqlLite(opts: DbConfig): Promise<DbContext<Dictionary>> {
    const { DbSqlLiteClientFactory } = await import('../../factories/sql-light-db-client.factory')
    return new DbSqlLiteClientFactory().create(opts)
  },

  /**
   * @description Creates a new instance of a database client based on the provided database configuration options. This utility function encapsulates the logic for initializing a database client, allowing for easy integration with the application's dependency injection system. It ensures that the necessary connection string and other configuration parameters are correctly applied to create a functional database client instance.
   * @param opts - The database configuration options, including the connection string and any other relevant settings required for establishing a connection to the database.
   * @returns A new instance of a database client, ready for use in the application.
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  async addDbClient(opts: DbConfig): Promise<DbContext<Dictionary>> {
    const { DbClientFactory } = await import('../../factories/db-client.factory')
    return new DbClientFactory().create(opts)
  },
})
