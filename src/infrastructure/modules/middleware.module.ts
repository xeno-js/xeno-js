import type { ExecutionContext, IMiddleware, IModule, IServiceContainer } from '@/domain'
import type { HttpHeaders } from '@/shared'

/**
 * @description MiddlewareModule is responsible for registering essential services and middlewares that are fundamental to the application's operation. This includes setting up the logging infrastructure and the request context middleware. By implementing the IModule interface, MiddlewareModule can be easily integrated into the application's dependency injection container, allowing it to configure necessary services and middlewares during the application startup phase.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export class MiddlewareModule implements IModule {
  async configure(container: IServiceContainer): Promise<void> {
    const { INJECTION_TOKENS } = await import('../di/injection-tokens.constants')

    const { NodeRequestContextFactory } = await import('../factories/request-context.factory')
    container.addSingletonFactory(INJECTION_TOKENS.REQUEST_CONTEXT, () => {
      const factory = new NodeRequestContextFactory<ExecutionContext>()
      return factory.create()
    })

    const { NoAuthGateKeeper } = await import('@/application')
    container.addSingleton(INJECTION_TOKENS.GATE_KEEPER, NoAuthGateKeeper, [])

    const { BearerTokenExtractor } = await import('../services/extractors/extract-bearer.extractor')
    container.addSingleton(INJECTION_TOKENS.BEARER_TOKEN_EXTRACTOR, BearerTokenExtractor, [])
    const { HttpHeaderExtractor } = await import('../services/extractors/http-header.extractor')
    container.addSingleton(INJECTION_TOKENS.SERVICE_EXTRACTOR, HttpHeaderExtractor, [
      INJECTION_TOKENS.BEARER_TOKEN_EXTRACTOR,
    ])
    const { ServiceScopeFactory } = await import('../factories/service-scope.factory')
    container.addSingletonFactory(INJECTION_TOKENS.SERVICE_SCOPE_FACTORY, () => {
      const factory = new ServiceScopeFactory(container)
      return factory
    })

    const { RequestContextMiddleware } = await import('@/presentation')
    container.addSingleton<IMiddleware<HttpHeaders>>(
      INJECTION_TOKENS.MIDDLEWARE,
      RequestContextMiddleware,
      [
        INJECTION_TOKENS.REQUEST_CONTEXT,
        INJECTION_TOKENS.SERVICE_EXTRACTOR,
        INJECTION_TOKENS.GATE_KEEPER,
        INJECTION_TOKENS.SERVICE_SCOPE_FACTORY,
      ],
    )
  }
}
