import type { Dictionary } from '@xeno-js/shared'

/**
 * @description Type definition for the database context used in the application.
 * Polymorphically handles both PostgreSQL and libSQL (SQLite/Turso) engines.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export type DbContext<TSchema extends Dictionary = Dictionary> =
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  | import('drizzle-orm/node-postgres').NodePgDatabase<TSchema>
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  | (import('drizzle-orm/libsql').LibSQLDatabase<TSchema> & {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      $client: import('@libsql/client/web').Client
    })

/**
 * @description Type definition for the transaction object used in the database context.
 * Polymorphically handles both PostgreSQL and libSQL (SQLite/Turso) engines.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export type DbTransaction = Parameters<Parameters<DbContext['transaction']>[0]>[0]
