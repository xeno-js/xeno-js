import type { Optional } from '@/shared'

import type { ApplicationRegistry } from '../../config'
import type { IServiceScope } from '../container'
import type { Identity, NetworkContext } from './context_types'

/**
 * @fileoverview Defines the IRequestContext interface for managing user identity context within the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
/**
 * An interface for managing user identity context within the application. This interface provides methods for executing asynchronous functions with the current user's identity context and retrieving the current user's identity information. It allows for seamless integration of identity management into various parts of the application, ensuring that identity-related data is properly propagated and accessible when needed.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface IRequestContext<TCtx, TRegistry extends ApplicationRegistry = ApplicationRegistry>
  extends
    IContextAccessor<TCtx>,
    IIdentityAccessor,
    IServiceScopeAccessor<TRegistry>,
    INetworkContextAccessor {
  /**
   * Executes the provided asynchronous function with the current user's identity context. This allows the function to access identity information such as user ID, roles, and correlation ID while performing its operations. The function will be executed within the scope of the current request's identity, ensuring that any identity-related data is properly propagated throughout the execution flow.
   * @param ctx The current user's identity context.
   * @param fn An asynchronous function that takes the current user's identity as an argument and returns a promise of type T. This function will be executed with the identity context of the current request.
   * @returns A promise that resolves to the result of the provided function, allowing the caller to handle the outcome of the operation performed within the identity context.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  runAsync<T = unknown>(ctx: TCtx, fn: () => Promise<T>): Promise<T>
}

/**
 * @description The IRequestContext interface is a contract that defines the structure and behavior of a request context within the application. It provides methods for executing asynchronous functions with the current user's identity context and retrieving the current user's identity information. This interface is essential for managing user identity and ensuring that identity-related data is properly propagated throughout the application.
 *
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface IIdentityAccessor {
  /**
   * Retrieves the current user's identity information, including user ID, roles, and correlation ID. This method can be used to access identity data outside of the context of an asynchronous function, allowing for synchronous access to identity information when needed.
   * @returns An object representing the current user's identity, containing properties such as user ID, roles, and correlation ID. This information can be used for authentication and authorization purposes throughout the application.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  getIdentity(): Optional<Identity>
}

/**
 * @description The IIdentityAccessor interface is a contract that defines the structure and behavior of an identity accessor within the application. It provides a method for retrieving the current user's identity information, including user ID, roles, and correlation ID. This interface is essential for managing user identity and ensuring that identity-related data is accessible when needed.
 *
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
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
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  getScope(): Optional<IServiceScope<TRegistry>>
}

/**
 * @description The IServiceScopeAccessor interface is a contract that defines the structure and behavior of a service scope accessor within the application. It provides a method for retrieving the current service scope, which allows for managing dependencies during the execution of a request. This interface is essential for ensuring that services are properly scoped and disposed of after the request is processed.
 *
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface IContextAccessor<TCtx> {
  /**
   * Retrieves the current context, which can include information about the identity of the user or system executing the request, as well as network and tracing contexts for observability. This method allows for synchronous access to context-related data when needed.
   * @returns An object representing the current context, containing properties such as identity, network, and tracing contexts. This information can be used for managing execution context and ensuring that context-related data is accessible when needed.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  getContext(): Optional<TCtx>
}

/**
 * @description The IContextAccessor interface is a contract that defines the structure and behavior of a context accessor within the application. It provides a method for retrieving the current context, which can include information about the identity of the user or system executing the request, as well as network and tracing contexts for observability. This interface is essential for managing execution context and ensuring that context-related data is accessible when needed.
 *
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface INetworkContextAccessor {
  /**
   * Retrieves the current network context, which can include information about the request ID, correlation ID, and other network-related data. This method allows for synchronous access to network context-related data when needed.
   * @returns An object representing the current network context, containing properties such as request ID, correlation ID, and other network-related data. This information can be used for managing execution context and ensuring that network context-related data is accessible when needed.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  getNetworkContext(): Optional<NetworkContext>
}
