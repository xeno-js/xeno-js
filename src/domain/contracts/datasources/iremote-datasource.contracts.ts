import type { HttpRequest } from '@/shared'

import type { ResultType } from '../../results/result.types'

/**
 * @description Contract for a remote data source that defines the method for fetching data from a remote endpoint. This interface abstracts the details of how the data is fetched, allowing for different implementations (e.g., using different HTTP clients or protocols) while providing a consistent method signature for fetching data.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IRemoteDataSource {
  /**
   * @description Fetches data from a remote endpoint based on the provided request parameters. The method takes a RemoteRequest object that contains the necessary information for making the remote call, such as the URL, HTTP method, headers, query parameters, and body. It also accepts an optional AbortSignal that can be used to cancel the request if needed. The method returns a Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.
   * @param endpoint The URL of the remote endpoint.
   * @param request An object containing the details of the remote request, including the HTTP method, headers, query parameters, and body.
   * @returns A Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  send<TResponse, TBody = unknown>(
    endpoint: string,
    request: HttpRequest<TBody>,
  ): Promise<ResultType<TResponse>>
}
