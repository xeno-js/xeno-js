import type { ResponseDto } from '@/shared'

/**
 * @description The IMiddleware interface defines the contract for middleware components that process incoming HTTP requests. Implementing classes must provide an execute method that takes an HttpRequest as input and returns a Promise of a ResponseDto, which can either be a successful response or an error response. This design allows for flexible middleware implementations that can perform various tasks such as authentication, logging, request transformation, or response generation.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export interface IMiddleware<TRequest = unknown> {
  /**
   * @description The execute method processes an incoming HTTP request and returns a ResponseDto that can either be a successful response or an error response. This allows for flexible middleware implementations that can either modify the request, perform side effects, or generate a response directly.
   * @param request The incoming HTTP request that the middleware will process. This object typically contains information such as the request method, URL, headers, body, and other relevant data needed for processing.
   * @returns A Promise that resolves to a ResponseDto containing either a successful response or an error response. The ResponseDto allows for handling both success and error cases in a consistent manner.
  
   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
  execute<T>(req: TRequest, next: () => Promise<ResponseDto<T>>): Promise<ResponseDto<T>>
}
