import type { Dictionary, Optional } from '@/shared'

/**
 * @description Configuration options for the Database Module.
 * Contains the connection string for PostgreSQL and a dictionary mapping schema names to Drizzle PgTable definitions.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface DbConfig {
  /** @description The connection string used to connect to the PostgreSQL database. This should include the necessary credentials and connection details (e.g., host, port, database name, username, password) required for establishing a connection to the database.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  connectionString: string
  /** @description A dictionary mapping schema names to their corresponding Drizzle PgTable definitions. This allows the application to reference database tables using schema names, facilitating database operations such as queries, inserts, updates, and deletes through the Drizzle ORM. Each entry in the dictionary should have a unique schema name as the key and a PgTable definition as the value.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  tables: Optional<Dictionary<unknown>>
  /** @description A boolean flag indicating whether to use only the database client without any additional features or configurations. When set to true, the application will utilize only the core database client for database operations, without any additional abstractions or enhancements provided by the Drizzle ORM or other layers. This can be useful in scenarios where a lightweight and direct interaction with the database is desired.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  useOnlyPoolClient: boolean
}
