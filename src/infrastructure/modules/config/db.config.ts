import type { Dictionary } from '@/shared'

/**
 * @description Configuration options for the Database Module.
 * Contains the connection string for PostgreSQL and a dictionary mapping schema names to Drizzle PgTable definitions.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface DbConfig {
  /** @description The connection string used to connect to the PostgreSQL database. This should include the necessary credentials and connection details (e.g., host, port, database name, username, password) required for establishing a connection to the database.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  connectionString: string
  /** @description A dictionary mapping schema names to their corresponding Drizzle PgTable definitions. This allows the application to reference database tables using schema names, facilitating database operations such as queries, inserts, updates, and deletes through the Drizzle ORM. Each entry in the dictionary should have a unique schema name as the key and a PgTable definition as the value.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  tables: Dictionary<unknown>
}
