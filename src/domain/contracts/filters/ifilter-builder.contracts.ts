import type { Dictionary, Optional } from '@/shared'

/**
 * Interface for building filter objects based on specifications.
 */
export interface IFilterBuilder<TQueryConditions = unknown, TQueryProjections = unknown> {
  /**
   * Builds a filter object based on the provided filter data.
   * @param filter The filter data to use for building the filter.
   * @returns A filter object that can be used in queries.
   */
  buildFindCriteria<TFilter>(filter: TFilter): TQueryConditions
  /**
   * Builds a filter object for querying based on the provided filter data.
   * @param filter The filter data to use for building the query filter.
   * @returns A filter object that can be used in query operations.
   */
  buildQueryCriteria<TFilter>(filter: TFilter, params?: Dictionary<unknown>): TQueryConditions
  /**
   * Builds a filter object for delete operations based on the provided filter data.
   * @param filter The filter data to use for building the delete filter.
   * @returns A filter object that can be used in delete operations.
   */
  buildDeleteCriteria<TFilter>(filter: TFilter): TQueryConditions
  /**
   * Builds a filter object for update operations based on the provided filter data.
   * @param filter The filter data to use for building the update filter.
   * @returns A filter object that can be used in update operations.
   */
  buildUpdateCriteria<TFilter>(filter: TFilter): TQueryConditions

  /**
   * Builds a projections object based on the provided filter data.
   * @param cols An optional array of column names to specify which columns to include in the result.
   * @returns A projections object that can be used in query operations to specify which fields to return.
   */
  buildProjections(cols: Optional<string[]>): TQueryProjections
}
