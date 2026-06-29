import { STATUS_CODES } from '../constants/error.constants'
import type {
  Dictionary,
  ErrorResponseDto,
  Guid,
  HttpHeaders,
  IPaginatedResult,
  Optional,
  ResponseDto,
  SuccessResponseDto,
} from '../types/index'
import { DateHelper } from './date.utils'
import { Guards } from './guards.utils'
import { GuidHelper } from './guid.utils'

/**
 * @description This module provides utility functions for handling HTTP-related tasks, such as normalizing HTTP headers. It includes a single function, `normalizeHeaders`, which takes an input of unknown type and returns an object with normalized header values. The function ensures that all header values are converted to strings, and if a header value is an array, it joins the elements into a single string separated by commas. This utility is useful for ensuring consistent header formats when working with various HTTP client libraries.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */

/**
 * @description A helper object that provides utility functions for HTTP-related tasks. Currently, it includes a method for normalizing HTTP headers, which ensures that all header values are strings and handles cases where header values may be arrays. This helper can be extended in the future to include additional HTTP-related utilities as needed.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export const HttpHelper = Object.freeze({
  /**
   * @description Normalizes HTTP headers by converting all header values to strings. If a header value is an array, it joins the array elements into a single string separated by commas. This method ensures that the headers are in a consistent format, which can be particularly useful when working with different HTTP client libraries that may represent headers in various ways. If the input headers are not defined or not an object, it returns an empty object.
   * @param headers The input headers to be normalized, which can be of any type. The method checks if the headers are defined and are an object before processing them.
   * @returns An object containing the normalized headers, where each header value is a string. If the input headers were not valid, it returns an empty object.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  normalizeHeaders(headers: unknown): HttpHeaders {
    if (!Guards.isDefined(headers) || !Guards.isObject(headers)) return {}

    const normalized: HttpHeaders = {}
    for (const [key, value] of Object.entries(headers as Dictionary)) {
      if (!Guards.isDefined(value)) {
        continue
      }

      normalized[key] = Array.isArray(value)
        ? value.map((part) => String(part)).join(',')
        : String(value)
    }

    return normalized
  },
  /**
   * @description Generates a standardized successful HTTP response with the provided data, status code, metadata, and custom headers. The response includes a success flag set to true, the data payload, and any additional metadata. The headers include a default 'Content-Type' of 'application/json' along with any custom headers provided.
   * @param data The actual data payload to be included in the successful response. This can be of any type and will be wrapped in a SuccessResponseDto structure.
   * @param status The HTTP status code for the response, defaulting to 200 (OK) if not provided. This allows for flexibility in indicating different types of successful responses (e.g., 201 for created, 204 for no content).
   * @param meta Optional metadata to be included in the response. This can contain additional information relevant to the response, such as pagination details, rate limit information, or any other contextual data that may be useful for clients consuming the API.
   * @param customHeaders Optional custom HTTP headers to be included in the response. This allows for adding any additional headers that may be necessary for specific responses, such as caching directives, custom authentication headers, or other relevant information.
   * @returns A ResponseDto object representing the successful HTTP response, containing the status code, success flag, headers, and data payload structured as a SuccessResponseDto.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  success<T>(
    data: T | IPaginatedResult<T>,
    status = 200,
    meta: Dictionary = {},
    customHeaders: HttpHeaders = {},
  ): ResponseDto<T> {
    const successPayload: SuccessResponseDto<T> = {
      success: true,
      data,
      meta,
    }

    return {
      status,
      ok: true,
      headers: {
        ...customHeaders,
        'Content-Type': ['application/json'],
      },
      data: successPayload,
    }
  },

  /**
   * @description Generates a standardized error HTTP response with the provided error details, status code, correlation ID, request ID, timestamp, and custom headers. The response includes a success flag set to false, an error object containing the error code, message, and optional details, as well as metadata such as correlation ID and request ID for tracking purposes. The headers include a default 'Content-Type' of 'application/json' along with any custom headers provided.
   * @param params An object containing the parameters for generating the error response, including:
   * - code: A string code that categorizes the type of error that occurred. This can be used for programmatic handling of different error types.
   * - message: A human-readable message that describes the error. This should provide enough information for developers to understand what went wrong and how to address it.
   * - status: An optional HTTP status code for the error response, defaulting to 500 (Internal Server Error) if not provided. This allows for flexibility in indicating different types of errors (e.g., 400 for bad request, 401 for unauthorized).
   * - details: Optional additional details about the error. This can include stack traces, validation errors, or any other relevant information that can assist in diagnosing and fixing the issue.
   * - correlationId: An optional correlation ID for tracking the error across different systems or services. If not provided, a new GUID will be generated.
   * - requestId: An optional request ID for tracking the specific request that led to the error. If not provided, a new GUID will be generated.
   * - customHeaders: Optional custom HTTP headers to be included in the error response. This allows for adding any additional headers that may be necessary for specific error responses, such as retry-after headers or custom authentication headers.
   * @returns A ResponseDto object representing the error HTTP response, containing the status code, success flag, headers, and data payload structured as an ErrorResponseDto.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  error(params: {
    code: string
    message: string
    status: Optional<number>
    details: Optional<string>
    correlationId: Optional<Guid>
    requestId: Optional<Guid>
    customHeaders: Optional<HttpHeaders>
  }): ResponseDto<never> {
    const status = params.status ?? STATUS_CODES.INTERNAL_SERVER_ERROR
    const correlationId = params.correlationId ?? GuidHelper.generate()
    const requestId = params.requestId ?? GuidHelper.generate()

    const errorPayload: ErrorResponseDto = {
      success: false,
      error: {
        code: params.code,
        message: params.message,
        details: params.details ?? undefined,
      },
      correlationId,
      requestId,
      timestamp: DateHelper.toISOString(new Date()),
    }

    return {
      status,
      ok: false,
      headers: {
        ...(params.customHeaders ?? {}),
        'Content-Type': ['application/json'],
        'X-Correlation-Id': [correlationId],
        'X-Request-Id': [requestId],
        'Cache-Control': ['no-store, no-cache, must-revalidate, proxy-revalidate'],
        'Pragma': ['no-cache'],
        'Expires': ['0'],
      },
      data: errorPayload,
    }
  },
} as const)
