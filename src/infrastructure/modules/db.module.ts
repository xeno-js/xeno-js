import type { IModule, IServiceContainer, ITransactionState } from '@/domain'

import type { DbContext } from '../db/db.types'
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
    const { TokenHelper } = await import('@/shared')

    const { DbClientFactory } = await import('../factories/db-client.factory')
    const db = new DbClientFactory().create(opts)

    const { TransactionState } = await import('../transaction/transaction-state')
    const tokenState = TokenHelper.createToken<ITransactionState<DbContext>>('TransactionState')

    container.addScopedFactory(tokenState, () => {
      return new TransactionState<DbContext>(db)
    })

    const { UnitOfWork } = await import('../transaction/unit-of-work')
    container.addScopedFactory(INJECTION_TOKENS.UNIT_OF_WORK, (c) => {
      const ttx = c.resolve<ITransactionState<DbContext>>(tokenState)
      return new UnitOfWork(db, ttx)
    })

    container.addScopedFactory(INJECTION_TOKENS.DB_CONTEXT, (c) => {
      const ttx = c.resolve<ITransactionState<DbContext>>(tokenState)

      return new Proxy(db, {
        get(_target, prop, receiver) {
          if (prop === 'transaction') {
            return ttx.state?.transaction.bind(ttx.state)
          }

          return Reflect.get(ttx.state!, prop, receiver) as DbContext
        },
      })
    })
  }
}
