import type { ResultType } from '@/domain'
import type { Maybe } from '@/shared'

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
   * Finds an entity by its unique identifier.
   *
   * @param id - The unique identifier of the entity to find.
   * @returns A promise that resolves to the entity if found, or null | undefined if not found.
   */
  findById(id: string): Promise<Maybe<ResultType<T>>>

  /**
   * Retrieves all entities managed by the repository.
   *
   * @returns A promise that resolves to an array of entities.
   */
  findAll(): Promise<ResultType<T>[]>

  /**
   * Saves an entity to the repository.
   *
   * @param entity - The entity to save.
   * @returns A promise that resolves when the entity has been saved.
   */
  save(entity: T): Promise<ResultType<void>>

  /**
   * Deletes an entity from the repository by its unique identifier.
   *
   * @param id - The unique identifier of the entity to delete.
   * @returns A promise that resolves when the entity has been deleted.
   */
  delete(id: string): Promise<ResultType<void>>
}
