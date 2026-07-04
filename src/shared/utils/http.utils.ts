import { STATUS_CODES } from '../constants/error.constants'
import type {
  Dictionary,
  ErrorResponseDto,
  HttpHeaders,
  IPaginatedResult,
  Optional,
  ResponseDto,
  SuccessResponseDto,
} from '../types/index'
import { DateHelper } from './date.utils'
import { Guards } from './guards.utils'

/**
 * @description This module provides utility functions for handling HTTP-related tasks, such as normalizing HTTP headers. It includes a single function, `normalizeHeaders`, which takes an input of unknown type and returns an object with normalized header values. The function ensures that all header values are converted to strings, and if a header value is an array, it joins the elements into a single string separated by commas. This utility is useful for ensuring consistent header formats when working with various HTTP client libraries.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */

/**
 * @description A helper object that provides utility functions for HTTP-related tasks. Currently, it includes a method for normalizing HTTP headers, which ensures that all header values are strings and handles cases where header values may be arrays. This helper can be extended in the future to include additional HTTP-related utilities as needed.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const HttpHelper = Object.freeze({
  /**
   * @description Normalizes HTTP headers by converting all header values to strings. If a header value is an array, it joins the array elements into a single string separated by commas. This method ensures that the headers are in a consistent format, which can be particularly useful when working with different HTTP client libraries that may represent headers in various ways. If the input headers are not defined or not an object, it returns an empty object.
   * @param headers The input headers to be normalized, which can be of any type. The method checks if the headers are defined and are an object before processing them.
   * @returns An object containing the normalized headers, where each header value is a string. If the input headers were not valid, it returns an empty object.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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
   * @param dto An object containing the error details, including the error code, message, optional details, and optional path. This information is structured as an ErrorResponseDto and provides context about the error that occurred.
   * @param status The HTTP status code for the response, defaulting to 500 (Internal Server Error) if not provided. This allows for flexibility in indicating different types of error responses (e.g., 400 for bad request, 404 for not found).
   * @param customHeaders Optional custom HTTP headers to be included in the response. This allows for adding any additional headers that may be necessary for specific error responses, such as caching directives, custom authentication headers, or other relevant information.
   * @returns A ResponseDto object representing the error HTTP response, containing the status code, success flag, headers, and data payload structured as an ErrorResponseDto.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  error<T>(
    dto: ErrorResponseDto,
    status: Optional<number> = STATUS_CODES.INTERNAL_SERVER_ERROR,
    customHeaders: Optional<HttpHeaders> = undefined,
  ): ResponseDto<T> {
    const errorPayload: ErrorResponseDto = {
      success: false,
      error: {
        code: dto.error.code,
        message: dto.error.message,
        details: dto.error.details,
        path: dto.error.path,
      },
      correlationId: dto.correlationId,
      requestId: dto.requestId,
      spanId: dto.spanId,
      timestamp: DateHelper.toISOString(new Date()),
    }

    return {
      status,
      ok: false,
      headers: {
        'Content-Type': ['application/json'],
        'X-Correlation-Id': [dto.correlationId],
        'X-Request-Id': [dto.requestId],
        'X-Span-Id': [dto.spanId ?? ''],
        'Cache-Control': ['no-store, no-cache, must-revalidate, proxy-revalidate'],
        'Pragma': ['no-cache'],
        'Expires': ['0'],
        ...(customHeaders ?? {}),
      },
      data: errorPayload,
    }
  },
} as const)
