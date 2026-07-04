import type { IModule, IServiceContainer } from '@/domain'
import { Guards } from '@/shared'

import type { DbConfig } from './config/db.config'

/**
 * @description The DbModule class is responsible for configuring the database module within the application. It implements the IModule interface, allowing it to be integrated into the application's dependency injection system. The configure method registers a singleton factory for creating an IDbClient instance using the provided configuration options. This design promotes modularity and allows for easy management of database connections and operations throughout the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class DbModule implements IModule<DbConfig> {
  async configure(container: IServiceContainer, opts: DbConfig): Promise<void> {
    const { INJECTION_TOKENS } = await import('../di/injection-tokens.constants')

    const { DbClientFactory } = await import('../factories/db-client.factory')
    container.addSingletonFactory(INJECTION_TOKENS.DB_POOL_CLIENT, () => {
      return new DbClientFactory().create(opts)
    })

    if (!opts.useOnlyPoolClient) {
      const { DrizzleOrmClient } = await import('../db/drizzle.client')
      container.addSingletonFactory(INJECTION_TOKENS.DB_ORM_CLIENT, () => {
        const pool = new DbClientFactory().create(opts)
        if (!Guards.isDefined(opts.tables))
          throw new Error(
            'DbModule: tables configuration is required when useOnlyPoolClient is false.',
          )
        return new DrizzleOrmClient(pool, opts.tables)
      })
    }
  }
}
