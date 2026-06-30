import type { ExecutionContext, IModule, IServiceContainer } from '@/domain'

/**
 * @description ContextModule is responsible for configuring and registering the necessary services and dependencies related to the request context in the application. It sets up the RequestContext service, which provides a way to manage and access contextual information related to a specific request or operation. By registering the RequestContext in the dependency injection container, it enables other parts of the application to easily resolve and utilize its functionality for managing request-specific data and state.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export class ContextModule implements IModule {
  async configure(container: IServiceContainer): Promise<void> {
    const { INJECTION_TOKENS } = await import('../di')

    const { NodeRequestContextFactory } = await import('../factories/request-context.factory')
    container.addSingletonFactory(INJECTION_TOKENS.REQUEST_CONTEXT, () =>
      new NodeRequestContextFactory<ExecutionContext>().create(),
    )
  }
}
