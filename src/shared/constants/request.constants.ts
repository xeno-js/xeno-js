/** @description Constants related to request handling in the application.
 *
 * @author Mattia Carcione
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/gear5
 */
export const REQUEST_TYPE = Object.freeze({
  /** @description A request that intends to modify state (e.g. create, update, delete).
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  COMMAND: 'COMMAND',
  /** @description A request that intends to retrieve data without modifying state.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  QUERY: 'QUERY',
} as const)

/** @description Inferred union of every valid REQUEST_TYPE value.
 *
 * @author Mattia Carcione
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/gear5
 */
export type RequestType = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE]
