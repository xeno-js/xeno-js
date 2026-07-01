import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import type { IDbClient, IFactory } from '@/domain'

import { DrizzleDbClient } from '../db/drizzle.client'
import type { DbConfig } from '../modules/config/db.config'

/**
 * @description Factory class responsible for creating instances of IDbClient based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the IDbClient, including the initialization of the underlying database client with the specified configuration options such as connection string and table mappings. This design promotes separation of concerns and allows for flexibility in managing IDbClient instances across the application.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export class DbClientFactory implements IFactory<DbConfig, IDbClient> {
  public create(opts: DbConfig): IDbClient {
    const pool = new Pool({
      connectionString: opts.connectionString,
    })

    const db = drizzle({ client: pool })
    return new DrizzleDbClient(db, opts.tables)
  }
}
