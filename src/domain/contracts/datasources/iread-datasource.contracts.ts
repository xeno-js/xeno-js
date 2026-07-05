import type { Optional, UserContext } from '@/shared'

/**
 * @description Interface representing a data source for performing database operations. This interface defines the contract for executing SQL queries against a database, including methods for finding records based on filters and unique identifiers. The IReadDataSource interface is designed to be implemented by classes that provide specific data access logic, allowing for separation of concerns and easier testing.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IReadDataSource<TDto> {
  /**
   * Executes a SQL query and returns the result as an array of objects.
   * @param filter The filter criteria to apply when querying the database.
   * @param ctx The context of the authenticated user, which may be used for authorization and auditing purposes.
   * @param signal An optional AbortSignal to allow cancellation of the query operation.
   * @returns A promise that resolves to an array of objects representing the rows returned by the query.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  find(filters: unknown, ctx: UserContext, signal: Optional<AbortSignal>): Promise<TDto[]>

  /**
   * Executes a SQL query and returns the result as an array of objects.
   * @param id The unique identifier of the entity to retrieve.
   * @param ctx The context of the authenticated user, which may be used for authorization and auditing purposes.
   * @param signal An optional AbortSignal to allow cancellation of the query operation.
   * @returns A promise that resolves to an object representing the row returned by the query.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  findById(
    id: string | number,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<Optional<TDto>>
}
