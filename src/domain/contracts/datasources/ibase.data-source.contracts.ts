import type { IPaginationParams, Maybe, Optional } from '@/shared'

/**
 * @description Interface representing a data source for performing database operations. This interface defines the contract for executing SQL queries against a database, including methods for finding records based on filters and unique identifiers. The IBaseDataSource interface is designed to be implemented by classes that provide specific data access logic, allowing for separation of concerns and easier testing.
 */
export interface IBaseDataSource<T, TFilter = IPaginationParams> {
  /**
   * Executes a SQL query and returns the result as an array of objects.
   * @param filter The filter object used to filter the results of the query.
   * @param signal An optional AbortSignal to allow cancellation of the query operation.
   * @returns A promise that resolves to an array of objects representing the rows returned by the query.
   */
  find(filter: TFilter, signal: Optional<AbortSignal>): Promise<T[]>

  /**
   * Executes a SQL query and returns the result as an array of objects.
   * @param id The unique identifier of the entity to find.
   * @param signal An optional AbortSignal to allow cancellation of the query operation.
   * @returns A promise that resolves to an object representing the row returned by the query.
   */
  findById(id: string, signal: Optional<AbortSignal>): Promise<Maybe<T>>
}
