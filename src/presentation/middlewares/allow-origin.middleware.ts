import type {
  HttpHeaders,
  HttpMethod,
  IContextAccessor,
  ILogger,
  IMiddleware,
  RequestContext,
  ResponseDto,
} from '@xeno-js/shared'
import {
  ERROR_CODE_MESSAGES,
  ERROR_CODES,
  GuidHelper,
  HttpHelper,
  STATUS_CODES,
} from '@xeno-js/shared'

import type { IAllowOrigin } from '@/domain'

/**
 * @description A middleware that checks if the origin of the request is allowed.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class AllowOriginMiddleware implements IMiddleware<HttpHeaders> {
  constructor(
    private readonly _allowOrigin: IAllowOrigin,
    private readonly _requestContext: IContextAccessor<RequestContext>,
    private readonly _logger: ILogger,
  ) {}

  public async execute<T, TRes, TReq>(
    req: { method: HttpMethod; path: string; transport: { req: TRes; res: TReq } },
    _headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    const { network, tracing } = this._requestContext.getContext() ?? {}
    const origin = network?.origin

    if (!this._allowOrigin.isAllowed(origin)) {
      this._logger.warn(`Access denied by AllowOrigin policy for origin: ${origin ?? 'unknown'}`)

      return HttpHelper.error(
        {
          success: false,
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message: ERROR_CODE_MESSAGES[ERROR_CODES.FORBIDDEN],
            details: `The origin '${origin ?? 'unknown'}' is not allowed to access this resource.`,
            path: req.path,
          },
          correlationId: tracing?.correlationId ?? GuidHelper.generate(),
          requestId: network?.requestId ?? GuidHelper.generate(),
          spanId: tracing?.spanId ?? GuidHelper.generate(),
          timestamp: new Date().toISOString(),
        },
        STATUS_CODES.FORBIDDEN,
      )
    }

    return next()
  }
}
