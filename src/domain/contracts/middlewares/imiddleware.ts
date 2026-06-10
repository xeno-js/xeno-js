/**
 * @description The IMiddleware interface defines the contract for middleware components that process incoming HTTP requests. Implementing classes must provide an execute method that takes an HttpRequest as input and returns a Promise of a ResultType, which can either be void (indicating successful processing without a response) or an HttpResponse (indicating that the middleware has generated a response to be sent back to the client). This design allows for flexible middleware implementations that can perform various tasks such as authentication, logging, request transformation, or response generation.
 */
export interface IMiddleware<TRequest = unknown> {
  /**
   * @description The execute method processes an incoming HTTP request and returns a ResultType that can either be a void (indicating successful processing without a response) or an HttpResponse (indicating that the middleware has generated a response to be sent back to the client). This allows for flexible middleware implementations that can either modify the request, perform side effects, or generate a response directly.
   * @param request The incoming HTTP request that the middleware will process. This object typically contains information such as the request method, URL, headers, body, and other relevant data needed for processing.
   * @returns A Promise that resolves to a ResultType containing either void (indicating successful processing without a response) or an HttpResponse (indicating that the middleware has generated a response to be sent back to the client). The ResultType allows for handling both success and error cases in a consistent manner.
   */
  execute<T>(req: TRequest, next: () => Promise<T>): Promise<T>
}
