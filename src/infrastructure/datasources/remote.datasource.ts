import type { IHttpClient, IRemoteDataSource, IServiceResilience, ResultType } from '@/domain'
import { Result } from '@/domain'
import type { HttpRequest } from '@/shared'

/**
 * @description Concrete implementation of the IRemoteDataSource contract that utilizes an agnostic HTTP client and a resilience service to fetch data from remote endpoints. The RemoteDataSource class is responsible for sending HTTP requests based on the provided HttpClientRequest parameters, while leveraging the resilience features of the IServiceResilience to ensure reliable communication with external services. This implementation abstracts away the details of how HTTP requests are made and how resilience is handled, allowing for flexibility in choosing different HTTP clients and resilience strategies without affecting the consumers of the IRemoteDataSource interface.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class RemoteDataSource implements IRemoteDataSource {
  /** The constructor of the RemoteDataSource class takes two dependencies: an instance of an agnostic HTTP client that implements the IHttpClient interface, and an instance of a resilience service that implements the IServiceResilience interface.
   * These dependencies are injected into the class, allowing for greater flexibility and testability.
   * The HTTP client is used to send requests to remote endpoints, while the resilience service is used to execute these requests with built-in support for retries, timeouts, and circuit breakers, ensuring that the remote calls are more resilient to failures and can recover gracefully from errors.
   * @param _httpClient An instance of an agnostic HTTP client that implements the IHttpClient interface, used for sending HTTP requests to remote endpoints.
   * @param _resilienceService An instance of a resilience service that implements the IServiceResilience interface, used for executing HTTP requests with built-in support for retries, timeouts, and circuit breakers to enhance the reliability of remote calls.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  constructor(
    private readonly _httpClient: IHttpClient,
    private readonly _resilienceService: IServiceResilience,
  ) {}

  public async send<TResponse, TBody = unknown>(
    endpoint: string,
    request: HttpRequest<TBody>,
  ): Promise<ResultType<TResponse>> {
    const response = await this._resilienceService.execute(async () => {
      const options = {
        query: request.query,
        signal: request.signal,
        timeoutMs: request.timeoutMs,
        headers: request.headers,
      }

      switch (request.method) {
        case 'GET':
          return await this._httpClient.get<TResponse>(endpoint, options)
        case 'POST':
          return await this._httpClient.post<TResponse, TBody>(endpoint, request.body, options)
        case 'PUT':
          return await this._httpClient.put<TResponse, TBody>(endpoint, request.body, options)
        case 'PATCH':
          return await this._httpClient.patch<TResponse, TBody>(endpoint, request.body, options)
        case 'DELETE':
          return await this._httpClient.delete<TResponse>(endpoint, options)
        default:
          throw new Error(`Unsupported HTTP method: ${request.method}`)
      }
    }, request.signal)

    return Result.ok(response.data)
  }
}
