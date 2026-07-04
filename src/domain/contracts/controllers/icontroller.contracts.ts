import type { ResponseDto } from '@/shared'

/**
 * @fileoverview IController defines the interface for controllers in the application. A controller is responsible for handling incoming requests, processing them, and returning appropriate responses. The IController interface ensures that all controllers adhere to a consistent structure, making it easier to manage and maintain the application's request handling logic. Each controller must implement the handle method, which takes an incoming request and returns a response, typically as a promise to accommodate asynchronous operations.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IController<TRequest = unknown, TResponse = unknown> {
  /**
   * Handles an incoming request and returns a response.
   * @param request - The incoming request object.
   * @returns A promise that resolves to a ResponseDto containing the response object.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  handle(request: TRequest): Promise<ResponseDto<TResponse>>
}
