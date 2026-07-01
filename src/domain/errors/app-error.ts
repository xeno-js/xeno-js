import type { Maybe, Optional } from '@/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, Guards, STATUS_CODES } from '@/shared'
/**
 * A class representing an application error, which extends the built-in Error class.
 * It includes additional properties such as an error code and an HTTP status code.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
interface ErrorPayload {
  /** The error message describing the error.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  message: string
  /** The error code representing the type of error.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  code: string
  /** The HTTP status code associated with the error.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  status: number
  /** The name of the error, typically the class name.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  name: string
  /** An optional property to hold the original error or any additional context.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  cause: Optional<unknown>
}

/**
 * A class representing an application error, which extends the built-in Error class.
 * It includes additional properties such as an error code and an HTTP status code.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export class AppError extends Error {
  /**
   * The error code representing the type of error.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  public readonly code: string
  /**
   * The HTTP status code associated with the error.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  public readonly status: number

  /**
   * Private constructor to prevent direct instantiation. Use the static methods `create` and `throw` to create instances.
   *
   * @param payload - The payload containing error details.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  private constructor(payload: ErrorPayload) {
    super(payload.message)
    this.name = payload.name
    this.code = payload.code
    this.status = payload.status
    this.cause = payload.cause
  }

  /**
   * Creates an AppError instance with the given error payload.
   *
   * @param payload - The payload containing error details.
   * @returns An AppError instance representing the error.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  public static create(payload: ErrorPayload): AppError {
    return new AppError(payload)
  }

  /**
   * Creates an AppError instance and throws it immediately.
   * @param payload - The payload containing error details.
   * @throws An AppError instance representing the error.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  public static throw(payload: ErrorPayload): never {
    throw new AppError(payload)
  }

  /**
   * Creates an AppError instance representing an aborted request.
   * @param name - The name of the error, typically the class name or context where the error occurred.
   * @returns An AppError instance representing the aborted request error.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  public static aborted(name: string): AppError {
    return new AppError({
      code: ERROR_CODES.ABORTED,
      message: ERROR_CODE_MESSAGES[ERROR_CODES.ABORTED],
      status: STATUS_CODES.ABORTED,
      name,
      cause: new Error('The client closed the connection before the server finished responding.'),
    })
  }

  /**
   * Utility method to check if an AbortSignal has been triggered and throw an AppError if it has.
   * @param signal - The AbortSignal to check for abortion.
   * @param name - The name of the error, typically the class name or context where the error occurred.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  public static throwIfAborted(signal: Maybe<AbortSignal>, name: string): void {
    if (Guards.isDefined(signal) && signal.aborted) {
      throw AppError.aborted(name)
    }
  }
}
