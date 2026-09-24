import type { Dictionary } from '@xeno-js/shared'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'

import type { DbContext } from '../db'

/**
 * @description BaseSqliteSqlDataSource is an abstract class that serves as a foundation for creating data sources that interact with a SQLite / libSQL database.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export abstract class BaseSqliteSqlDataSource<TSchema extends Dictionary = Dictionary> {
  constructor(private readonly _db: DbContext<TSchema>) {}

  /**
   * @description Returns the SQLite database connection.
   * @returns {LibSQLDatabase<TSchema>} The database connection.
   */
  protected get db(): LibSQLDatabase<TSchema> {
    return this._db as LibSQLDatabase<TSchema>
  }
}
