import { createClient } from '@libsql/client'
import type { DbConfig, IFactory } from '@xeno-js/shared'
import type { Dictionary } from '@xeno-js/shared'
import { drizzle } from 'drizzle-orm/libsql'

import type { DbContext } from '../db/db.types'

/**
 * @description Factory class responsible for creating instances of IDbClient based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the IDbClient, including the initialization of the underlying database client with the specified configuration options such as connection string and table mappings. This design promotes separation of concerns and allows for flexibility in managing IDbClient instances across the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class DbSqlLiteClientFactory implements IFactory<DbConfig, DbContext<Dictionary>> {
  public create(opts: DbConfig): DbContext<Dictionary> {
    const client = createClient({ url: opts.connectionString })
    return drizzle({ client })
  }
}
