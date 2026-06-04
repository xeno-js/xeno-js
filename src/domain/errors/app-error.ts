import type { Optional } from '@/shared'

/**
 * A class representing an application error, which extends the built-in Error class.
 * It includes additional properties such as an error code and an HTTP status code.
 */
interface ErrorPayload {
  /** The error message describing the error. */
  message: string
  /** The error code representing the type of error. */
  code: string
  /** The HTTP status code associated with the error. */
  status: number
  /** The name of the error, typically the class name. */
  name: string
  /** An optional property to hold the original error or any additional context. */
  cause: Optional<unknown>
}

/**
 * A class representing an application error, which extends the built-in Error class.
 * It includes additional properties such as an error code and an HTTP status code.
 */
export class AppError extends Error {
  /**
   * The error code representing the type of error.
   */
  public readonly code: string
  /**
   * The HTTP status code associated with the error.
   */
  public readonly status: number

  /**
   * Private constructor to prevent direct instantiation. Use the static methods `create` and `throw` to create instances.
   *
   * @param payload - The payload containing error details.
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
   */
  public static create(payload: ErrorPayload): AppError {
    return new AppError(payload)
  }
}
