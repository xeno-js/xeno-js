// ─── Constants ────────────────────────────────────────────────────────────────

/** @description Default page index when no page is supplied by the caller. */
const DEFAULT_PAGE = 1

/** @description Default maximum number of items per page. */
const DEFAULT_PAGE_SIZE = 20

/** @description Absolute maximum allowed page size to prevent resource exhaustion. */
const MAX_PAGE_SIZE = 100

/** @description Canonical pagination defaults. */
export const PAGINATION_DEFAULTS = Object.freeze({
  /** @description Default page index (1-based). */
  PAGE: DEFAULT_PAGE,

  /** @description Default maximum items per page. */
  PAGE_SIZE: DEFAULT_PAGE_SIZE,

  /** @description Hard ceiling on page size accepted by the system. */
  MAX_PAGE_SIZE,
} as const)

// ─── Sort Direction ───────────────────────────────────────────────────────────

/**
 * @description Canonical sort direction values.
 * Used by IPaginationParams.sortDirection to avoid string magic.
 */
export const SORT_DIRECTION = Object.freeze({
  /** @description Ascending order (A → Z, 0 → 9, oldest → newest). */
  ASC: 'asc',

  /** @description Descending order (Z → A, 9 → 0, newest → oldest). */
  DESC: 'desc',
} as const)

/** @description Inferred union of valid sort direction values. */
export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION]
