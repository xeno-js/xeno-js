import type { IFilter, IReadDao, ResultType } from '@/domain'
import type { Optional } from '@/shared'

/**
 * @fileoverview Defines the IRepository interface for generic data access operations.
 */

/**
 * A generic repository interface for performing basic CRUD operations on entities of type T.
 *
 * @template T - The type of the entity that the repository will manage.
 * @template TFilter - The type of the filter used for querying entities.
 */
export interface IRepository<T> extends IReadDao<T, IFilter> {
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
