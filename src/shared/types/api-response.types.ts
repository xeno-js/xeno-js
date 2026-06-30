import type { Dictionary, Guid, Optional } from './common.types'
import type { HttpHeaders } from './http.types'
import type { IPaginatedResult } from './pagination.types'

/**
 * @file api-response.types.ts
 * @description Defines types related to API responses, including the structure of successful and error responses returned by the server.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */

/**
 * @description Defines the structure of the API response returned by the server. It includes a status indicating whether the request was successful or resulted in an error, a boolean flag 'ok' for quick checks, headers containing any relevant HTTP headers, and a data field that can either be a successful response with the expected data or an error response with details about the failure.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export interface ResponseDto<T = unknown> {
  /** @description Indicates the overall status of the API response, which can be either 'success' or 'error'.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  status: number
  /** @description A boolean flag that is true if the response status is 'success' and false if it is 'error'. This provides a convenient way to check the success of the API call without having to compare the status string.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  ok: boolean
  /** @description A dictionary of HTTP headers included in the API response. This can contain any relevant headers returned by the server, such as content type, caching directives, or custom headers.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  headers: HttpHeaders
  /** @description The payload of the API response, which can either be a successful response containing the expected data or an error response containing details about the failure. The structure of this field depends on whether the API call was successful or resulted in an error.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  data: ApiResponseDto<T>
}

/**
 * @description Defines the structure of a successful API response, which includes a data field containing the expected response payload. This interface is used when the API call is successful and the server returns the requested data.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export interface SuccessResponseDto<T = unknown> {
  /** @description A boolean flag that is always true for successful responses. This provides a consistent way to check for success in the API response.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  readonly success: true
  /** @description The actual data payload returned by the API call. The structure of this field can vary depending on the specific endpoint and the type of data being returned. It is defined as a generic type T, allowing for flexibility in the shape of the response data.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  readonly data: T | IPaginatedResult<T>
  /** @description Metadata associated with the successful API response. This can include pagination information, rate limit details, or other relevant metadata.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  readonly meta: Dictionary
}

/**
 * @description Defines the structure of an error API response, which includes an error object containing details about the failure. This interface is used when the API call results in an error and the server returns information about what went wrong.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export interface ErrorResponseDto {
  /** @description A boolean flag that is always false for error responses. This provides a consistent way to check for errors in the API response.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  readonly success: false
  /** @description An object containing details about the error that occurred during the API call. This includes an error code, a human-readable error message, and optionally additional details that can help diagnose the issue.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  readonly error: {
    /** @description A string code that categorizes the type of error that occurred. This can be used for programmatic handling of different error types.
     *
     * @author Mattia Carcione
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/Gantry5
     */
    readonly code: string
    /** @description A human-readable message that describes the error. This should provide enough information for developers to understand what went wrong and how to address it.
     *
     * @author Mattia Carcione
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/Gantry5
     */
    readonly message: string
    /** @description Optional additional details about the error. This can include stack traces, validation errors, or any other relevant information that can assist in diagnosing and fixing the issue.
     *
     * @author Mattia Carcione
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/Gantry5
     */
    readonly details: Optional<string>
  }
  /** @description Metadata associated with the error API response. This can include information about the request that led to the error, timestamps, or any other relevant metadata that can help in understanding the context of the error.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  readonly correlationId: Guid
  /** @description The timestamp indicating when the error occurred. This can be useful for logging and debugging purposes, allowing developers to correlate errors with specific events or requests.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  readonly requestId: Guid
  /** @description The timestamp indicating when the error occurred. This can be useful for logging and debugging purposes, allowing developers to correlate errors with specific events or requests.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  readonly timestamp: string
}

type ApiResponseDto<T = unknown> = SuccessResponseDto<T> | ErrorResponseDto
