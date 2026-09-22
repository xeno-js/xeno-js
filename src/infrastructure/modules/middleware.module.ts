import { Guards, type HttpHeaders, type IGateKeeper, type IMiddleware } from '@xeno-js/shared'

import type { IModule, IServiceContainer, MiddlewareConfig } from '@/domain'

import type { XenoRegistry } from '../xeno-registry'

/**
 * @description MiddlewareModule is responsible for registering essential services and middlewares that are fundamental to the application's operation. This includes setting up the logging infrastructure and the request context middleware. By implementing the IModule interface, MiddlewareModule can be easily integrated into the application's dependency injection container, allowing it to configure necessary services and middlewares during the application startup phase.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export class MiddlewareModule<TRegistry extends XenoRegistry = XenoRegistry> implements IModule<
  TRegistry,
  MiddlewareConfig & { isAuth: boolean; isLogger: boolean; isCache: boolean }
> {
  async configure(
    container: IServiceContainer<TRegistry>,
    opts: MiddlewareConfig & { isAuth: boolean; isLogger: boolean; isCache: boolean },
  ): Promise<void> {
    const { TOKENS } = await import('@xeno-js/shared')

    if (!opts.isAuth) {
      const { NoAuthGateKeeper } = await import('@/application')
      container.addSingleton(TOKENS.GATE_KEEPER, (): IGateKeeper => new NoAuthGateKeeper())
    }

    if (opts.isSSR) {
      const { SupabaseSsrTokenExtractor } = await import('../services')
      container.addSingleton(TOKENS.BEARER_TOKEN_EXTRACTOR, () => new SupabaseSsrTokenExtractor())
    } else {
      const { BearerTokenExtractor } = await import('../services')
      container.addSingleton(TOKENS.BEARER_TOKEN_EXTRACTOR, () => new BearerTokenExtractor())
    }
    const { HttpHeaderExtractor } = await import('../services')
    container.addSingleton(
      TOKENS.SERVICE_EXTRACTOR,
      (c) =>
        new HttpHeaderExtractor(c.resolve(TOKENS.BEARER_TOKEN_EXTRACTOR), opts.trustedIpHeader),
    )

    if (!opts.isLogger) {
      const { LoggerUtils } = await import('./utils/logger.utils')
      await LoggerUtils.addLogger(container, undefined)
    }

    const middlewares: (keyof TRegistry)[] = [TOKENS.REQUEST_CONTEXT_MIDDLEWARE]

    const { RequestContextMiddleware } = await import('@/presentation')
    container.addSingleton(
      TOKENS.REQUEST_CONTEXT_MIDDLEWARE,
      (c) =>
        new RequestContextMiddleware(
          c.resolve(TOKENS.REQUEST_CONTEXT),
          c.resolve(TOKENS.SERVICE_EXTRACTOR),
          c.resolve(TOKENS.LOGGER),
        ),
    )

    if (opts.optionsMiddleware) {
      const { OptionsMiddleware } = await import('@/presentation')
      container.addSingleton(
        TOKENS.OPTIONS_MIDDLEWARE,
        (c) => new OptionsMiddleware(c.resolve(TOKENS.NETWORK_CONTEXT_ACCESSOR)),
      )
      middlewares.push(TOKENS.OPTIONS_MIDDLEWARE)
    }

    if (!Guards.isNullOrEmpty(opts.allowOrigins)) {
      const { AllowOrigin } = await import('../services')
      container.addSingleton('ALLOW_ORIGIN', () => {
        return new AllowOrigin(opts.allowOrigins!)
      })

      const { AllowOriginMiddleware } = await import('@/presentation')
      container.addSingleton(TOKENS.ALLOW_ORIGIN_MIDDLEWARE, (c) => {
        return new AllowOriginMiddleware(
          c.resolve(TOKENS.ALLOW_ORIGIN),
          c.resolve(TOKENS.CONTEXT_ACCESSOR),
          c.resolve(TOKENS.LOGGER),
        )
      })
      middlewares.push(TOKENS.ALLOW_ORIGIN_MIDDLEWARE)
    }

    if (opts.cors) {
      const { CORSMiddleware } = await import('@/presentation')
      container.addSingleton(TOKENS.CORS_MIDDLEWARE, (c) => {
        return new CORSMiddleware(c.resolve(TOKENS.CONTEXT_ACCESSOR))
      })
      middlewares.push(TOKENS.CORS_MIDDLEWARE)
    }

    if (Guards.isDefined(opts.routeRegistry)) {
      const registry = opts.routeRegistry
      const { AllowMethodFactory } = await import('../factories')
      container.addSingleton(TOKENS.ALLOW_METHOD, () => new AllowMethodFactory().create(registry))

      const { MethodCheckMiddleware } = await import('@/presentation')
      container.addSingleton(
        TOKENS.METHOD_CHECK_MIDDLEWARE,
        (c) =>
          new MethodCheckMiddleware(
            c.resolve(TOKENS.REQUEST_CONTEXT),
            c.resolve(TOKENS.ALLOW_METHOD),
          ),
      )
      middlewares.push(TOKENS.METHOD_CHECK_MIDDLEWARE)
    }

    if (Guards.isDefined(opts.csrf)) {
      const csrf = opts.csrf
      const { CsrfMiddleware } = await import('@/presentation')
      container.addSingleton(TOKENS.CSRF_MIDDLEWARE, (c) => {
        return new CsrfMiddleware(c.resolve(TOKENS.REQUEST_CONTEXT), csrf)
      })
      middlewares.push(TOKENS.CSRF_MIDDLEWARE)
    }

    if (
      Guards.isDefined(opts.rateLimite.maxRequests) ||
      Guards.isDefined(opts.rateLimite.windowSeconds)
    ) {
      const maxRequests = opts.rateLimite.maxRequests ?? 30
      Guards.throwIfNegative(maxRequests, 'MaxRequests must be positive')
      Guards.throwIfNotInteger(maxRequests, 'MaxRequests must be an integer')
      const windowSeconds = opts.rateLimite.windowSeconds ?? 30
      Guards.throwIfNegative(windowSeconds, 'WindowSeconds must be positive')
      Guards.throwIfNotInteger(windowSeconds, 'WindowSeconds must be an integer')

      if (!opts.isCache) {
        const { CacheUtils } = await import('./utils/cache.utils')
        await CacheUtils.addCache(container, { inMemory: true, redis: undefined })
      }

      const { RateLimitMiddleware } = await import('@/presentation')
      container.addSingleton(TOKENS.RATE_LIMITER_MIDDLEWARE, (c) => {
        return new RateLimitMiddleware(
          c.resolve(TOKENS.CONTEXT_ACCESSOR),
          c.resolve(TOKENS.CACHE),
          c.resolve(TOKENS.LOGGER),
          {
            maxRequests,
            windowSeconds,
          },
        )
      })
      middlewares.push(TOKENS.RATE_LIMITER_MIDDLEWARE)
    }

    const { AuthenticationMiddleware } = await import('@/presentation')
    container.addSingleton(TOKENS.AUTH_MIDDLEWARE, (c) => {
      return new AuthenticationMiddleware(
        c.resolve(TOKENS.REQUEST_CONTEXT),
        c.resolve(TOKENS.BEARER_TOKEN_EXTRACTOR),
        c.resolve(TOKENS.GATE_KEEPER),
        c.resolve(TOKENS.LOGGER),
      )
    })
    middlewares.push(TOKENS.AUTH_MIDDLEWARE)

    const { CompositeMiddleware } = await import('@/presentation')
    container.addSingleton(TOKENS.MIDDLEWARE, (c) => {
      const resolvedMiddleware = middlewares.map(
        (token) => c.resolve(token) as IMiddleware<HttpHeaders>,
      )
      return new CompositeMiddleware(resolvedMiddleware)
    })
  }
}
