// ─── IPaginatedResult ─────────────────────────────────────────────────────────

/**
 * @description Standardised paginated response envelope returned by query handlers.
 *
 * Wraps the items array with cursor metadata so callers can navigate pages
 * without re-computing totals on every request.
 *
 * @template T  The type of each item in the page.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IPaginatedResult<T> {
  /**
   * @description Immutable slice of items for the requested page.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly items: readonly T[]

  /**
   * @description Total number of items matching the query across all pages.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly total: number

  /**
   * @description Current 1-based page index.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly page: number

  /**
   * @description Number of items per page used for this result.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly pageSize: number

  /**
   * @description Total number of pages given `total` and `pageSize`.
   * Computed as `Math.ceil(total / pageSize)`.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly totalPages: number

  /**
   * @description `true` when a next page exists (i.e. `page < totalPages`).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly hasNextPage: boolean

  /**
   * @description `true` when a previous page exists (i.e. `page > 1`).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly hasPreviousPage: boolean
}
