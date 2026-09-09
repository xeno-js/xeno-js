import type { IFactory, IModule, IServiceContainer, IServiceScope } from '@xeno-js/shared'

import type { XenoRegistry } from '../xeno-registry'

/**
 * @description ContextModule is responsible for configuring and registering the necessary services and dependencies related to the request context in the application. It sets up the RequestContext service, which provides a way to manage and access contextual information related to a specific request or operation. By registering the RequestContext in the dependency injection container, it enables other parts of the application to easily resolve and utilize its functionality for managing request-specific data and state.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class ContextModule<TRegistry extends XenoRegistry = XenoRegistry> implements IModule<
  TRegistry,
  void
> {
  async configure(container: IServiceContainer<TRegistry>): Promise<void> {
    const { TOKENS } = await import('@xeno-js/shared')
    const { ServiceScopeFactory } = await import('../factories/service-scope.factory')
    container.addSingleton(TOKENS.SERVICE_SCOPE_FACTORY, () => {
      const factory = new ServiceScopeFactory<TRegistry>(container)
      return factory
    })

    const { NodeRequestContextFactory } = await import('../factories/request-context.factory')
    container.addSingleton(TOKENS.REQUEST_CONTEXT, (c) => {
      return new NodeRequestContextFactory<TRegistry>(
        c.resolve(TOKENS.SERVICE_SCOPE_FACTORY) as IFactory<void, IServiceScope<TRegistry>>,
      ).create()
    })

    container.addSingleton(TOKENS.CONTEXT_ACCESSOR, (c) => c.resolve(TOKENS.REQUEST_CONTEXT))
    container.addSingleton(TOKENS.IDENTITY_ACCESSOR, (c) => c.resolve(TOKENS.REQUEST_CONTEXT))
    container.addSingleton(TOKENS.SERVICE_SCOPE_ACCESSOR, (c) => c.resolve(TOKENS.REQUEST_CONTEXT))
    container.addSingleton(TOKENS.NETWORK_CONTEXT_ACCESSOR, (c) =>
      c.resolve(TOKENS.REQUEST_CONTEXT),
    )
    const { UserContextFactory } = await import('../factories/user-context.factory')
    container.addSingleton(TOKENS.USER_CONTEXT_FACTORY, (c) => {
      const requestContext = c.resolve(TOKENS.REQUEST_CONTEXT)
      return new UserContextFactory(requestContext)
    })
  }
}
