/** @description Constants related to request handling in the application.
 *
 * @author XenoJS
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/XenoJS
 */
export const REQUEST_TYPE = Object.freeze({
  /** @description A request that intends to modify state (e.g. create, update, delete).
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  COMMAND: 'COMMAND',
  /** @description A request that intends to retrieve data without modifying state.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  QUERY: 'QUERY',
} as const)

/** @description Inferred union of every valid REQUEST_TYPE value.
 *
 * @author XenoJS
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/XenoJS
 */
export type RequestType = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE]
