import type { PgTable } from 'drizzle-orm/pg-core'

import type { Dictionary } from '@/shared'

/**
 * @description Configuration options for the Database Module.
 * Contains the connection string for PostgreSQL and a dictionary mapping schema names to Drizzle PgTable definitions.
 */
export interface DbConfig {
  /** @description The connection string used to connect to the PostgreSQL database. This should include the necessary credentials and connection details (e.g., host, port, database name, username, password) required for establishing a connection to the database. */
  connectionString: string
  /** @description A dictionary mapping schema names to their corresponding Drizzle PgTable definitions. This allows the application to reference database tables using schema names, facilitating database operations such as queries, inserts, updates, and deletes through the Drizzle ORM. Each entry in the dictionary should have a unique schema name as the key and a PgTable definition as the value. */
  tables: Dictionary<PgTable>
}
