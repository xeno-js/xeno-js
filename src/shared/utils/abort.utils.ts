import type { Optional } from '../types/common.types'
import { Guards } from './guards.utils'

/**
 * @file abort-signal-helper.ts
 * @description This file contains the AbortSignalHelper utility class, which provides a method to execute a promise with an optional AbortSignal.
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link www.github.com/Mattia-Carcione/xeno-js
 */

/**
 * @class AbortSignalHelper
 * @description A utility class that provides a method to execute a promise with an optional AbortSignal.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link www.github.com/Mattia-Carcione/xeno-js
 */
export const AbortSignalHelper = Object.freeze({
  /**
   * Executes a promise with an optional AbortSignal. If the signal is provided and is aborted, the promise will be rejected with the signal's reason.
   * @template T - The type of the promise's resolved value.
   * @param promise - The promise to execute.
   * @param signal - An optional AbortSignal to cancel the promise.
   * @returns A promise that resolves with the original promise's value or rejects if the signal is aborted.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link www.github.com/Mattia-Carcione/xeno-js
   */
  execute<T>(promise: Promise<T>, signal: Optional<AbortSignal>): Promise<T> {
    if (!Guards.isDefined(signal)) return promise

    if (signal.aborted) return Promise.reject(new Error('Operation aborted'))

    return new Promise<T>((resolve, reject) => {
      const onAbort = () => {
        signal.removeEventListener('abort', onAbort)
        reject(new Error('Operation aborted by the client.'))
      }

      signal.addEventListener('abort', onAbort)

      promise
        .then((res) => {
          signal.removeEventListener('abort', onAbort)
          resolve(res)
        })
        .catch((_err) => {
          signal.removeEventListener('abort', onAbort)
          reject(new Error('Operation aborted by the client.'))
        })
    })
  },
} as const)
