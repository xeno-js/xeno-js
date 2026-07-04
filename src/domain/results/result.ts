import type { Optional } from '@/shared'

/**
 * A class representing the result of an operation, which can either be a success or a failure.
 * It encapsulates the value of a successful operation or the error of a failed operation.
 *
 * @template TValue - The type of the value in case of a successful operation.
 * @template TError - The type of the error in case of a failed operation (default is never).

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class Result<TValue, TError = never> {
  /**
   * Indicates whether the operation was successful or not.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  private readonly _isSuccess: boolean
  /**
   * The error of the operation in case it failed.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  private readonly _error: Optional<TError>
  /**
   * The value of the operation in case it succeeded.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  private readonly _value: Optional<TValue>

  /**
   * Private constructor to prevent direct instantiation. Use the static methods `ok` and `fail` to create instances.
   *
   * @param isSuccess - A boolean indicating whether the operation was successful.
   * @param error - The error of the operation in case it failed (optional).
   * @param value - The value of the operation in case it succeeded (optional).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  private constructor(isSuccess: boolean, error: Optional<TError>, value: Optional<TValue>) {
    this._isSuccess = isSuccess
    this._error = error
    this._value = value
  }

  /**
   * Creates a successful result with the given value.
   *
   * @param value - The value of the successful operation.
   * @returns A Result instance representing a successful operation.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value)
  }

  /**
   * Creates a failed result with the given error.
   *
   * @param error - The error of the failed operation.
   * @returns A Result instance representing a failed operation.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public static fail<U, V = never>(error: V): Result<U, V> {
    return new Result<U, V>(false, error, undefined)
  }

  /**
   * Checks if the result is a success.
   *
   * @returns True if the result is a success, false otherwise.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public isOk(): boolean {
    return this._isSuccess
  }

  /**
   * Gets the value of the result or throws an error if the result is a failure.
   *
   * @returns The value of the result.
   * @throws An error if the result is a failure.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public getValueOrThrow(): Optional<TValue> {
    if (!this._isSuccess) {
      throw new Error('Cannot get the value of a failed result.')
    }
    return this._value
  }

  /**
   * Gets the error of the result or throws an error if the result is a success.
   *
   * @returns The error of the result.
   * @throws An error if the result is a success.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public getErrorOrThrow(): TError {
    if (this._isSuccess) {
      throw new Error('Cannot get the error of a successful result.')
    }
    return this._error as TError
  }
}
