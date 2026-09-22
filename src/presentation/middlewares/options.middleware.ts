import type { HttpHeaders, HttpMethod, INetworkContextAccessor, ResponseDto } from '@xeno-js/shared'
import { Guards, HttpHelper, STATUS_CODES } from '@xeno-js/shared'

/**
 * @description A middleware that handles OPTIONS requests.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export class OptionsMiddleware {
  constructor(private readonly _requestContext: INetworkContextAccessor) {}

  public async execute<T, TRes, TReq>(
    req: { method: HttpMethod; path: string; transport: { req: TRes; res: TReq } },
    _headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    if (req.method.toUpperCase() === 'OPTIONS') {
      const network = this._requestContext.getNetworkContext()
      const origin = network?.origin

      const headers: HttpHeaders = {}
      if (Guards.isDefined(origin)) {
        headers['Access-Control-Allow-Origin'] = origin
        headers['Access-Control-Allow-Credentials'] = 'true'
        headers['Vary'] = 'Origin'
      }
      headers['Access-Control-Allow-Methods'] = 'POST,GET,PUT,DELETE,OPTIONS'
      headers['Access-Control-Allow-Headers'] =
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Type, Authorization, X-Correlation-Id'

      return HttpHelper.success(null as T, STATUS_CODES.NO_CONTENT, {}, headers)
    }

    return await next()
  }
}
