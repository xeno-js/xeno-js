import type { ResultType } from '../../results/result.types'
import type { ICommand } from './cqrs_types/icommand.types'
import type { IQuery } from './cqrs_types/iquery.types'

/**
 * An interface representing a mediator in the CQRS (Command Query Responsibility Segregation) pattern. The mediator is responsible for sending commands and executing queries by delegating them to the appropriate handlers.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface IMediator {
  /**
   * Sends a command to the appropriate handler and returns a response.
   * @param request The command object to be executed.
   * @returns A promise that resolves to the response from the handler.
  
   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  send<TResponse>(request: ICommand<TResponse>): Promise<ResultType<TResponse>>

  /**
   * Executes a query and returns the result.
   * @param request The query object to be executed.
   * @returns A promise that resolves to the result of the query.
  
   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  query<TResponse>(request: IQuery<TResponse>): Promise<ResultType<TResponse>>
}
