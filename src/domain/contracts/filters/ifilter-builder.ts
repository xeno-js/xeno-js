/**
 * Interface for building filter objects based on specifications.
 */
export interface IFilterBuilder<T> {
  /**
   * Builds a filter object based on the provided filter data.
   * @param filter The filter data to use for building the filter.
   * @returns A filter object that can be used in queries.
   */
  build<TFilter>(filter: TFilter): T
}
