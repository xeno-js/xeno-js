import type { HttpHeaders, HttpMethod, RequestContext, ResponseDto } from '@xeno-js/shared'
import {
  ERROR_CODE_MESSAGES,
  ERROR_CODES,
  Guards,
  GuidHelper,
  HttpHelper,
  STATUS_CODES,
} from '@xeno-js/shared'

import type { ApplicationRegistry, ICsrfTokenService, IRequestContext } from '@/domain'

/**
 * @description The CsrfMiddleware class implements the IMiddleware interface, providing a concrete implementation for handling CSRF token validation. It checks the incoming request for a valid CSRF token and returns an error response if the token is missing or invalid.
 */
export class CsrfMiddleware {
  constructor(
    private readonly _requestContext: IRequestContext<RequestContext, ApplicationRegistry<unknown>>,
    private readonly _csrfTokenService: ICsrfTokenService,
  ) {}

  public async execute<T, TRes, TReq>(
    req: { method: HttpMethod; path: string; transport: { req: TRes; res: TReq } },
    _headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    const method = req.method.toUpperCase()
    const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)

    if (isStateChanging) {
      const { network, tracing, identity } = this._requestContext.getContext() ?? {}
      const headerToken = network?.csrf
      const cookieToken = network?.csrfCookie

      if (!Guards.isDefined(headerToken) || !Guards.isDefined(cookieToken)) {
        return HttpHelper.error(
          {
            success: false,
            error: {
              code: ERROR_CODES.FORBIDDEN,
              message: ERROR_CODE_MESSAGES[ERROR_CODES.FORBIDDEN],
              details: 'CSRF token missing',
              path: req.path,
            },
            correlationId: tracing?.correlationId ?? GuidHelper.generate(),
            requestId: network?.requestId ?? GuidHelper.generate(),
            spanId: tracing?.spanId ?? GuidHelper.generate(),
            timestamp: new Date().toISOString(),
          },
          STATUS_CODES.FORBIDDEN,
          {
            'Content-Type': [network?.formatIndicator ?? 'application/json'],
          },
        )
      }

      if (headerToken !== cookieToken) {
        return HttpHelper.error(
          {
            success: false,
            error: {
              code: ERROR_CODES.FORBIDDEN,
              message: ERROR_CODE_MESSAGES[ERROR_CODES.FORBIDDEN],
              details: 'CSRF token mismatch',
              path: req.path,
            },
            correlationId: tracing?.correlationId ?? GuidHelper.generate(),
            requestId: network?.requestId ?? GuidHelper.generate(),
            spanId: tracing?.spanId ?? GuidHelper.generate(),
            timestamp: new Date().toISOString(),
          },
          STATUS_CODES.FORBIDDEN,
          {
            'Content-Type': [network?.formatIndicator ?? 'application/json'],
          },
        )
      }

      if (
        !Guards.isDefined(identity?.userId) ||
        !(await this._csrfTokenService.validate(headerToken, identity?.userId))
      ) {
        return HttpHelper.error(
          {
            success: false,
            error: {
              code: ERROR_CODES.FORBIDDEN,
              message: ERROR_CODE_MESSAGES[ERROR_CODES.FORBIDDEN],
              details: 'CSRF token invalid',
              path: req.path,
            },
            correlationId: tracing?.correlationId ?? GuidHelper.generate(),
            requestId: network?.requestId ?? GuidHelper.generate(),
            spanId: tracing?.spanId ?? GuidHelper.generate(),
            timestamp: new Date().toISOString(),
          },
          STATUS_CODES.FORBIDDEN,
          {
            'Content-Type': [network?.formatIndicator ?? 'application/json'],
          },
        )
      }
    }

    return await next()
  }
}
