import type {
  Dictionary,
  HttpHeaders,
  HttpMethod,
  IMiddleware,
  IServiceExtractor,
  Optional,
} from '@xeno-js/shared'

import type { IAllowMethod, IModule, IServiceContainer, MiddlewareConfig } from '@/domain'

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
  MiddlewareConfig & {
    isAuth: boolean
  }
> {
  async configure(
    container: IServiceContainer<TRegistry>,
    opts: MiddlewareConfig & {
      isAuth: boolean
    },
  ): Promise<void> {
    const { Guards, TOKENS } = await import('@xeno-js/shared')

    const { HttpCookieExtractor } = await import('../services')
    const { HttpHeaderExtractor } = await import('../services')
    const tokenExtractor: IServiceExtractor<
      HttpHeaders,
      Optional<string>
    > = await this._getTokenExtractor(opts.isSSR)

    container.addSingleton(
      TOKENS.SERVICE_EXTRACTOR,
      () =>
        new HttpHeaderExtractor(
          tokenExtractor,
          new HttpCookieExtractor(),
          opts.trustedIpHeader,
          opts.csrf?.cookieName ?? '__Host-xeno-csrf',
        ),
    )

    const { ClientIpResolver } = await import('../services')

    const middlewares: IMiddleware<HttpHeaders>[] = []
    const requestContext = container.resolve(TOKENS.REQUEST_CONTEXT)
    const logger = container.resolve(TOKENS.LOGGER)

    const { RequestContextMiddleware } = await import('@/presentation')
    middlewares.push(
      new RequestContextMiddleware(
        requestContext,
        container.resolve(TOKENS.SERVICE_EXTRACTOR),
        new ClientIpResolver(opts.trustedProxies),
        logger,
      ),
    )

    if (!Guards.isNullOrEmpty(opts.allowOrigins)) {
      if (opts.withCredentials && opts.allowOrigins.includes('*'))
        throw new Error(
          'Wildcard CORS origin is not allowed when withCredentials is set to true in addHttpCore',
        )

      const { AllowOrigin } = await import('../services')
      const { AllowOriginMiddleware } = await import('@/presentation')
      middlewares.push(
        new AllowOriginMiddleware(new AllowOrigin(opts.allowOrigins), requestContext, logger),
      )
    }

    const withCredentials = opts.withCredentials ? 'true' : 'false'
    const allowMethod = await this._getAllowMethod(
      opts.optionsMiddleware || opts.cors,
      opts.routeRegistry,
    )

    if (opts.optionsMiddleware) {
      const { OptionsMiddleware } = await import('@/presentation')
      middlewares.push(
        new OptionsMiddleware(requestContext, allowMethod!, opts.allowHeaders, withCredentials),
      )
    }

    if (opts.cors) {
      const { CORSMiddleware } = await import('@/presentation')
      middlewares.push(new CORSMiddleware(requestContext, withCredentials))
    }

    if (Guards.isDefined(opts.routeRegistry)) {
      const { MethodCheckMiddleware } = await import('@/presentation')
      middlewares.push(new MethodCheckMiddleware(requestContext, allowMethod!))
    }

    const { AuthenticationMiddleware } = await import('@/presentation')
    if (!opts.isAuth) {
      const { NoAuthGateKeeper } = await import('@/application')
      middlewares.push(
        new AuthenticationMiddleware(
          requestContext,
          tokenExtractor,
          new NoAuthGateKeeper(),
          logger,
        ),
      )
    } else {
      const { ClaimsIdentityMapper } = await import('@/application')
      const { GateKeeper } = await import('@/application')
      middlewares.push(
        new AuthenticationMiddleware(
          requestContext,
          tokenExtractor,
          new GateKeeper(container.resolve(TOKENS.BASE_AUTH_SERVICE), new ClaimsIdentityMapper()),
          logger,
        ),
      )
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

      const { RateLimitKeyBuilder } = await import('../cache')
      const { RateLimitMiddleware } = await import('@/presentation')
      middlewares.push(
        new RateLimitMiddleware(
          requestContext,
          container.resolve(TOKENS.CACHE),
          new RateLimitKeyBuilder(requestContext),
          logger,
          { maxRequests, windowSeconds },
        ),
      )
    }

    if (Guards.isDefined(opts.csrf)) {
      const csrf = opts.csrf
      const { EdgeCryptoService } = await import('../services')
      container.addSingleton('CRYPTO_SERVICE', () => new EdgeCryptoService())

      const { CsrfTokenService } = await import('../services')
      container.addSingleton('CSRF_TOKEN_SERVICE', (c) => {
        return new CsrfTokenService(csrf.secret, c.resolve('CRYPTO_SERVICE'))
      })

      const { CsrfCookieMiddleware } = await import('@/presentation')
      middlewares.push(
        new CsrfCookieMiddleware(
          requestContext,
          container.resolve('CSRF_TOKEN_SERVICE'),
          opts.csrf,
        ),
      )

      const { CsrfMiddleware } = await import('@/presentation')
      middlewares.push(new CsrfMiddleware(requestContext, container.resolve('CSRF_TOKEN_SERVICE')))
    }

    const { CompositeMiddleware } = await import('@/presentation')
    container.addSingleton(TOKENS.MIDDLEWARE, () => {
      return new CompositeMiddleware(middlewares)
    })
  }

  private async _getTokenExtractor(
    isSSR: boolean,
  ): Promise<IServiceExtractor<HttpHeaders, Optional<string>>> {
    if (isSSR) {
      const { SupabaseSsrTokenExtractor } = await import('../services')
      return new SupabaseSsrTokenExtractor()
    } else {
      const { BearerTokenExtractor } = await import('../services')

      return new BearerTokenExtractor()
    }
  }

  private async _getAllowMethod(
    configure: boolean,
    opts: Optional<Dictionary<HttpMethod[]>>,
  ): Promise<Optional<IAllowMethod>> {
    const { Guards } = await import('@xeno-js/shared')
    if (!configure || !Guards.isDefined(opts)) return undefined

    const { AllowMethodFactory } = await import('../factories')
    return new AllowMethodFactory().create(opts)
  }
}
