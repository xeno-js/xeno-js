import type { ExecutionContext, IMiddleware, IModule, IServiceContainer } from '@/domain'
import type { HttpHeaders } from '@/shared'

/**
 * @description MiddlewareModule is responsible for registering essential services and middlewares that are fundamental to the application's operation. This includes setting up the logging infrastructure and the request context middleware. By implementing the IModule interface, MiddlewareModule can be easily integrated into the application's dependency injection container, allowing it to configure necessary services and middlewares during the application startup phase.
 */
export class MiddlewareModule implements IModule {
  async configure(container: IServiceContainer): Promise<void> {
    const { INJECTION_TOKENS } = await import('@/infrastructure/di')
    const { NodeRequestContextFactory } = await import('@/infrastructure/factories')
    container.addSingletonFactory(INJECTION_TOKENS.REQUEST_CONTEXT, () => {
      const factory = new NodeRequestContextFactory<ExecutionContext>()
      return factory.create()
    })

    const { NoAuthGateKeeper } = await import('@/application/gate_keepers')
    container.addSingleton(INJECTION_TOKENS.GATE_KEEPER, NoAuthGateKeeper, [])

    const { BearerTokenExtractor } = await import('@/infrastructure/services/extractors')
    container.addSingleton(INJECTION_TOKENS.BEARER_TOKEN_EXTRACTOR, BearerTokenExtractor, [])
    const { HttpHeaderExtractor } = await import('@/infrastructure/services/extractors')
    container.addSingleton(INJECTION_TOKENS.SERVICE_EXTRACTOR, HttpHeaderExtractor, [
      INJECTION_TOKENS.BEARER_TOKEN_EXTRACTOR,
    ])

    const { RequestContextMiddleware } = await import('@/presentation/middlewares')
    container.addSingleton<IMiddleware<HttpHeaders>>(
      INJECTION_TOKENS.MIDDLEWARE,
      RequestContextMiddleware,
      [
        INJECTION_TOKENS.REQUEST_CONTEXT,
        INJECTION_TOKENS.SERVICE_EXTRACTOR,
        INJECTION_TOKENS.GATE_KEEPER,
        INJECTION_TOKENS.SERVICE_CONTAINER,
      ],
    )
  }
}
