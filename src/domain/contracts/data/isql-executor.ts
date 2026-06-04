import type { Dictionary } from '@/shared'

/**
 * Interface for executing SQL queries and commands.
 */
export interface ISqlExecutor<T> {
  /**
   * Executes a SQL query and returns the result as an array of objects.
   * @param query The SQL query to execute.
   * @param params An optional array of parameters to be used in the query.
   * @returns A promise that resolves to an array of objects representing the rows returned by the query.
   */
  find<TFilter>(filters: Dictionary<TFilter>): Promise<T[]>

  /**
   * Executes a SQL command that does not return any rows (e.g., INSERT, UPDATE, DELETE).
   * @param command The SQL command to execute.
   * @param params An optional array of parameters to be used in the command.
   * @returns A promise that resolves when the command has been executed successfully.
   */
  insert<TDto>(dto: TDto): Promise<void>
}
