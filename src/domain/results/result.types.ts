import type { AppError } from '../errors/app-error'
import type { Result } from './result'

/**
 * A utility type to extract the value type from a Result instance.
 *
 * @template T - The type of the Result instance.
 */
export type ResultType<T, E = AppError> = Result<T, E>
