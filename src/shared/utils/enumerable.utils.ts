import type { Optional } from '../types/common.types'
import { Guards } from './guards.utils'

/**
 * @file enumerable.utils.ts
 * @description Provides utility functions for array operations, including methods to retrieve the first element of an array with optional filtering.
 */

/**
 * @description A utility object that provides methods for working with arrays, specifically for retrieving the first element of an array with optional filtering.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link www.github.com/Mattia-Carcione/xeno-js
 */
export const Enumerable = Object.freeze({
  /**
   * Retrieves the first element of an array that satisfies the provided predicate function. If no predicate is provided, it returns the first element of the array. If the array is empty or no elements satisfy the predicate, an error is thrown.
   * @template T - The type of elements in the array.
   * @param array - The array to search.
   * @param predicate - An optional function to test each element.
   * @returns The first element that satisfies the predicate.
   * @throws {Error} If the array is empty or no elements satisfy the predicate.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link www.github.com/Mattia-Carcione/xeno-js
   */
  first<T>(array: T[], predicate?: (item: T) => boolean): T {
    const item = Guards.isDefined(predicate) ? array.find(predicate) : array[0]
    if (!Guards.isDefined(item)) {
      throw new Error('Sequence contains no elements.')
    }
    return item
  },

  /**
   * Retrieves the first element of an array that satisfies the provided predicate function. If no predicate is provided, it returns the first element of the array. If the array is empty or no elements satisfy the predicate, undefined is returned.
   * @template T - The type of elements in the array.
   * @param array - The array to search.
   * @param predicate - An optional function to test each element.
   * @returns The first element that satisfies the predicate or undefined.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link www.github.com/Mattia-Carcione/xeno-js
   */
  firstOrDefault<T>(array: T[], predicate?: (item: T) => boolean): Optional<T> {
    const item = Guards.isDefined(predicate) ? array.find(predicate) : array[0]
    return Guards.isDefined(item) ? item : undefined
  },
} as const)
