import type { Optional } from '@/shared'

/**
 * @description This file defines the IDbClient interface, which serves as an abstraction layer for database operations within the application. The IDbClient interface specifies methods for executing common database queries, including selecting multiple records, selecting a single record, inserting new records, updating existing records, and deleting records. Each method accepts a SQL query string and an optional array of parameters to safely parameterize the queries and prevent SQL injection attacks. By defining this interface, the application can implement various database clients (e.g., PostgreSQL, MySQL, SQLite) that adhere to this contract, allowing for flexibility and ease of maintenance when interacting with different database systems.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface IDbClient<TQueryConditions = unknown, TQueryProjections = unknown> {
  /**
   * Executes a SQL query that returns multiple rows of data.
   * @param schema The name of the table from which records will be selected.
   * @param conditions Optional conditions to safely parameterize the query, which can be used to filter results based on specific criteria.
   * @param signal An optional AbortSignal to allow cancellation of the query operation.
   * @returns A promise that resolves to an array of results.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  select<T>(
    schema: string,
    conditions: Optional<TQueryConditions>,
    projection: Optional<TQueryProjections>,
    signal: Optional<AbortSignal>,
  ): Promise<T[]>

  /**
   * Executes a SQL query that returns a single row of data.
   * @param schema The name of the table from which the record will be selected.
   * @param conditions Optional conditions to safely parameterize the query, which can be used to filter results based on specific criteria.
   * @param signal An optional AbortSignal to allow cancellation of the query operation.
   * @returns A promise that resolves to a single result or null if no result is found.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  selectOne<T>(
    schema: string,
    conditions: Optional<TQueryConditions>,
    projection: Optional<TQueryProjections>,
    signal: Optional<AbortSignal>,
  ): Promise<Optional<T>>

  /**
   * Executes a SQL query to insert new records into the database.
   * @param dto The data transfer object (DTO) representing the record to be inserted.
   * @param schema The name of the table into which records will be inserted.
   * @param conditions Optional conditions to safely parameterize the query, which can be used to filter results based on specific criteria.
   * @param signal An optional AbortSignal to allow cancellation of the insert operation.
   * @returns A promise that resolves when the operation is complete.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  insert<T extends object>(dto: T, schema: string, signal: Optional<AbortSignal>): Promise<void>

  /**
   * Executes a SQL query to update existing records in the database.
   * @param dto The data transfer object (DTO) representing the record to be updated, which may contain partial fields for updating.
   * @param schema The name of the table in which records will be updated.
   * @param conditions Optional conditions to safely parameterize the query, which can be used to filter results based on specific criteria.
   * @param signal An optional AbortSignal to allow cancellation of the update operation.
   * @returns A promise that resolves when the operation is complete.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  update<T>(
    dto: Partial<T>,
    schema: string,
    conditions: Optional<TQueryConditions>,
    signal: Optional<AbortSignal>,
  ): Promise<void>

  /**
   * Executes a SQL query to delete records from the database.
   * @param schema The name of the table from which records will be deleted.
   * @param conditions Optional conditions to safely parameterize the query, which can be used to filter results based on specific criteria.
   * @param signal An optional AbortSignal to allow cancellation of the delete operation.
   * @returns A promise that resolves when the operation is complete.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  delete(
    schema: string,
    conditions: Optional<TQueryConditions>,
    signal: Optional<AbortSignal>,
  ): Promise<void>
}
