import type { Identity } from './identity-context.types'
import type { NetworkContext } from './network-context.types'
import type { TracingContext } from './tracing-context.types'

/**
 * @description RequestContext defines the structure for the context of a request execution, which includes the identity of the user or system executing the request, the network context for tracing and logging purposes, and the tracing context for distributed tracing across services. This context is essential for ensuring proper authentication, authorization, and observability in a distributed system.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export interface RequestContext {
  /** The identity of the user or system executing the request, which can be used for authentication and authorization purposes.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  readonly identity: Identity
  /** The network context of the request, which includes information such as the client's IP address and request ID for tracing purposes.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  readonly network: NetworkContext
  /** The tracing context of the request, which includes information for distributed tracing and correlation across services.
   *
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5
   */
  readonly tracing: TracingContext
}
