import type { IGateKeeper, IModule, IServiceContainer } from '@xeno-js/shared'

import type { XenoRegistry } from '../xeno-registry'

/**
 * @description MiddlewareModule is responsible for registering essential services and middlewares that are fundamental to the application's operation. This includes setting up the logging infrastructure and the request context middleware. By implementing the IModule interface, MiddlewareModule can be easily integrated into the application's dependency injection container, allowing it to configure necessary services and middlewares during the application startup phase.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class MiddlewareModule<TRegistry extends XenoRegistry = XenoRegistry> implements IModule<
  TRegistry,
  { isAuth: boolean; isLogger: boolean }
> {
  async configure(
    container: IServiceContainer<TRegistry>,
    opts: { isAuth: boolean; isLogger: boolean },
  ): Promise<void> {
    const { TOKENS } = await import('@xeno-js/shared')

    if (!opts.isAuth) {
      const { NoAuthGateKeeper } = await import('@/application')
      container.addSingleton(TOKENS.GATE_KEEPER, (): IGateKeeper => new NoAuthGateKeeper())
    }

    const { BearerTokenExtractor } = await import('../services/extractors/extract-bearer.extractor')
    container.addSingleton(TOKENS.BEARER_TOKEN_EXTRACTOR, () => new BearerTokenExtractor())
    const { HttpHeaderExtractor } = await import('../services/extractors/http-header.extractor')
    container.addSingleton(
      TOKENS.SERVICE_EXTRACTOR,
      (c) => new HttpHeaderExtractor(c.resolve(TOKENS.BEARER_TOKEN_EXTRACTOR)),
    )

    if (!opts.isLogger) {
      const { LoggerUtils } = await import('./utils/logger.utils')
      await LoggerUtils.addLogger(container, undefined)
    }

    const { RequestContextMiddleware } = await import('@/presentation')
    container.addSingleton(
      TOKENS.MIDDLEWARE,
      (c) =>
        new RequestContextMiddleware(
          c.resolve(TOKENS.REQUEST_CONTEXT),
          c.resolve(TOKENS.SERVICE_EXTRACTOR),
          c.resolve(TOKENS.GATE_KEEPER),
          c.resolve(TOKENS.LOGGER),
        ),
    )
  }
}
