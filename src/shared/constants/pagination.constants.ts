// ─── Constants ────────────────────────────────────────────────────────────────

/** @description Default page index when no page is supplied by the caller.
 *
 * @author XenoJS
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/XenoJS
 */
const DEFAULT_PAGE = 1

/** @description Default maximum number of items per page.
 *
 * @author XenoJS
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/XenoJS
 */
const DEFAULT_PAGE_SIZE = 20

/** @description Absolute maximum allowed page size to prevent resource exhaustion.
 *
 * @author XenoJS
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/XenoJS
 */
const MAX_PAGE_SIZE = 100

/** @description Canonical pagination defaults.
 *
 * @author XenoJS
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/XenoJS
 */
export const PAGINATION_DEFAULTS = Object.freeze({
  /** @description Default page index (1-based).
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  PAGE: DEFAULT_PAGE,

  /** @description Default maximum items per page.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  PAGE_SIZE: DEFAULT_PAGE_SIZE,

  /** @description Hard ceiling on page size accepted by the system.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  MAX_PAGE_SIZE,
} as const)

// ─── Sort Direction ───────────────────────────────────────────────────────────

/**
 * @description Canonical sort direction values.
 * Used by IPaginationParams.sortDirection to avoid string magic.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export const SORT_DIRECTION = Object.freeze({
  /** @description Ascending order (A → Z, 0 → 9, oldest → newest).
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  ASC: 'asc',

  /** @description Descending order (Z → A, 9 → 0, newest → oldest).
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  DESC: 'desc',
} as const)

/** @description Inferred union of valid sort direction values.
 *
 * @author XenoJS
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/XenoJS
 */
export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION]
