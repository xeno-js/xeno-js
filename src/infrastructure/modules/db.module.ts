import type { IModule, IServiceContainer } from '@/domain'

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
    container.addScopedFactory(INJECTION_TOKENS.DB_CONTEXT, () => {
      return new DbClientFactory().create(opts)
    })
  }
}
