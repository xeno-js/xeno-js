import { type Identity } from './index'

/**
 * @fileoverview Defines the IRequestIdentity interface for managing user identity context within the application.
 */

/**
 * An interface for managing user identity context within the application. This interface provides methods for executing asynchronous functions with the current user's identity context and retrieving the current user's identity information. It allows for seamless integration of identity management into various parts of the application, ensuring that identity-related data is properly propagated and accessible when needed.
 */
export interface IRequestIdentity {
  /**
   * Executes the provided asynchronous function with the current user's identity context. This allows the function to access identity information such as user ID, roles, and correlation ID while performing its operations. The function will be executed within the scope of the current request's identity, ensuring that any identity-related data is properly propagated throughout the execution flow.
   * @param fn An asynchronous function that takes the current user's identity as an argument and returns a promise of type T. This function will be executed with the identity context of the current request.
   * @returns A promise that resolves to the result of the provided function, allowing the caller to handle the outcome of the operation performed within the identity context.
   */
  runAsync<T>(fn: (identity: Identity) => Promise<T>): Promise<T>

  /**
   * Retrieves the current user's identity information, including user ID, roles, and correlation ID. This method can be used to access identity data outside of the context of an asynchronous function, allowing for synchronous access to identity information when needed.
   * @returns An object representing the current user's identity, containing properties such as user ID, roles, and correlation ID. This information can be used for authentication and authorization purposes throughout the application.
   */
  getIdentity(): Identity
}
