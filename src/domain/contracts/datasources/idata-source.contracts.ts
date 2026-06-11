import type { IBaseDataSource } from '@/domain'
import type { IFilter, Optional } from '@/shared'

/**
 * @description Interface representing a data source for performing database operations. This interface defines the contract for executing SQL queries and commands against a database, including methods for finding records based on filters and unique identifiers, as well as inserting and deleting records. The IDataSource interface is designed to be implemented by classes that provide specific data access logic, allowing for separation of concerns and easier testing. It extends the IBaseDataSource interface, which includes basic read operations, and adds methods for write operations such as insert and delete.
 */
export interface IDataSource<T> extends IBaseDataSource<T, IFilter> {
  /**
   * Executes a SQL command that does not return any rows (e.g., INSERT, UPDATE, DELETE).
   * @param dto The data transfer object containing the data to be inserted into the database.
   * @param signal An optional AbortSignal to allow cancellation of the insert operation.
   * @returns A promise that resolves when the command has been executed successfully.
   */
  insert<TDto>(dto: TDto, signal: Optional<AbortSignal>): Promise<void>

  /**
   * Executes a SQL command that does not return any rows (e.g., INSERT, UPDATE, DELETE).
   * @param dto The data transfer object containing the data to be inserted into the database.
   * @param signal An optional AbortSignal to allow cancellation of the delete operation.
   * @returns A promise that resolves when the command has been executed successfully.
   */
  delete<TDto>(dto: TDto, signal: Optional<AbortSignal>): Promise<void>
}
