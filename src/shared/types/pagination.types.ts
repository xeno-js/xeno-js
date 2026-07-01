// ─── IPaginatedResult ─────────────────────────────────────────────────────────

/**
 * @description Standardised paginated response envelope returned by query handlers.
 *
 * Wraps the items array with cursor metadata so callers can navigate pages
 * without re-computing totals on every request.
 *
 * @template T  The type of each item in the page.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export interface IPaginatedResult<T> {
  /**
   * @description Immutable slice of items for the requested page.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly items: readonly T[]

  /**
   * @description Total number of items matching the query across all pages.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly total: number

  /**
   * @description Current 1-based page index.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly page: number

  /**
   * @description Number of items per page used for this result.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly pageSize: number

  /**
   * @description Total number of pages given `total` and `pageSize`.
   * Computed as `Math.ceil(total / pageSize)`.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly totalPages: number

  /**
   * @description `true` when a next page exists (i.e. `page < totalPages`).
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly hasNextPage: boolean

  /**
   * @description `true` when a previous page exists (i.e. `page > 1`).
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly hasPreviousPage: boolean
}
