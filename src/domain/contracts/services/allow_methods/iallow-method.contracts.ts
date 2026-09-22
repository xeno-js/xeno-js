import type { HttpMethod } from '@xeno-js/shared'

/**
 * @description Interface for the allow method service.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface IAllowMethod {
  /** @description Check if the given method is allowed for the given path.
   * @param path The path to check.
   * @param method The method to check.
   * @returns True if the method is allowed, false otherwise.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  check(path: string, method: HttpMethod): boolean
}
