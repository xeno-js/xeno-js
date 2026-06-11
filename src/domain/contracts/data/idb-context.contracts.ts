import type { ResultType } from '@/domain'
import type { Optional } from '@/shared'

/**
 * An interface representing a context for managing transactions in a data access layer. This interface defines methods for beginning a transaction, committing it, and rolling it back in case of errors.
 */
export interface IDbContext {
  /**
   * Begins a new transaction. This method should be called before performing any operations that need to be part of the transaction.
   */
  beginTransaction(): Promise<void>

  /**
   * Commits the current transaction. This method should be called after all operations in the transaction have been successfully completed.
   */
  commitTransaction(): Promise<void>

  /**
   * Rolls back the current transaction. This method should be called if any operation in the transaction fails, to ensure that all changes made during the transaction are undone.
   */
  rollbackTransaction(): Promise<void>

  /**
   * Executes a given operation within a transaction. If the operation succeeds, the transaction is committed; if it fails, the transaction is rolled back.
   * @param operation A function that performs the operations to be executed within the transaction. It should return a promise that resolves to a result of type T.
   * @returns A promise that resolves to a ResultType containing the result of the operation, or an error if the operation fails.
   */
  runInTransaction<T>(
    operation: () => Promise<ResultType<T>>,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<T>>
}
