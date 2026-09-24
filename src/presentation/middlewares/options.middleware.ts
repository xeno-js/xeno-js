import type { HttpHeaders, HttpMethod, INetworkContextAccessor, ResponseDto } from '@xeno-js/shared'
import { Guards, HttpHelper, STATUS_CODES } from '@xeno-js/shared'

import type { IAllowMethod } from '@/domain'

/**
 * @description A middleware that handles OPTIONS requests.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export class OptionsMiddleware {
  constructor(
    private readonly _requestContext: INetworkContextAccessor,
    private readonly _alloewMethod: IAllowMethod,
    private readonly _allowHeaders: string[] = [],
    private readonly _withCredentials: 'true' | 'false' = 'false',
  ) {}

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
        headers['Access-Control-Allow-Credentials'] = this._withCredentials
        headers['Vary'] = 'Origin'
      }
      headers['Access-Control-Allow-Methods'] = this._alloewMethod.getMethods(req.path)
      headers['Access-Control-Allow-Headers'] = this._allowHeaders.join(', ')

      return HttpHelper.success(null as T, STATUS_CODES.NO_CONTENT, {}, headers)
    }

    return await next()
  }
}
