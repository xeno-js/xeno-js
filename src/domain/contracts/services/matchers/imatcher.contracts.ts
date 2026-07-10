/**
 * @description IMatcher interface defines a contract for matching values of type T.
 * It provides a method to determine if a given value matches certain criteria.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface IMatcher<T> {
  /**
   * @description Determines if the provided value matches the criteria defined by the implementation.
   * @param value - The value to be matched against the criteria.
   * @returns A boolean indicating whether the value matches (true) or not (false).
   *
   * @example
   * ```ts
   * class EvenNumberMatcher implements IMatcher<number> {
   *   match(value: number): boolean {
   *     return value % 2 === 0;
   *   }
   * }
   *
   * const matcher = new EvenNumberMatcher();
   * console.log(matcher.match(4)); // true
   * console.log(matcher.match(5)); // false
   * ```
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  match(value: T): boolean
}
