import type { Optional, ReadCriteria } from '@/shared'

/**
 * @description Interface representing a data source for performing database operations. This interface defines the contract for executing SQL queries against a database, including methods for finding records based on filters and unique identifiers. The IReadDataSource interface is designed to be implemented by classes that provide specific data access logic, allowing for separation of concerns and easier testing.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export interface IReadDataSource<TDto> {
  /**
   * Executes a SQL query and returns the result as an array of objects.
   * @param criteria The criteria for querying the data, including filters, pagination, and sorting options.
   * @param signal An optional AbortSignal to allow cancellation of the query operation.
   * @returns A promise that resolves to an array of objects representing the rows returned by the query.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  find(criteria: ReadCriteria, signal: Optional<AbortSignal>): Promise<TDto[]>

  /**
   * Executes a SQL query and returns the result as an array of objects.
   * @param criteria The criteria for querying the data, including filters, pagination, and sorting options.
   * @param signal An optional AbortSignal to allow cancellation of the query operation.
   * @returns A promise that resolves to an object representing the row returned by the query.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  findById(
    id: string,
    criteria: ReadCriteria,
    signal: Optional<AbortSignal>,
  ): Promise<Optional<TDto>>
}
