import type { Optional, ReadCriteria } from '@/shared'

import type { ResultType } from '../../results/result.types'

/**
 * @description Interface representing a Data Access Object (DAO) for read operations. This interface defines the contract for retrieving data from a data source, such as a database or an API. It includes methods for finding an entity by its unique identifier and for finding multiple entities based on a filter. The IReadDao interface is designed to be implemented by classes that provide specific data access logic, allowing for separation of concerns and easier testing.
 */
export interface IReadDao<T> {
  /**
   * @description Finds an entity by its unique identifier. This method takes an ID and an optional AbortSignal for cancellation. It returns a promise that resolves to the entity if found, or null | undefined if not found. The implementation of this method is responsible for constructing the appropriate query based on the provided ID and handling any necessary data transformations before returning the result.
   * @param id The unique identifier of the entity to find.
   * @param criteria The criteria for querying the data, including filters, pagination, and sorting options.
   * @param signal An optional AbortSignal for cancellation.
   * @returns A promise that resolves to the entity if found, or null | undefined if not found.
   */
  findById(
    id: string,
    criteria: ReadCriteria,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<Optional<T>>>

  /**
   * @description Finds entities based on a filter. This method takes a filter object and an optional AbortSignal for cancellation. It returns a promise that resolves to an array of entities that match the filter criteria. The implementation of this method is responsible for constructing the appropriate query based on the provided filter and handling any necessary data transformations before returning the results.
   * @param criteria The criteria for querying the data, including filters, pagination, and sorting options.
   * @param signal An optional AbortSignal for cancellation.
   * @returns A promise that resolves to an array of entities that match the filter criteria.
   */
  find(criteria: ReadCriteria, signal: Optional<AbortSignal>): Promise<ResultType<T[]>>
}
