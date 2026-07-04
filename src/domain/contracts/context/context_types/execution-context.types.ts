/**
 * @description This file defines the types for the execution context used in the application. The execution context includes the request context, which contains information about the identity of the user or system executing the request, as well as network and tracing contexts for observability. Additionally, it includes a service scope for managing dependencies during the execution of a request.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */

import type { IServiceScope } from '../../container/iservice-scope.contracts'
import type { RequestContext } from './index'

/**
 * The ExecutionContext interface represents the context of a request execution, encapsulating the request context and the service scope. The request context contains information about the identity of the user or system executing the request, as well as network and tracing contexts for observability. The service scope allows for managing dependencies during the execution of a request, ensuring that services are properly scoped and disposed of after the request is processed.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface ExecutionContext {
  /** The request context containing information about the identity, network, and tracing contexts for the current request execution.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  context: RequestContext
  /** The service scope for managing dependencies during the execution of a request. This allows for proper scoping and disposal of services after the request is processed.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  scope: IServiceScope
}
