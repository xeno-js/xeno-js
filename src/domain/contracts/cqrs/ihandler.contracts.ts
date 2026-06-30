import type { ResultType } from '../../results/result.types'

/**
 * An interface representing a handler for processing requests in a CQRS (Command Query Responsibility Segregation) pattern.
 * This interface defines a method for handling a request and returning a response, which can be used for both commands and queries.
 * @template TRequest - The type of the request that the handler will process.
 * @template TResponse - The type of the response that the handler will return after processing the request.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export interface IHandler<TRequest, TResponse> {
  /**
   * Handles a request and returns a response. This method is asynchronous and returns a Promise.
   * @param request - The request to be handled, of type TRequest.
   * @returns A Promise that resolves to a response of type TResponse.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  handle(request: TRequest): Promise<ResultType<TResponse>>
}
