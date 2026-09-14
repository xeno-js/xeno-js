import type {
  HttpHeaders,
  HttpMethod,
  ICache,
  IContextAccessor,
  ILogger,
  IMiddleware,
  RequestContext,
  ResponseDto,
} from '@xeno-js/shared'
import { ERROR_CODES, GuidHelper, HttpHelper } from '@xeno-js/shared'

export class RateLimitMiddleware implements IMiddleware<HttpHeaders> {
  constructor(
    private readonly _ctxAccessor: IContextAccessor<RequestContext>,
    private readonly _cache: ICache,
    private readonly _logger: ILogger,
    private readonly _opts: {
      maxRequests: number
      windowSeconds: number
    },
  ) {}

  public async execute<T, TRes, TReq>(
    req: { method: HttpMethod; path: string; transport: { req: TRes; res: TReq } },
    headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    const { network, tracing } = this._ctxAccessor.getContext() ?? {}
    const clientIp = network?.clientIp
    const cacheKey = `rate_limit:${clientIp}`

    const currentHits = (await this._cache.get<number>(cacheKey)) ?? 0

    if (currentHits >= this._opts.maxRequests) {
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
        429,
        {
          'Content-Type': [network?.formatIndicator ?? 'application/json'],
          'Retry-After': [String(this._opts.windowSeconds)],
        },
      )
    }

    await this._cache.set(cacheKey, currentHits + 1, this._opts.windowSeconds)

    return next()
  }
}
