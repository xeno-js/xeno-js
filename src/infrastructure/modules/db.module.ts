import type { IModule, IServiceContainer } from '@/domain'
import type { Optional } from '@/shared'
import { Guards } from '@/shared'

import type { DbConfig } from './config/db.config'

/**
 * @description The DbModule class is responsible for configuring the database module within the application. It implements the IModule interface, allowing it to be integrated into the application's dependency injection system. The configure method checks if the database module is enabled and, if so, registers a singleton factory for creating an IDbClient instance using the provided configuration options. This design promotes modularity and allows for easy management of database connections and operations throughout the application.
 */
export class DbModule implements IModule<DbConfig> {
  async configure(container: IServiceContainer, opts: Optional<DbConfig>): Promise<void> {
    if (!Guards.isDefined(opts) || !opts.isEnabled) return

    const { INJECTION_TOKENS } = await import('../di/injection-tokens.constants')

    const { DbClientFactory } = await import('../factories/db-client.factory')
    container.addSingletonFactory(INJECTION_TOKENS.DB_CLIENT, () => {
      return new DbClientFactory().create(opts)
    })
  }
}
