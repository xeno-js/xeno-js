import type { DbConfig, IModule, IServiceContainer } from '@/domain'

import type { DbContext, DbTransaction } from '../db/db.types'
import type { XenoRegistry } from '../xeno-registry'

/**
 * @description The DbModule class is responsible for configuring the database module within the application. It implements the IModule interface, allowing it to be integrated into the application's dependency injection system. The configure method registers a singleton factory for creating an IDbClient instance using the provided configuration options. This design promotes modularity and allows for easy management of database connections and operations throughout the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class DbModule<TRegistry extends XenoRegistry = XenoRegistry> implements IModule<
  TRegistry,
  DbConfig
> {
  async configure(container: IServiceContainer<TRegistry>, opts: DbConfig): Promise<void> {
    const { Guards, TOKENS } = await import('@/shared')

    const { DbUtils } = await import('./utils/db.utils')
    const db = opts.enableSqlLite ? await DbUtils.addSqlLite(opts) : await DbUtils.addDbClient(opts)

    const { TransactionState } = await import('../transaction/transaction-state')

    container.addScoped(TOKENS.TRANSACTION_STATE, () => {
      return new TransactionState<DbTransaction>()
    })

    const { UnitOfWork } = await import('../transaction/unit-of-work')
    container.addScoped(TOKENS.UNIT_OF_WORK, (c) => {
      const ttx = c.resolve(TOKENS.TRANSACTION_STATE)
      return new UnitOfWork(db, ttx)
    })

    container.addScoped(TOKENS.DB_CONTEXT, (c) => {
      const ttx = c.resolve(TOKENS.TRANSACTION_STATE)

      return new Proxy(db, {
        get(_target, prop, receiver) {
          const activeState = ttx.state
          if (Guards.isDefined(activeState)) {
            if (prop === 'transaction') {
              return activeState.transaction.bind(activeState)
            }
            return Reflect.get(activeState, prop, receiver) as DbContext
          }
          return Reflect.get(db, prop, receiver) as DbContext
        },
      })
    })
  }
}
