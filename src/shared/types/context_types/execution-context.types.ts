import type { Identity, NetworkContext, TracingContext } from './index'

/**
 * @description ExecutionContext defines the structure for the context of a request execution, which includes the identity of the user or system executing the request, the network context for tracing and logging purposes, and the tracing context for distributed tracing across services. This context is essential for ensuring proper authentication, authorization, and observability in a distributed system.
 */
export interface ExecutionContext {
  /** The identity of the user or system executing the request, which can be used for authentication and authorization purposes. */
  readonly identity: Identity
  /** The network context of the request, which includes information such as the client's IP address and request ID for tracing purposes. */
  readonly network: NetworkContext
  /** The tracing context of the request, which includes information for distributed tracing and correlation across services. */
  readonly tracing: TracingContext
}
