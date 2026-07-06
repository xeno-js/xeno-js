import type { ITransactionState, IUnitOfWork } from '@/domain'
import { AppError } from '@/domain'
import type { Optional } from '@/shared'

import type { DbContext } from '../db/db.types'

/**
 * @file unit-of-work.ts
 * @description This file contains the implementation of the Unit of Work pattern.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class UnitOfWork implements IUnitOfWork {
  /**
   * Creates an instance of UnitOfWork.
   * @param _dbContext - The database context used for managing transactions.
   * @param _ttx - The transaction state, which can be either a specific transaction type or null.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  constructor(
    private readonly _dbContext: DbContext,
    private readonly _ttx: ITransactionState<DbContext>,
  ) {}

  async runInTransaction<T>(callback: () => Promise<T>, signal: Optional<AbortSignal>): Promise<T> {
    AppError.throwIfAborted(signal, 'UnitOfWork.runInTransaction')

    return this._dbContext.transaction(async (tx) => {
      this._ttx.state = tx
      try {
        const result = await callback()
        return result
      } finally {
        this._ttx.state = null
      }
    })
  }
}
