import type { Dictionary, Maybe, Optional, Path } from './common.types'

/**
 * @description RouteRegistry is a type that defines a mapping of HTTP paths to their corresponding HTTP methods and access levels. Each path can have multiple HTTP methods (like GET, POST, etc.), and each method is associated with an access level, which in this case is represented by the string 'isPublic'. This structure is useful for defining public routes in a web application, allowing developers to specify which routes are accessible without authentication.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export type RouteRegistry = Record<Path, Record<HttpMethod, 'isPublic'>>

/**
 * @description Supported HTTP methods.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

/**
 * @description Header map used by agnostic HTTP clients.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type HttpHeaders = Dictionary<string | string[]>

/**
 * @description Query string value accepted by the HTTP contract.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type HttpQueryValue = Maybe<string | number | boolean>

/**
 * @description Agnostic contract used to execute HTTP calls independently
 * from concrete transport libraries (fetch, axios, undici, etc.).

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type HttpOptions = 'url' | 'method' | 'body'

/**
 * @description Request options accepted by the agnostic HTTP client.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface HttpRequest<TBody = unknown> {
  /** @description HTTP method used for the outgoing call.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly method: HttpMethod

  /** @description Optional query string parameters.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly query?: Optional<Dictionary<HttpQueryValue>>

  /** @description Optional request body.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly body?: Optional<TBody>

  /** @description Optional request headers.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly headers?: Optional<HttpHeaders>

  /** @description Absolute or relative target URL.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly url?: string

  /** @description Optional abort signal used to cancel the request.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly signal: Optional<AbortSignal>

  /** @description Optional request timeout in milliseconds.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly timeoutMs?: Optional<number>
}

/**
 * @description Normalized response returned by an agnostic HTTP client.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface HttpResponse<TData = unknown> {
  /** @description HTTP status code returned by the server.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly status: number

  /** @description Indicates if the response status is in the 2xx range.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly ok: boolean

  /** @description Response headers normalized as a dictionary.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly headers: HttpHeaders

  /** @description Parsed response payload.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly data: TData
}
