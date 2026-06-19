import type { Maybe, Optional } from './common.types'

/**
 * @description Defines the structure of a filter used for querying data. This interface includes an optional array of where conditions, pagination parameters (limit and offset), and sorting options (orderBy). The IFilter interface is used to specify the criteria for retrieving data from a repository or data source, allowing for flexible querying based on various conditions.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
type FilterOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'in'

/**
 * @description Defines the structure of a where condition used in query filters. Each condition consists of a field name, an operator (e.g., equals, not equals, greater than, less than, in), and a value to compare against. This interface is used to build dynamic query criteria for filtering data in repositories or services.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
interface WhereCondition {
  /** The name of the field to apply the filter on. This should correspond to a property of the entity being queried.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  field: string
  /** The operator to use for the filter condition. This can be one of the following: 'eq' (equals), 'neq' (not equals), 'gt' (greater than), 'lt' (less than), or 'in' (value is in a list).
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  operator: FilterOperator
  /** The value to compare the field against. The type of this value can vary depending on the operator used (e.g., a single value for 'eq', an array of values for 'in').
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  value: unknown
}

/**
 * @description Defines the structure of read criteria used for querying data. This includes optional where conditions for filtering results, pagination parameters (limit and offset), and sorting options (orderBy). The ReadCriteria interface is used to specify the criteria for retrieving data from a repository or data source, allowing for flexible querying based on various conditions.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface ReadCriteria {
  /** An optional array of where conditions to filter the query results. Each condition specifies a field, an operator, and a value to compare against. If no conditions are provided, all records will be returned.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  where: Maybe<WhereCondition>[]
  /** An optional limit on the number of records to return. If not specified, there is no limit and all matching records will be returned.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  limit: Maybe<number>
  /** An optional offset for pagination, specifying the number of records to skip before starting to return results. If not specified, the query will start from the first record.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  offset: Maybe<number>
  /** An optional sorting option that specifies the field to sort by and the direction of sorting (ascending or descending). If not specified, the order of results is determined by the data source's default behavior.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  orderBy: Maybe<{ field: string; direction: 'asc' | 'desc' }>
  /** An optional array of column names to specify which columns to include in the result. If not specified, all columns will be included.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  cols: Optional<string[]>
}

/**
 * @description Defines the structure of write criteria used for updating or deleting data. This includes an array of where conditions to specify which records should be affected by the write operation, as well as an optional array of relations to load for the affected records. The WriteCriteria interface is used to specify the criteria for modifying data in a repository or data source, allowing for targeted updates or deletions based on specific conditions.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface WriteCriteria {
  /** An array of where conditions that specify which records should be affected by the write operation. Each condition includes a field, an operator, and a value to compare against. This allows for precise targeting of records to update or delete based on specific criteria.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  where: WhereCondition[]
  /** An optional array of relations to load for the affected records. This allows for eager loading of related entities when performing write operations.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  relationsToLoad: Maybe<string[]>
}
