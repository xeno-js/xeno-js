import type { IUnitOfWork } from '@/domain'
import { AppError } from '@/domain'
import type { Optional } from '@/shared'

import type { DbContext } from '../db/db.types'

/**
 * @file unit-of-work.ts
 * @description This file contains the implementation of the Unit of Work pattern.
 * @version 1.0.0
 * @author Your Name
 */
export class UnitOfWork implements IUnitOfWork {
  constructor(private readonly _dbContext: DbContext) {}

  async runInTransaction<T>(callback: () => Promise<T>, signal: Optional<AbortSignal>): Promise<T> {
    AppError.throwIfAborted(signal, 'UnitOfWork.runInTransaction')

    return this._dbContext.transaction(async () => {
      const result = await callback()
      return result
    })
  }
}
