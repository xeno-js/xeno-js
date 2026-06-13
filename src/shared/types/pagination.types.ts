// ─── IPaginatedResult ─────────────────────────────────────────────────────────

/**
 * @description Standardised paginated response envelope returned by query handlers.
 *
 * Wraps the items array with cursor metadata so callers can navigate pages
 * without re-computing totals on every request.
 *
 * @template T  The type of each item in the page.
 */
export interface IPaginatedResult<T> {
  /**
   * @description Immutable slice of items for the requested page.
   */
  readonly items: readonly T[]

  /**
   * @description Total number of items matching the query across all pages.
   */
  readonly total: number

  /**
   * @description Current 1-based page index.
   */
  readonly page: number

  /**
   * @description Number of items per page used for this result.
   */
  readonly pageSize: number

  /**
   * @description Total number of pages given `total` and `pageSize`.
   * Computed as `Math.ceil(total / pageSize)`.
   */
  readonly totalPages: number

  /**
   * @description `true` when a next page exists (i.e. `page < totalPages`).
   */
  readonly hasNextPage: boolean

  /**
   * @description `true` when a previous page exists (i.e. `page > 1`).
   */
  readonly hasPreviousPage: boolean
}
