import type { ResultType } from '../../results/result.types'

/**
 * @description Interface that defines the contract for a strategy used in the authorization pipeline. Each strategy must implement the isApplicable method to determine if it should be applied to a given request, and the execute method to perform the necessary authorization checks. The execute method returns a ResultType indicating whether the authorization was successful or if it failed, allowing the pipeline to handle the outcome accordingly.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface IStrategy<TInput, TResult = void> {
  /**
   * @description Executes the strategy's logic for the given context. This method is called by the authorization pipeline when a strategy is deemed applicable. The implementation of this method should perform the necessary checks to determine if the request is authorized, and return a ResultType indicating the outcome of the authorization process. The ResultType should indicate success if the authorization checks pass, or contain an error if the checks fail, allowing the pipeline to handle the result accordingly.
   * @param context - The context for which the strategy should be executed, which can be of any type depending on the specific implementation of the strategy. This could include the request object, user information, or any other relevant data needed to perform the authorization checks.
   * @returns A Promise that resolves to a ResultType indicating the outcome of the strategy's execution. The ResultType should indicate success if the authorization checks pass, or contain an error if the checks fail, allowing the pipeline to handle the result accordingly.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  execute(context: TInput): Promise<ResultType<TResult>>
}
