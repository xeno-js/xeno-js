/**
 * @fileoverview IController defines the interface for controllers in the application. A controller is responsible for handling incoming requests, processing them, and returning appropriate responses. The IController interface ensures that all controllers adhere to a consistent structure, making it easier to manage and maintain the application's request handling logic. Each controller must implement the handle method, which takes an incoming request and returns a response, typically as a promise to accommodate asynchronous operations.
 */
export interface IController {
  /**
   * Handles an incoming request and returns a response.
   * @param request - The incoming request object.
   * @returns A promise that resolves to the response object.
   */
  handle(request: unknown): Promise<unknown>
}
