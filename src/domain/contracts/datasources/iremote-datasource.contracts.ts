import type { HttpBaseRequest } from '@/shared'

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
  /** @description Fetches data from a remote endpoint using the specified HTTP method and request options. The method returns a ResultType that encapsulates either the successful response data or an error, providing a consistent way to handle both success and failure cases.
   *
   * @param endpoint - The URL or endpoint from which to fetch data.
   * @param request - The request options for the remote call.
   * @returns A Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  get<TResponse>(endpoint: string, request: HttpBaseRequest): Promise<ResultType<TResponse>>

  /** @description Sends data to a remote endpoint using the specified HTTP method and request options. The method returns a ResultType that encapsulates either the successful response data or an error, providing a consistent way to handle both success and failure cases.
   *
   * @param endpoint - The URL or endpoint to which to send data.
   * @param request - The request options for the remote call.
   * @returns A Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  post<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    request: HttpBaseRequest,
  ): Promise<ResultType<TResponse>>

  /** @description Updates data at a remote endpoint using the specified HTTP method and request options. The method returns a ResultType that encapsulates either the successful response data or an error, providing a consistent way to handle both success and failure cases.
   *
   * @param endpoint - The URL or endpoint at which to update data.
   * @param request - The request options for the remote call.
   * @returns A Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  put<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    request: HttpBaseRequest,
  ): Promise<ResultType<TResponse>>

  /** @description Patches data at a remote endpoint using the specified HTTP method and request options. The method returns a ResultType that encapsulates either the successful response data or an error, providing a consistent way to handle both success and failure cases.
   *
   * @param endpoint - The URL or endpoint at which to patch data.
   * @param request - The request options for the remote call.
   * @returns A Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  patch<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    request: HttpBaseRequest,
  ): Promise<ResultType<TResponse>>

  /** @description Deletes data from a remote endpoint using the specified HTTP method and request options. The method returns a ResultType that encapsulates either the successful response data or an error, providing a consistent way to handle both success and failure cases.
   *
   * @param endpoint - The URL or endpoint from which to delete data.
   * @param request - The request options for the remote call.
   * @returns A Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  delete<TResponse>(endpoint: string, request: HttpBaseRequest): Promise<ResultType<TResponse>>
}
