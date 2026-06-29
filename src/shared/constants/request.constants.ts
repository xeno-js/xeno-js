/** @description Constants related to request handling in the application.
 *
 * @author Graviton5
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/Graviton5
 */
export const REQUEST_TYPE = Object.freeze({
  /** @description A request that intends to modify state (e.g. create, update, delete).
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  COMMAND: 'COMMAND',
  /** @description A request that intends to retrieve data without modifying state.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  QUERY: 'QUERY',
} as const)

/** @description Inferred union of every valid REQUEST_TYPE value.
 *
 * @author Graviton5
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/Graviton5
 */
export type RequestType = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE]
