import type { Dictionary, Optional } from '@/shared'

/**
 * @description Interface representing a filter object used for querying data. It defines the structure of the filter, which includes an optional array of where conditions and an optional array of join conditions. The where conditions specify the criteria for filtering data, while the join conditions specify any necessary table joins for the query. This interface is used in conjunction with filter builders to construct complex query filters based on specifications or DTOs.
 */
export interface IFilter {
  /**
   * @description An optional array of where conditions for filtering data. Each condition is represented as a dictionary, where the keys are the field names and the values are the corresponding filter values. The consuming repository is responsible for interpreting these conditions and applying them to the query.
   */
  readonly where: Optional<Dictionary[]>

  /**
   * @description An optional array of join conditions for the query. Each join condition is represented as a dictionary, where the keys are the table names and the values are the corresponding join criteria. The consuming repository is responsible for interpreting these join conditions and applying them to the query.
   */
  readonly joins: Optional<
    {
      condition: Dictionary
      type: 'inner' | 'left' | 'right'
    }[]
  >
}
