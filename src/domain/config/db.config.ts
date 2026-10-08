import type { ITransactionalDb } from '../contracts'

/**
 * @description Options for configuring the database module.
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface DbModuleOptions<TDb extends ITransactionalDb<Ttx>, Ttx = unknown> {
  /** The database client to use. */
  readonly client: TDb
}
