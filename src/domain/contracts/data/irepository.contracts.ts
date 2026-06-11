import type { ResultType } from '@/domain'
import type { IFilter, Maybe, Optional } from '@/shared'

/**
 * @fileoverview Defines the IRepository interface for generic data access operations.
 */

/**
 * A generic repository interface for performing basic CRUD operations on entities of type T.
 *
 * @template T - The type of the entity that the repository will manage.
 */
export interface IRepository<T> {
  /**
   * @description Finds an entity by its unique identifier. This method takes an ID and an optional AbortSignal for cancellation. It returns a promise that resolves to the entity if found, or null | undefined if not found. The implementation of this method is responsible for constructing the appropriate query based on the provided ID and handling any necessary data transformations before returning the result.
   * @param id The unique identifier of the entity to find.
   * @param signal An optional AbortSignal for cancellation.
   * @returns A promise that resolves to the entity if found, or null | undefined if not found.
   */
  findById(id: string, signal: Optional<AbortSignal>): Promise<ResultType<Maybe<T>>>

  /**
   * @description Finds entities based on a filter. This method takes a filter object and an optional AbortSignal for cancellation. It returns a promise that resolves to an array of entities that match the filter criteria. The implementation of this method is responsible for constructing the appropriate query based on the provided filter and handling any necessary data transformations before returning the results.
   * @param filter The filter object to use for querying entities.
   * @param signal An optional AbortSignal for cancellation.
   * @returns A promise that resolves to an array of entities that match the filter criteria.
   */
  find(filter: IFilter, signal: Optional<AbortSignal>): Promise<ResultType<T[]>>

  /**
   * Saves an entity to the repository.
   *
   * @param entity - The entity to save.
   * @param signal An optional AbortSignal to allow cancellation of the save operation.
   * @returns A promise that resolves when the entity has been saved.
   */
  save(entity: T, signal: Optional<AbortSignal>): Promise<ResultType<void>>

  /**
   * Deletes an entity from the repository by its unique identifier.
   *
   * @param entity - The entity to delete.
   * @param signal An optional AbortSignal to allow cancellation of the delete operation.
   * @returns A promise that resolves when the entity has been deleted.
   */
  delete(entity: T, signal: Optional<AbortSignal>): Promise<ResultType<void>>
}
