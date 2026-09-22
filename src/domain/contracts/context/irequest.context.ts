/**
 * @fileoverview Defines the IRequestContext interface for managing user identity context within the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */

import type { IBaseAccessor, Identity, Optional } from '@xeno-js/shared'

import type { ApplicationRegistry } from '../../registries'
import type { IServiceScope } from '../container'

/**
 * An interface for managing user identity context within the application. This interface provides methods for executing asynchronous functions with the current user's identity context and retrieving the current user's identity information. It allows for seamless integration of identity management into various parts of the application, ensuring that identity-related data is properly propagated and accessible when needed.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface IRequestContext<TCtx, TRegistry extends ApplicationRegistry = ApplicationRegistry>
  extends IBaseAccessor<TCtx>, IServiceScopeAccessor<TRegistry> {
  /**
   * Executes the provided asynchronous function with the current user's identity context. This allows the function to access identity information such as user ID, roles, and correlation ID while performing its operations. The function will be executed within the scope of the current request's identity, ensuring that any identity-related data is properly propagated throughout the execution flow.
   * @param ctx The current user's identity context.
   * @param fn An asynchronous function that takes the current user's identity as an argument and returns a promise of type T. This function will be executed with the identity context of the current request.
   * @returns A promise that resolves to the result of the provided function, allowing the caller to handle the outcome of the operation performed within the identity context.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  runAsync<T = unknown>(ctx: TCtx, fn: () => Promise<T>): Promise<T>

  updateIdentity(identity: Identity): void
}

/**
 * @description The IIdentityAccessor interface is a contract that defines the structure and behavior of an identity accessor within the application. It provides a method for retrieving the current user's identity information, including user ID, roles, and correlation ID. This interface is essential for managing user identity and ensuring that identity-related data is accessible when needed.
 *
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export interface IServiceScopeAccessor<
  TRegistry extends ApplicationRegistry<unknown> = ApplicationRegistry<unknown>,
> {
  /**
   * Retrieves the current service scope, which allows for managing dependencies during the execution of a request. This method enables access to the service scope, ensuring that services are properly scoped and disposed of after the request is processed.
   * @returns An object representing the current service scope, allowing for resolution of dependencies and management of services during the execution of a request.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  getScope(): Optional<IServiceScope<TRegistry>>
}
