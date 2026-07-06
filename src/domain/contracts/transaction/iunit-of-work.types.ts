import type { Optional } from '@/shared'

/**
 * @file unit-of-work.types.ts
 * @description This file contains the interface for the Unit of Work pattern.
 
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface IUnitOfWork {
  /**
   * Executes a callback function within a transaction.
   * @param callback The callback function to execute.
   * @param signal An optional AbortSignal to cancel the transaction.
   * @returns A promise that resolves with the result of the callback function.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  runInTransaction<T>(callback: () => Promise<T>, signal: Optional<AbortSignal>): Promise<T>
}
