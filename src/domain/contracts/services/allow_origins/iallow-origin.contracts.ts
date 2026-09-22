import type { Optional } from '@xeno-js/shared'

/**
 * @description Interface for the allow origin service.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface IAllowOrigin {
  /** @description Check if the given origin is allowed.
   * @param origin The origin to check.
   * @returns True if the origin is allowed, false otherwise.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  isAllowed(origin: Optional<string>): boolean
}
