import type {
  HttpHeaders,
  HttpMethod,
  IGateKeeper,
  ILogger,
  IMiddleware,
  IServiceExtractor,
  Optional,
  RequestContext,
  ResponseDto,
} from '@xeno-js/shared'
import { GuidHelper, HttpHelper, STATUS_CODES } from '@xeno-js/shared'

import type { ApplicationRegistry, IRequestContext } from '@/domain'

/**
 * @description Middleware that checks if the request is authenticated. If the request is not authenticated, it returns a 401
 * status code with an error message.
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @param {IRequestContext<RequestContext, ApplicationRegistry<unknown>>} _requestContext - The request context to use for resolving services.
 * @param {IGateKeeper} _gateKeeper - The gate keeper to use for authentication.
 * @param {ILogger} _logger - The logger to use for logging.
 * @param {IServiceExtractor<HttpHeaders, Optional<string>>} _tokenExtractor - The token extractor to use for extracting the token from the request.
 * @returns {IMiddleware<HttpHeaders>} - The middleware function.
 * @link https://github.com/xeno-js/xeno-js
 *
 * @see {@link IRequestContext} - The request context interface.
 * @see {@link IGateKeeper} - The gate keeper interface.
 * @see {@link ILogger} - The logger interface.
 * @see {@link IServiceExtractor} - The service extractor interface.
 */
export class AuthenticationMiddleware implements IMiddleware<HttpHeaders> {
  constructor(
    private readonly _requestContext: IRequestContext<RequestContext, ApplicationRegistry<unknown>>,
    private readonly _tokenExtractor: IServiceExtractor<HttpHeaders, Optional<string>>,
    private readonly _gateKeeper: IGateKeeper,
    private readonly _logger: ILogger,
  ) {}

  public async execute<T, TRes, TReq>(
    req: { method: HttpMethod; path: string; transport: { req: TRes; res: TReq } },
    headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    const token = this._tokenExtractor.extract(headers)
    const authResult = await this._gateKeeper.authenticate(token)

    if (!authResult.isOk()) {
      const error = authResult.getErrorOrThrow()
      this._logger.warn(
        `Authentication failed for request on path: ${req.path}. Code: ${error.code}. Error: ${error}`,
      )

      const { network, tracing } = this._requestContext.getContext() ?? {}

      return HttpHelper.error(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: `[Authentication Error] Failed to authenticate request on path: ${req.path}`,
            path: req.path,
          },
          correlationId: tracing?.correlationId ?? GuidHelper.generate(),
          requestId: network?.requestId ?? GuidHelper.generate(),
          spanId: tracing?.spanId ?? GuidHelper.generate(),
          timestamp: new Date().toISOString(),
        },
        error.status ?? STATUS_CODES.UNAUTHORIZED,
        { 'Content-Type': [network?.formatIndicator ?? 'application/json'] },
      )
    }

    this._requestContext.updateIdentity(authResult.getValueOrThrow()!)

    return next()
  }
}
