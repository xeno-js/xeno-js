import type { IGateKeeper, IMiddleware, IRequestContext, IServiceExtractor } from '@/domain'
import type {
  ExecutionContext,
  HttpHeaders,
  Metadata,
  NetworkContext,
  ResponseDto,
  TracingContext,
} from '@/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, GuidHelper, HttpHelper, STATUS_CODES } from '@/shared'

/**
 * @description The RequestContextMiddleware class is responsible for extracting metadata from incoming HTTP requests, performing authentication using the provided authentication middleware, and composing an ExecutionContext that includes identity, network, and tracing information. It implements the IMiddleware interface, allowing it to be used as part of a middleware chain in the request processing pipeline. The middleware ensures that the ExecutionContext is properly set up for downstream handlers, controllers, or use cases to access necessary contextual information for processing the request.
 */
export class RequestContextMiddleware implements IMiddleware<HttpHeaders> {
  constructor(
    private readonly _requestContext: IRequestContext<ExecutionContext>,
    private readonly _extractor: IServiceExtractor<HttpHeaders, Metadata>,
    private readonly _gateKeeper: IGateKeeper,
  ) {}

  public async execute<T>(
    headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    let correlationId = GuidHelper.generate()
    let requestId = GuidHelper.generate()
    try {
      const meta = this._extractor.extract(headers)
      correlationId = meta.correlationId ?? correlationId
      requestId = meta.requestId ?? requestId

      const authResult = await this._gateKeeper.authenticate(meta.token)
      if (!authResult.isOk()) {
        const error = authResult.getErrorOrThrow()
        return HttpHelper.error({
          code: error.code,
          message: error.message,
          status: error.status,
          details: undefined,
          correlationId,
          requestId,
          customHeaders: undefined,
        })
      }

      const network: NetworkContext = {
        requestId,
        clientIp: meta.clientIp,
      }
      const tracing: TracingContext = {
        correlationId,
        startTime: Date.now(),
        spanId: meta.spanId,
      }
      const identity = authResult.getValueOrThrow()

      const executionContext: ExecutionContext = {
        identity: identity!,
        network,
        tracing,
      }

      return this._requestContext.runAsync(executionContext, async () => {
        return next()
      })
    } catch (error) {
      return HttpHelper.error({
        code: ERROR_CODES.SYSTEM_ERROR,
        message: ERROR_CODE_MESSAGES[ERROR_CODES.SYSTEM_ERROR],
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        details: error instanceof Error ? error.message : String(error),
        correlationId,
        requestId,
        customHeaders: undefined,
      })
    }
  }
}
