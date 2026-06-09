/**
 * @description This module provides utility functions for handling HTTP-related tasks, such as normalizing HTTP headers. It includes a single function, `normalizeHeaders`, which takes an input of unknown type and returns an object with normalized header values. The function ensures that all header values are converted to strings, and if a header value is an array, it joins the elements into a single string separated by commas. This utility is useful for ensuring consistent header formats when working with various HTTP client libraries.
 */

import type { Dictionary, HttpHeaders } from '@/shared'
import { Guards } from '@/shared'

/**
 * @description A helper object that provides utility functions for HTTP-related tasks. Currently, it includes a method for normalizing HTTP headers, which ensures that all header values are strings and handles cases where header values may be arrays. This helper can be extended in the future to include additional HTTP-related utilities as needed.
 */
export const HttpHelper = Object.freeze({
  /**
   * @description Normalizes HTTP headers by converting all header values to strings. If a header value is an array, it joins the array elements into a single string separated by commas. This method ensures that the headers are in a consistent format, which can be particularly useful when working with different HTTP client libraries that may represent headers in various ways. If the input headers are not defined or not an object, it returns an empty object.
   * @param headers The input headers to be normalized, which can be of any type. The method checks if the headers are defined and are an object before processing them.
   * @returns An object containing the normalized headers, where each header value is a string. If the input headers were not valid, it returns an empty object.
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
} as const)
