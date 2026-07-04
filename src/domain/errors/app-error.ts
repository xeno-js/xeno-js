import type { Maybe, Optional } from '@/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, Guards, STATUS_CODES } from '@/shared'
/**
 * A class representing an application error, which extends the built-in Error class.
 * It includes additional properties such as an error code and an HTTP status code.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
interface ErrorPayload {
  /** The error message describing the error.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  message: string
  /** The error code representing the type of error.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  code: string
  /** The HTTP status code associated with the error.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  status: number
  /** The name of the error, typically the class name.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  name: string
  /** An optional property to hold the original error or any additional context.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  cause: Optional<unknown>
  /** A Dictionary to hold any additional context or information related to the error.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  [key: string]: unknown
}

/**
 * A class representing an application error, which extends the built-in Error class.
 * It includes additional properties such as an error code and an HTTP status code.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class AppError extends Error {
  /**
   * The error code representing the type of error.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public readonly code: string
  /**
   * The HTTP status code associated with the error.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public readonly status: number

  /**
   * A Dictionary to hold any additional context or information related to the error.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly [key: string]: unknown

  /**
   * Private constructor to prevent direct instantiation. Use the static methods `create` and `throw` to create instances.
   *
   * @param payload - The payload containing error details.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  private constructor(payload: ErrorPayload) {
    super(payload.message)
    this.code = payload.code
    this.status = payload.status
    Object.assign(this, payload)
  }

  /**
   * Creates an AppError instance with the given error payload.
   *
   * @param payload - The payload containing error details.
   * @returns An AppError instance representing the error.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public static create(payload: ErrorPayload): AppError {
    return new AppError(payload)
  }

  /**
   * Creates an AppError instance and throws it immediately.
   * @param payload - The payload containing error details.
   * @throws An AppError instance representing the error.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public static throw(payload: ErrorPayload): never {
    throw new AppError(payload)
  }

  /**
   * Creates an AppError instance representing an aborted request.
   * @param name - The name of the error, typically the class name or context where the error occurred.
   * @returns An AppError instance representing the aborted request error.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  public static throwIfAborted(signal: Maybe<AbortSignal>, name: string): void {
    if (Guards.isDefined(signal) && signal.aborted) {
      throw AppError.aborted(name)
    }
  }

  /** @description Creates an AppError instance representing an unauthorized access error. This method is used to generate a standardized error response when a user attempts to access a resource or perform an action without the necessary authentication or authorization.
   * @param name The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.
   * @param message A custom message describing the reason for the unauthorized access. This message is included in the AppError's cause for detailed error reporting.
   * @returns An AppError instance representing the unauthorized access error.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  public static unauthorized(name: string, message: string): AppError {
    return AppError.create({
      code: ERROR_CODES.UNAUTHORIZED,
      message: ERROR_CODE_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      status: STATUS_CODES.UNAUTHORIZED,
      name,
      cause: new Error(message),
      header: { 'WWW-Authenticate': ['Bearer realm="api"'] },
    })
  }

  /** @description Creates an AppError instance representing a forbidden access error. This method is used to generate a standardized error response when a user attempts to access a resource or perform an action that they are not authorized to access, even if they are authenticated.
   * @param name The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.
   * @param message A custom message describing the reason for the forbidden access. This message is included in the AppError's cause for detailed error reporting.
   * @returns An AppError instance representing the forbidden access error.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  public static forbidden(name: string, message: string): AppError {
    return AppError.create({
      code: ERROR_CODES.FORBIDDEN,
      message: ERROR_CODE_MESSAGES[ERROR_CODES.FORBIDDEN],
      status: STATUS_CODES.FORBIDDEN,
      name,
      cause: new Error(message),
    })
  }

  /** @description Creates an AppError instance representing a bad request error. This method is used to generate a standardized error response when a request made by the client is invalid or cannot be processed due to client-side issues, such as validation errors or malformed requests.
   * @param name The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.
   * @param message A custom message describing the reason for the bad request. This message is included in the AppError's cause for detailed error reporting.
   * @returns An AppError instance representing the bad request error.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  public static badRequest(name: string, message: string): AppError {
    return AppError.create({
      code: ERROR_CODES.BAD_REQUEST,
      message: ERROR_CODE_MESSAGES[ERROR_CODES.BAD_REQUEST],
      status: STATUS_CODES.BAD_REQUEST,
      name,
      cause: new Error(message),
    })
  }

  /** @description Creates an AppError instance representing a validation error. This method is used to generate a standardized error response when one or more input fields fail invariant or schema validation, indicating that the request cannot be processed due to invalid data.
   * @param name The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.
   * @param message A custom message describing the reason for the validation failure. This message is included in the AppError's cause for detailed error reporting.
   * @returns An AppError instance representing the validation error.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  public static validationError(name: string, message: string): AppError {
    return AppError.create({
      code: ERROR_CODES.VALIDATION_FAILED,
      message: ERROR_CODE_MESSAGES[ERROR_CODES.VALIDATION_FAILED],
      status: STATUS_CODES.BAD_REQUEST,
      name,
      cause: new Error(message),
    })
  }

  /** @description Creates an AppError instance representing a conflict error. This method is used to generate a standardized error response when a request conflicts with the current state of the resource, such as when attempting to create a resource that already exists or update a resource that has been modified by another process.
   * @param name The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.
   * @param message A custom message describing the reason for the conflict. This message is included in the AppError's cause for detailed error reporting.
   * @returns An AppError instance representing the conflict error.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  public static conflict(name: string, message: string): AppError {
    return AppError.create({
      code: ERROR_CODES.CONFLICT,
      message: ERROR_CODE_MESSAGES[ERROR_CODES.CONFLICT],
      status: STATUS_CODES.CONFLICT,
      name,
      cause: new Error(message),
    })
  }
}
