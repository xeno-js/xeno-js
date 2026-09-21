import type {
  HttpHeaders,
  HttpMethod,
  IContextAccessor,
  IMiddleware,
  RequestContext,
  ResponseDto,
} from '@xeno-js/shared'
import { Guards } from '@xeno-js/shared'

/**
 * @description A cors middleware that checks if the origin of the request is allowed.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class CORSMiddleware implements IMiddleware<HttpHeaders> {
  constructor(private readonly _requestContext: IContextAccessor<RequestContext>) {}

  public async execute<T, TRes, TReq>(
    req: { method: HttpMethod; path: string; transport: { req: TRes; res: TReq } },
    _headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    const { network } = this._requestContext.getContext() ?? {}
    const origin = network?.origin

    const response = await next()
    if (Guards.isDefined(origin))
      response.headers = {
        ...(response.headers ?? {}),
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Vary': 'Origin',
      }
    return response
  }
}
