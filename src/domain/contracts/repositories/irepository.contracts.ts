import type { Optional, WriteCriteria } from '@/shared'

import type { ResultType } from '../../results/result.types'

/**
 * @fileoverview Defines the IRepository interface for generic data access operations.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */

/**
 * A generic repository interface for performing basic CRUD operations on entities of type T.
 *
 * @template T - The type of the entity that the repository will manage.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export interface IRepository<T> {
  /**
   * @description Finds an entity by its unique identifier. This method takes an ID and an optional AbortSignal for cancellation. It returns a promise that resolves to the entity if found, or null | undefined if not found. The implementation of this method is responsible for constructing the appropriate query based on the provided ID and handling any necessary data transformations before returning the result.
   * @param id The unique identifier of the entity to find.
   * @param signal An optional AbortSignal for cancellation.
   * @returns A promise that resolves to the entity if found, or null | undefined if not found.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  findById(id: string, signal: Optional<AbortSignal>): Promise<ResultType<Optional<T>>>

  /**
   * @description Finds entities based on a write criteria. This method takes a write criteria object and an optional AbortSignal for cancellation. It returns a promise that resolves to an array of entities that match the criteria. The implementation of this method is responsible for constructing the appropriate query based on the provided criteria and handling any necessary data transformations before returning the results.
   * @param criteria The write criteria object to use for querying entities.
   * @param signal An optional AbortSignal for cancellation.
   * @returns A promise that resolves to an array of entities that match the criteria.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  find(criteria: WriteCriteria, signal: Optional<AbortSignal>): Promise<ResultType<T[]>>

  /**
   * @description Updates entities based on a write criteria. This method takes a write criteria object and an optional AbortSignal for cancellation. It returns a promise that resolves when the update operation is complete.
   * @param entity The partial entity object containing the data to be updated.
   * @param criteria The write criteria object to use for updating entities.
   * @param signal An optional AbortSignal for cancellation.
   * @returns A promise that resolves when the update operation is complete.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  update(
    entity: Partial<T>,
    criteria: WriteCriteria,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<void>>

  /**
   * @description Saves an entity to the repository. This method takes an entity object and an optional AbortSignal for cancellation. It returns a promise that resolves when the save operation is complete.
   * @param entity The entity object to save.
   * @param signal An optional AbortSignal to allow cancellation of the save operation.
   * @returns A promise that resolves when the entity has been saved.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  save(entity: T, signal: Optional<AbortSignal>): Promise<ResultType<void>>

  /**
   * Deletes an entity from the repository by its unique identifier.
   *
   * @param entity - The entity to delete.
   * @param signal An optional AbortSignal to allow cancellation of the delete operation.
   * @returns A promise that resolves when the entity has been deleted.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  delete(entity: T, signal: Optional<AbortSignal>): Promise<ResultType<void>>
}
