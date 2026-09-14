import type { HttpHeaders, HttpMethod, ResponseDto } from '@xeno-js/shared'
import { HttpHelper, STATUS_CODES } from '@xeno-js/shared'

export class OptionsMiddleware {
  public async execute<T, TRes, TReq>(
    req: { method: HttpMethod; path: string; transport: { req: TRes; res: TReq } },
    _headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    if (req.method.toUpperCase() === 'OPTIONS') {
      return HttpHelper.success(null as T, STATUS_CODES.NO_CONTENT)
    }

    return await next()
  }
}
