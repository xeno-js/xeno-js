import type {
  HttpHeaders,
  HttpMethod,
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

import type { ApplicationRegistry, IAllowMethod, IRequestContext } from '@/domain'

export class MethodCheckMiddleware implements IMiddleware<HttpHeaders> {
  constructor(
    private readonly _requestContext: IRequestContext<RequestContext, ApplicationRegistry<unknown>>,
    private readonly _allowMethod: IAllowMethod,
  ) {}

  public async execute<T, TRes, TReq>(
    req: { method: HttpMethod; path: string; transport: { req: TRes; res: TReq } },
    headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    const isAllowed = this._allowMethod.check(req.path, req.method)

    if (!isAllowed) {
      const { network, tracing } = this._requestContext.getContext() ?? {}

      return HttpHelper.error(
        {
          success: false,
          error: {
            code: ERROR_CODES.NOT_ALLOWED,
            message: ERROR_CODE_MESSAGES[ERROR_CODES.NOT_ALLOWED],
            details: `Operation blocked by allow method middleware`,
            path: req.path,
          },
          correlationId: tracing?.correlationId ?? GuidHelper.generate(),
          requestId: network?.requestId ?? GuidHelper.generate(),
          spanId: tracing?.spanId ?? GuidHelper.generate(),
          timestamp: new Date().toISOString(),
        },
        STATUS_CODES.NOT_ALLOWED,
      )
    }

    return await next()
  }
}
