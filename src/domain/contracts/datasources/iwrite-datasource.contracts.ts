import type { Optional, UserContext } from '@/shared'

/**
 * @description Interface representing a data source for performing database operations. This interface defines the contract for executing SQL queries and commands against a database, including methods for finding records based on filters and unique identifiers, as well as inserting and deleting records. The IWriteDataSource interface is designed to be implemented by classes that provide specific data access logic, allowing for separation of concerns and easier testing. It extends the IReadDataSource interface, which includes basic read operations, and adds methods for write operations such as insert and delete.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IWriteDataSource<TDto> {
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
  find(filter: unknown, ctx: UserContext, signal: Optional<AbortSignal>): Promise<TDto[]>

  /**
   * Executes a SQL query and returns the result as an array of objects.
   * @param id The unique identifier of the entity to find.
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

  /**
   * Executes a SQL command that does not return any rows (e.g., INSERT, UPDATE, DELETE).
   * @param dto The data transfer object containing the data to be inserted into the database.
   * @param signal An optional AbortSignal to allow cancellation of the insert operation.
   * @returns A promise that resolves when the command has been executed successfully.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  insert(dto: TDto, signal: Optional<AbortSignal>): Promise<void>

  /**
   * Executes a SQL command that does not return any rows (e.g., INSERT, UPDATE, DELETE).
   * @param dto The data transfer object containing the data to be deleted from the database.
   * @param ctx The context of the authenticated user, which may be used for authorization and auditing purposes.
   * @param signal An optional AbortSignal to allow cancellation of the delete operation.
   * @returns A promise that resolves when the command has been executed successfully.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  delete(dto: TDto, ctx: UserContext, signal: Optional<AbortSignal>): Promise<void>

  /**
   * Executes a SQL command that does not return any rows (e.g., INSERT, UPDATE, DELETE).
   * @param dto The data transfer object containing the data to be updated in the database.
   * @param ctx The context of the authenticated user, which may be used for authorization and auditing purposes.
   * @param signal An optional AbortSignal to allow cancellation of the update operation.
   * @returns A promise that resolves when the command has been executed successfully.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  update(
    id: string,
    dto: Partial<TDto>,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<void>
}
