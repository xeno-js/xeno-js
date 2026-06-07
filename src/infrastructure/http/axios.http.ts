import type { AxiosInstance } from 'axios'
import { AxiosError } from 'axios'

import type { IHttpClient } from '@/domain'
import { AppError } from '@/domain'
import type {
  Dictionary,
  HttpHeaders,
  HttpOptions,
  HttpRequest,
  HttpResponse,
  Optional,
} from '@/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, Guards, STATUS_CODES } from '@/shared'

/**
 * @description Axios-based implementation of the agnostic IHttpClient contract.
 */
export class AxiosHttpClient implements IHttpClient {
  /**
   * @description Creates a new AxiosHttpClient.
   * @param config Optional HTTP client config used to initialize the internal client instance.
   */
  constructor(private readonly _client: AxiosInstance) {}

  private async request<TResponse = unknown, TBody = unknown>(
    request: HttpRequest<TBody>,
  ): Promise<HttpResponse<TResponse>> {
    AppError.throwIfAborted(request.signal, 'AxiosHttpClient.request')

    try {
      const response = await this._client.request<TResponse>({
        url: request.url,
        method: request.method,
        headers: request.headers,
        params: request.query,
        data: request.body,
        signal: request.signal,
        timeout: request.timeoutMs,
        validateStatus: () => true,
      })

      return {
        status: response.status,
        ok: response.status >= 200 && response.status < 300,
        headers: AxiosHttpClient.normalizeHeaders(response.headers),
        data: response.data,
      }
    } catch (error: unknown) {
      const status =
        error instanceof AxiosError && Guards.isDefined(error.response)
          ? error.response.status
          : STATUS_CODES.INTERNAL_SERVER_ERROR
      AppError.throw({
        code: ERROR_CODES.EXTERNAL_SERVICE_ERROR,
        message: ERROR_CODE_MESSAGES[ERROR_CODES.EXTERNAL_SERVICE_ERROR],
        status,
        name: 'AxiosHttpClientException',
        cause: error,
      })
    }
  }

  public get<TResponse = unknown>(
    url: string,
    options: Optional<Omit<HttpRequest<never>, HttpOptions>>,
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, never>(this.buildRequest<never>('GET', url, undefined, options))
  }

  public post<TResponse = unknown, TBody = unknown>(
    url: string,
    body: Optional<TBody>,
    options: Optional<Omit<HttpRequest<TBody>, HttpOptions>>,
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, TBody>(this.buildRequest<TBody>('POST', url, body, options))
  }

  public put<TResponse = unknown, TBody = unknown>(
    url: string,
    body: Optional<TBody>,
    options: Optional<Omit<HttpRequest<TBody>, HttpOptions>>,
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, TBody>(this.buildRequest<TBody>('PUT', url, body, options))
  }

  public patch<TResponse = unknown, TBody = unknown>(
    url: string,
    body: Optional<TBody>,
    options: Optional<Omit<HttpRequest<TBody>, HttpOptions>>,
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, TBody>(this.buildRequest<TBody>('PATCH', url, body, options))
  }

  public delete<TResponse = unknown>(
    url: string,
    options: Optional<Omit<HttpRequest<never>, HttpOptions>>,
  ): Promise<HttpResponse<TResponse>> {
    return this.request<TResponse, never>(
      this.buildRequest<never>('DELETE', url, undefined, options),
    )
  }

  private buildRequest<TBody>(
    method: HttpRequest<TBody>['method'],
    url: string,
    body: Optional<TBody>,
    options: Optional<Omit<HttpRequest<TBody>, HttpOptions>>,
  ): HttpRequest<TBody> {
    return {
      url,
      method,
      headers: options?.headers,
      query: options?.query,
      body,
      signal: options?.signal,
      timeoutMs: options?.timeoutMs,
    }
  }

  private static normalizeHeaders(headers: unknown): HttpHeaders {
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
  }
}
