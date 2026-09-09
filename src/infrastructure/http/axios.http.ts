import type { IHttpClient } from '@xeno-js/shared'
import type { HttpOptions, HttpRequest, HttpResponse, Optional } from '@xeno-js/shared'
import { AppError } from '@xeno-js/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, Guards, HttpHelper, STATUS_CODES } from '@xeno-js/shared'
import type { AxiosInstance } from 'axios'
import { AxiosError } from 'axios'

/**
 * @description Axios-based implementation of the agnostic IHttpClient contract.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class AxiosHttpClient implements IHttpClient {
  /**
   * @description Creates a new AxiosHttpClient.
   * @param config Optional HTTP client config used to initialize the internal client instance.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
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

      if (!Guards.isDefined(response.status) || response.status >= 400) {
        AppError.throw({
          code: ERROR_CODES.EXTERNAL_SERVICE_ERROR,
          message: ERROR_CODE_MESSAGES[ERROR_CODES.EXTERNAL_SERVICE_ERROR],
          status: response.status,
          name: 'AxiosHttpClientException',
          cause: new AxiosError(
            `Request failed with status code ${response.status}`,
            undefined,
            response.config,
            response.request,
            response,
          ),
        })
      }

      return {
        status: response.status,
        ok: response.status >= 200 && response.status < 300,
        headers: HttpHelper.normalizeHeaders(response.headers),
        data: response.data,
      }
    } catch (error: unknown) {
      if (error instanceof AppError) throw error

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
}
