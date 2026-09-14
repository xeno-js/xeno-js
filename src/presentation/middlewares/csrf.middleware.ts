import type { HttpHeaders, HttpMethod, RequestContext, ResponseDto } from '@xeno-js/shared'
import {
  ERROR_CODE_MESSAGES,
  ERROR_CODES,
  Guards,
  GuidHelper,
  HttpHelper,
  STATUS_CODES,
} from '@xeno-js/shared'

import type { ApplicationRegistry, IRequestContext } from '@/domain'

export class CsrfMiddleware {
  constructor(
    private readonly _requestContext: IRequestContext<RequestContext, ApplicationRegistry<unknown>>,
    private readonly _csrf: string,
  ) {}
  /**
   * @param requestContext Dati base della richiesta (metodo, path)
   * @param headers Header HTTP della richiesta
   * @param next Funzione delegata per passare al middleware successivo
   */
  public async execute<T, TRes, TReq>(
    req: { method: HttpMethod; path: string; transport: { req: TRes; res: TReq } },
    _headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    const method = req.method.toUpperCase()
    const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)

    if (isStateChanging) {
      // Estrazione sicura case-insensitive (Node.js/Vercel standardizzano in minuscolo)
      const { network, tracing } = this._requestContext.getContext() ?? {}

      // Fail-fast: se manca o è errato, blocca tutto lanciando un'eccezione di dominio
      if (
        !Guards.isDefined(network?.csrf) ||
        network.csrf.toLowerCase() !== this._csrf.toLowerCase()
      ) {
        return HttpHelper.error(
          {
            success: false,
            error: {
              code: ERROR_CODES.FORBIDDEN,
              message: ERROR_CODE_MESSAGES[ERROR_CODES.FORBIDDEN],
              details: 'CSRF header is missing or invalid',
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
