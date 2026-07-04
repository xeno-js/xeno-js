import type { Maybe } from '@/shared'

import type { Identity } from './identity-context.types'
import type { MessagingContext } from './messaging-context.types'
import type { NetworkContext } from './network-context.types'
import type { TracingContext } from './tracing-context.types'

/**
 * @description RequestContext defines the structure for the context of a request execution, which includes the identity of the user or system executing the request, the network context for tracing and logging purposes, and the tracing context for distributed tracing across services. This context is essential for ensuring proper authentication, authorization, and observability in a distributed system.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface RequestContext {
  /** The identity of the user or system executing the request, which can be used for authentication and authorization purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly identity: Identity
  /** The network context of the request, which includes information such as the client's IP address and request ID for tracing purposes.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly network: NetworkContext
  /** The tracing context of the request, which includes information for distributed tracing and correlation across services.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly tracing: TracingContext
  /** The messaging context of the request, which includes information related to messaging systems, such as return addresses and message expiration times. This context is useful for handling asynchronous communication and message-based workflows.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly messaging?: Maybe<MessagingContext>
}
