import type { HttpMethod, ResponseDto } from '@/shared'

/**
 * @description The IMiddleware interface defines the contract for middleware components that process incoming HTTP requests. Implementing classes must provide an execute method that takes an HttpRequest as input and returns a Promise of a ResponseDto, which can either be a successful response or an error response. This design allows for flexible middleware implementations that can perform various tasks such as authentication, logging, request transformation, or response generation.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IMiddleware<THeaders = unknown> {
  /**
   * @description The execute method processes an incoming HTTP request and returns a ResponseDto that can either be a successful response or an error response. This allows for flexible middleware implementations that can either modify the request, perform side effects, or generate a response directly.
   * @param path The path of the incoming HTTP request. This allows middleware to perform actions based on the request path, such as routing, logging, or applying specific middleware logic.
   * @param request The incoming HTTP request that the middleware will process. This object typically contains information such as the request method, URL, headers, body, and other relevant data needed for processing.
   * @param next A callback function that, when invoked, will pass control to the next middleware in the chain or to the final request handler. This allows for a composable middleware architecture where multiple middleware components can be chained together to process a request.
   * @returns A Promise that resolves to a ResponseDto containing either a successful response or an error response. The ResponseDto allows for handling both success and error cases in a consistent manner.
   *
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  execute<T>(
    req: { method: HttpMethod; path: string },
    headers: THeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>>
}
