import type {
  HttpHeaders,
  HttpMethod,
  IContextAccessor,
  ILogger,
  IMiddleware,
  RequestContext,
  ResponseDto,
} from '@xeno-js/shared'
import { ERROR_CODES, Guards, GuidHelper, HttpHelper, STATUS_CODES } from '@xeno-js/shared'

import type { IAtomicCache } from '@/domain'

/**
 * @description The RateLimitMiddleware class implements the IMiddleware interface and provides rate limiting functionality for incoming requests. It uses an IAtomicCache instance to track the number of requests made by each client within a specified time window. If the number of requests exceeds the maximum allowed, the middleware returns a 429 Too Many Requests response. Otherwise it calls the next middleware in the chain.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 1.0.0
 * @param {IContextAccessor<RequestContext>} _ctxAccessor - The context accessor for the request.
 * @param {IAtomicCache} _cache - The cache used to store the request counts.
 * @param {ILogger} _logger - The logger used to log messages.
 * @param {number} _opts.maxRequests - The maximum number of requests allowed within the time window.
 * @param {number} _opts.windowSeconds - The time window in seconds within which the maximum number of requests is allowed.
 * @link https://github.com/xenowits/xeno-js
 */
export class RateLimitMiddleware implements IMiddleware<HttpHeaders> {
  constructor(
    private readonly _ctxAccessor: IContextAccessor<RequestContext>,
    private readonly _cache: IAtomicCache,
    private readonly _logger: ILogger,
    private readonly _opts: {
      maxRequests: number
      windowSeconds: number
    },
  ) {}

  public async execute<T, TRes, TReq>(
    req: { method: HttpMethod; path: string; transport: { req: TRes; res: TReq } },
    _headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    const { network, tracing } = this._ctxAccessor.getContext() ?? {}
    if (!Guards.isDefined(network?.clientIp))
      return HttpHelper.error(
        {
          success: false,
          error: {
            code: ERROR_CODES.SYSTEM_ERROR,
            message: 'IP undefined. Please contact the administrator.',
            details: `IP undefined. Please contact the administrator.`,
            path: req.path,
          },
          correlationId: tracing?.correlationId ?? GuidHelper.generate(),
          requestId: network?.requestId ?? GuidHelper.generate(),
          spanId: tracing?.spanId ?? GuidHelper.generate(),
          timestamp: new Date().toISOString(),
        },
        STATUS_CODES.SERVICE_UNAVAILABLE,
        {
          'Content-Type': [network?.formatIndicator ?? 'application/json'],
          'Retry-After': [String(this._opts.windowSeconds)],
        },
      )

    const clientIp = network?.clientIp
    const cacheKey = `rate_limit:${clientIp}`

    const currentHits = await this._cache.increment(cacheKey, this._opts.windowSeconds)

    if (currentHits > this._opts.maxRequests) {
      this._logger.warn(`[RateLimit] IP ${clientIp} blocked on ${req.path}`)

      return HttpHelper.error(
        {
          success: false,
          error: {
            code: ERROR_CODES.TOO_MANY_REQUESTS,
            message: 'Rate limit exceeded.',
            details: `IP ${clientIp} throttled.`,
            path: req.path,
          },
          correlationId: tracing?.correlationId ?? GuidHelper.generate(),
          requestId: network?.requestId ?? GuidHelper.generate(),
          spanId: tracing?.spanId ?? GuidHelper.generate(),
          timestamp: new Date().toISOString(),
        },
        STATUS_CODES.TOO_MANY_REQUESTS,
        {
          'Content-Type': [network?.formatIndicator ?? 'application/json'],
          'Retry-After': [String(this._opts.windowSeconds)],
        },
      )
    }

    return next()
  }
}
