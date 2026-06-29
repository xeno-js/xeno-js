// ─── Constants ────────────────────────────────────────────────────────────────

/** @description Default page index when no page is supplied by the caller.
 *
 * @author Graviton5
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/Graviton5
 */
const DEFAULT_PAGE = 1

/** @description Default maximum number of items per page.
 *
 * @author Graviton5
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/Graviton5
 */
const DEFAULT_PAGE_SIZE = 20

/** @description Absolute maximum allowed page size to prevent resource exhaustion.
 *
 * @author Graviton5
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/Graviton5
 */
const MAX_PAGE_SIZE = 100

/** @description Canonical pagination defaults.
 *
 * @author Graviton5
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/Graviton5
 */
export const PAGINATION_DEFAULTS = Object.freeze({
  /** @description Default page index (1-based).
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  PAGE: DEFAULT_PAGE,

  /** @description Default maximum items per page.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  PAGE_SIZE: DEFAULT_PAGE_SIZE,

  /** @description Hard ceiling on page size accepted by the system.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  MAX_PAGE_SIZE,
} as const)

// ─── Sort Direction ───────────────────────────────────────────────────────────

/**
 * @description Canonical sort direction values.
 * Used by IPaginationParams.sortDirection to avoid string magic.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export const SORT_DIRECTION = Object.freeze({
  /** @description Ascending order (A → Z, 0 → 9, oldest → newest).
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  ASC: 'asc',

  /** @description Descending order (Z → A, 9 → 0, newest → oldest).
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  DESC: 'desc',
} as const)

/** @description Inferred union of valid sort direction values.
 *
 * @author Graviton5
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/Graviton5
 */
export type SortDirection = (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION]
