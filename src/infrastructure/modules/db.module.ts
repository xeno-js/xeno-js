import type {
  ApplicationRegistry,
  DbModuleOptions,
  IModule,
  IServiceContainer,
  ITransactionalDb,
} from '@/domain'

/**
 * @description The DbModule class is responsible for configuring the database module within the application. It implements the IModule interface, allowing it to be integrated into the application's dependency injection system. The configure method registers a singleton factory for creating an IDbClient instance using the provided configuration options. This design promotes modularity and allows for easy management of database connections and operations throughout the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export class DbModule<
  TRegistry extends ApplicationRegistry<DbContext, DbTransaction>,
  DbContext extends ITransactionalDb<DbTransaction>,
  DbTransaction = unknown,
> implements IModule<TRegistry, DbModuleOptions<DbContext, DbTransaction>> {
  async configure(
    container: IServiceContainer<TRegistry>,
    opts: DbModuleOptions<DbContext, DbTransaction>,
  ): Promise<void> {
    const { Guards, TOKENS } = await import('@xeno-js/shared')

    const db = opts.client

    const { TransactionState } = await import('../transaction/transaction-state')
    container.addScoped('TRANSACTION_STATE', () => {
      return new TransactionState<DbTransaction>()
    })

    const { UnitOfWork } = await import('../transaction/unit-of-work')
    container.addScoped(TOKENS.UNIT_OF_WORK, (c) => {
      const ttx = c.resolve('TRANSACTION_STATE')
      return new UnitOfWork(db, ttx)
    })

    container.addScoped(TOKENS.DB_CONTEXT, (c) => {
      const ttx = c.resolve('TRANSACTION_STATE')
      return new Proxy(db, {
        get(_target, prop, receiver) {
          const activeState = ttx.state
          if (Guards.isDefined(activeState)) {
            const value: unknown = Reflect.get(activeState as object, prop, receiver)
            if (Guards.isFunction(value)) {
              return value.bind(activeState)
            }
            return value
          }
          return Reflect.get(db, prop, receiver) as DbContext
        },
      })
    })
  }
}
