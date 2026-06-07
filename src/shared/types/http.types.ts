import type { Dictionary, Optional } from '@/shared'

/**
 * @description Agnostic contract used to execute HTTP calls independently
 * from concrete transport libraries (fetch, axios, undici, etc.).
 */
export interface HttpClientConfig {
  /** @description Optional default headers to include in every request made by the HTTP client. */
  defaultHeaders: Optional<HttpHeaders>
  /** @description Optional base URL to prepend to all request URLs made by the HTTP client. */
  baseURL: Optional<string>
  /** @description Optional timeout in milliseconds for all requests made by the HTTP client. */
  timeoutMs: Optional<number>
}

/**
 * @description Supported HTTP methods.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

/**
 * @description Header map used by agnostic HTTP clients.
 */
export type HttpHeaders = Dictionary<string>

/**
 * @description Query string value accepted by the HTTP contract.
 */
export type HttpQueryValue = string | number | boolean | null | undefined

/**
 * @description Agnostic contract used to execute HTTP calls independently
 * from concrete transport libraries (fetch, axios, undici, etc.).
 */
export type HttpOptions = 'url' | 'method' | 'body'

/**
 * @description Request options accepted by the agnostic HTTP client.
 */
export interface HttpRequest<TBody = unknown> {
  /** @description Absolute or relative target URL. */
  readonly url: string

  /** @description HTTP method used for the outgoing call. */
  readonly method: HttpMethod

  /** @description Optional request headers. */
  readonly headers: Optional<HttpHeaders>

  /** @description Optional query string parameters. */
  readonly query: Optional<Dictionary<HttpQueryValue>>

  /** @description Optional request body. */
  readonly body: Optional<TBody>

  /** @description Optional abort signal used to cancel the request. */
  readonly signal: Optional<AbortSignal>

  /** @description Optional request timeout in milliseconds. */
  readonly timeoutMs: Optional<number>
}

/**
 * @description Normalized response returned by an agnostic HTTP client.
 */
export interface HttpResponse<TData = unknown> {
  /** @description HTTP status code returned by the server. */
  readonly status: number

  /** @description Indicates if the response status is in the 2xx range. */
  readonly ok: boolean

  /** @description Response headers normalized as a dictionary. */
  readonly headers: HttpHeaders

  /** @description Parsed response payload. */
  readonly data: TData
}
