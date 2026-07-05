import type { Optional } from '@/shared'

/**
 * @file unit-of-work.types.ts
 * @description This file contains the interface for the Unit of Work pattern.
 * @version 1.0.0
 * @author Your Name
 */
export interface IUnitOfWork {
  /**
   * Executes a callback function within a transaction.
   * @param callback The callback function to execute.
   * @returns A promise that resolves with the result of the callback function.
   */
  runInTransaction<T>(callback: () => Promise<T>, signal: Optional<AbortSignal>): Promise<T>
}
