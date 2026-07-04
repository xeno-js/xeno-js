import type { AppError } from '../errors/app-error'
import type { Result } from './result'

/**
 * A utility type to extract the value type from a Result instance.
 *
 * @template T - The type of the Result instance.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type ResultType<T, E = AppError> = Result<T, E>
