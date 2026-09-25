import type { IModule, IServiceContainer } from '@/domain'

import type { XenoRegistry } from '../xeno-registry'

/**
 * @description ContextModule is responsible for configuring and registering the necessary services and dependencies related to the request context in the application. It sets up the RequestContext service, which provides a way to manage and access contextual information related to a specific request or operation. By registering the RequestContext in the dependency injection container, it enables other parts of the application to easily resolve and utilize its functionality for managing request-specific data and state.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export class ContextModule<TRegistry extends XenoRegistry = XenoRegistry> implements IModule<
  TRegistry,
  void
> {
  async configure(container: IServiceContainer<TRegistry>): Promise<void> {
    const { TOKENS } = await import('@xeno-js/shared')
    const { ServiceScopeFactory } = await import('../factories/service-scope.factory')

    const { NodeRequestContextFactory } = await import('../factories/request-context.factory')
    const requestContext = new NodeRequestContextFactory<TRegistry>(
      new ServiceScopeFactory<TRegistry>(container),
    ).create()

    container.addSingleton(TOKENS.REQUEST_CONTEXT, () => requestContext)
    container.addSingleton(TOKENS.CONTEXT_ACCESSOR, () => requestContext)
    container.addSingleton(TOKENS.IDENTITY_ACCESSOR, () => requestContext)
    container.addSingleton(TOKENS.SERVICE_SCOPE_ACCESSOR, () => requestContext)
    container.addSingleton(TOKENS.NETWORK_CONTEXT_ACCESSOR, () => requestContext)

    const { UserContextFactory } = await import('../factories/user-context.factory')
    container.addSingleton('USER_CONTEXT_FACTORY', () => {
      return new UserContextFactory(requestContext)
    })
  }
}
