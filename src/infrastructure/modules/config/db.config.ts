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
}
