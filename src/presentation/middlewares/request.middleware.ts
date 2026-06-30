import type {
  ExecutionContext,
  IFactory,
  IGateKeeper,
  IMiddleware,
  IRequestContext,
  IServiceExtractor,
  IServiceScope,
  NetworkContext,
  TracingContext,
} from '@/domain'
import type { HttpHeaders, Metadata, Optional, ResponseDto } from '@/shared'
import {
  ERROR_CODE_MESSAGES,
  ERROR_CODES,
  Guards,
  GuidHelper,
  HttpHelper,
  STATUS_CODES,
} from '@/shared'

/**
 * @description The RequestContextMiddleware class is responsible for extracting metadata from incoming HTTP requests, performing authentication using the provided authentication middleware, and composing an ExecutionContext that includes identity, network, and tracing information. It implements the IMiddleware interface, allowing it to be used as part of a middleware chain in the request processing pipeline. The middleware ensures that the ExecutionContext is properly set up for downstream handlers, controllers, or use cases to access necessary contextual information for processing the request.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export class RequestContextMiddleware implements IMiddleware<HttpHeaders> {
  /**
   * @description Constructs a new instance of the RequestContextMiddleware class, which is responsible for handling the request context in the middleware chain. It takes several dependencies as parameters, including an IRequestContext for managing the execution context, an IServiceExtractor for extracting metadata from HTTP headers, an IGateKeeper for performing authentication, and an IServiceContainer for managing service scopes and dependencies. These dependencies are essential for the middleware to function correctly, allowing it to extract necessary information from incoming requests, authenticate users, and set up the execution context for downstream processing.
   * @param _requestContext An instance of IRequestContext used to manage the execution context for the request. This context allows the middleware to set and retrieve contextual information that can be accessed by downstream handlers, controllers, or use cases during the processing of the request.
   * @param _extractor An instance of IServiceExtractor used to extract metadata from the incoming HTTP request headers. This extractor is responsible for parsing the headers and retrieving relevant information such as correlation IDs, request IDs, authentication tokens, client IP addresses, and tracing span IDs, which are essential for building the ExecutionContext.
   * @param _gateKeeper An instance of IGateKeeper used to perform authentication. This component is responsible for validating the authentication token extracted from the request headers and returning the authentication result, which includes the identity of the authenticated user if the authentication is successful.
   * @param _container An instance of IServiceContainer used to manage service scopes and dependencies. This container allows the middleware to create a new scope for each request, ensuring that services are properly scoped and disposed of after the request is processed.
  
   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
  constructor(
    private readonly _requestContext: IRequestContext<ExecutionContext>,
    private readonly _extractor: IServiceExtractor<HttpHeaders, Metadata>,
    private readonly _gateKeeper: IGateKeeper,
    private readonly _factoryScope: IFactory<void, IServiceScope>,
  ) {}

  public async execute<T>(
    headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    let correlationId = GuidHelper.generate()
    let requestId = GuidHelper.generate()

    let scope: Optional<IServiceScope> = undefined

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

      scope = this._factoryScope.create()

      const executionContext: ExecutionContext = {
        context: {
          identity: identity!,
          network,
          tracing,
        },
        scope,
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
    } finally {
      if (Guards.isDefined(scope)) {
        scope.dispose()
      }
    }
  }
}
