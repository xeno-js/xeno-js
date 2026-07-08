import type { Optional, UserContext } from '@/shared'

import type { ResultType } from '../../results/result.types'

/**
 * @fileoverview Defines the IRepository interface for generic data access operations.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */

/**
 * A generic repository interface for performing basic CRUD operations on entities of type T.
 *
 * @template T - The type of the entity that the repository will manage.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IRepository<T> {
  /**
   * @description Finds an entity by its unique identifier. This method takes an ID and an optional AbortSignal for cancellation. It returns a promise that resolves to the entity if found, or null | undefined if not found. The implementation of this method is responsible for constructing the appropriate query based on the provided ID and handling any necessary data transformations before returning the result.
   * @param id The unique identifier of the entity to find.
   * @param ctx The context of the authenticated user, which may be used for authorization and auditing purposes.
   * @param signal An optional AbortSignal for cancellation.
   * @returns A promise that resolves to the entity if found, or null | undefined if not found.
  
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
  ): Promise<ResultType<Optional<T>>>

  /**
   * @description Finds entities based on the user context. This method takes a user context and an optional AbortSignal for cancellation. It returns a promise that resolves to an array of entities that match the context. The implementation of this method is responsible for constructing the appropriate query based on the provided context and handling any necessary data transformations before returning the results.
   * @param ctx The context of the authenticated user, which may be used for authorization and auditing purposes.
   * @param signal An optional AbortSignal for cancellation.
   * @returns A promise that resolves to an array of entities that match the context.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  findAll(ctx: UserContext, signal: Optional<AbortSignal>): Promise<ResultType<T[]>>

  /**
   * @description Updates entities based on the user context. This method takes a user context and an optional AbortSignal for cancellation. It returns a promise that resolves when the update operation is complete.
   * @param id The unique identifier of the entity to update.
   * @param entity The partial entity object containing the data to be updated.
   * @param ctx The context of the authenticated user, which may be used for authorization and auditing purposes.
   * @param signal An optional AbortSignal for cancellation.
   * @returns A promise that resolves when the update operation is complete.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  update(
    id: string | number,
    entity: Partial<T>,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<void>>

  /**
   * @description Saves an entity to the repository. This method takes an entity object and an optional AbortSignal for cancellation. It returns a promise that resolves when the save operation is complete.
   * @param entity The entity object to save.
   * @param signal An optional AbortSignal to allow cancellation of the save operation.
   * @returns A promise that resolves when the entity has been saved.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  save(entity: T, signal: Optional<AbortSignal>): Promise<ResultType<void>>

  /**
   * Deletes an entity from the repository by its unique identifier.
   *
   * @param entity The entity to delete.
   * @param ctx The context of the authenticated user, which may be used for authorization and auditing purposes.
   * @param signal An optional AbortSignal to allow cancellation of the delete operation.
   * @returns A promise that resolves when the entity has been deleted.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  delete(entity: T, ctx: UserContext, signal: Optional<AbortSignal>): Promise<ResultType<void>>
}
