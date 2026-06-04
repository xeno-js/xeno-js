import type { Dictionary, Optional } from '@/shared'

import type { SortDirection } from './index'

// ─── IPaginationParams ────────────────────────────────────────────────────────

/**
 * @description Standardised inbound pagination and sorting parameters.
 *
 * Passed through the Application layer from presentation controllers to query
 * handlers and repository methods. All fields are optional; defaults are
 * defined in `PaginationDefaults`.
 */
export interface IPaginationParams {
  /**
   * @description 1-based page index requested by the caller.
   * Defaults to `PaginationDefaults.PAGE` when omitted.
   * Capped to `PaginationDefaults.MAX_PAGE_SIZE` by the repository layer.
   */
  readonly page: Optional<number>

  /**
   * @description Maximum number of items to return per page.
   * Capped to `PaginationDefaults.MAX_PAGE_SIZE` by the repository layer.
   */
  readonly pageSize: Optional<number>

  /**
   * @description Name of the field to sort by.
   * When omitted, the repository applies its own default ordering.
   */
  readonly sortBy: Optional<string>

  /**
   * @description Sort direction: `'asc'` or `'desc'`.
   * Defaults to `SORT_DIRECTION.ASC` when omitted.
   */
  readonly sortDirection: Optional<SortDirection>

  /**
   * @description Arbitrary filter criteria passed as a typed record.
   * The consuming repository is responsible for mapping keys to columns.
   */
  readonly filters: Optional<Readonly<Dictionary<unknown>>>
}

// ─── IPaginatedResult ─────────────────────────────────────────────────────────

/**
 * @description Standardised paginated response envelope returned by query handlers.
 *
 * Wraps the data array with cursor metadata so callers can navigate pages
 * without re-computing totals on every request.
 *
 * @template T  The type of each item in the page.
 */
export interface IPaginatedResult<T> {
  /**
   * @description Immutable slice of items for the requested page.
   */
  readonly data: readonly T[]

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
