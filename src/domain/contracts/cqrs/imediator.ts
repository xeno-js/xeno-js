import type { ResultType } from '@/domain'
import type { ICommand, IQuery } from '@/domain'

/**
 * An interface representing a mediator in the CQRS (Command Query Responsibility Segregation) pattern. The mediator is responsible for sending commands and executing queries by delegating them to the appropriate handlers.
 */
export interface IMediator {
  /**
   * Sends a command to the appropriate handler and returns a response.
   * @param request The command object to be executed.
   * @returns A promise that resolves to the response from the handler.
   */
  send<TResponse>(request: ICommand<TResponse>): Promise<ResultType<TResponse>>

  /**
   * Executes a query and returns the result.
   * @param request The query object to be executed.
   * @returns A promise that resolves to the result of the query.
   */
  query<TResponse>(request: IQuery<TResponse>): Promise<ResultType<TResponse>>
}
