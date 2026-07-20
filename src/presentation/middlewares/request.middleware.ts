import type {
  ApplicationRegistry,
  IGateKeeper,
  ILogger,
  IMatcher,
  IMiddleware,
  IRequestContext,
  IServiceExtractor,
  RequestContext,
} from '@/domain'
import type { Guid, HttpHeaders, HttpMethod, Metadata, ResponseDto } from '@/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, GuidHelper, HttpHelper, STATUS_CODES } from '@/shared'

import { ContextMapper } from '../mappers/context.mapper'

/**
 * @description The RequestContextMiddleware class is responsible for extracting metadata from incoming HTTP requests, performing authentication using the provided authentication middleware, and composing an ExecutionContext that includes identity, network, and tracing information. It implements the IMiddleware interface, allowing it to be used as part of a middleware chain in the request processing pipeline. The middleware ensures that the ExecutionContext is properly set up for downstream handlers, controllers, or use cases to access necessary contextual information for processing the request.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class RequestContextMiddleware implements IMiddleware<HttpHeaders> {
  /**
   * @description Constructs a new instance of the RequestContextMiddleware class, which is responsible for handling the request context in the middleware chain. It takes several dependencies as parameters, including an IRequestContext for managing the execution context, an IServiceExtractor for extracting metadata from HTTP headers, an IGateKeeper for performing authentication, and an IServiceContainer for managing service scopes and dependencies. These dependencies are essential for the middleware to function correctly, allowing it to extract necessary information from incoming requests, authenticate users, and set up the execution context for downstream processing.
   * @param _routeMatcher An instance of IMatcher used to match incoming requests to their corresponding routes and determine whether each route is public or requires authentication.
   * @param _requestContext An instance of IRequestContext used to manage the execution context for the request. This context allows the middleware to set and retrieve contextual information that can be accessed by downstream handlers, controllers, or use cases during the processing of the request.
   * @param _extractor An instance of IServiceExtractor used to extract metadata from the incoming HTTP request headers. This extractor is responsible for parsing the headers and retrieving relevant information such as correlation IDs, request IDs, authentication tokens, client IP addresses, and tracing span IDs, which are essential for building the ExecutionContext.
   * @param _gateKeeper An instance of IGateKeeper used to perform authentication. This component is responsible for validating the authentication token extracted from the request headers and returning the authentication result, which includes the identity of the authenticated user if the authentication is successful.
   * @param _factoryScope An instance of IFactory used to create a new IServiceScope for managing service dependencies during the execution of the request. This allows for proper scoping and disposal of services after the request is processed, ensuring that resources are managed efficiently and preventing memory leaks.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  constructor(
    private readonly _routeMatcher: IMatcher<{ method: HttpMethod; path: string }>,
    private readonly _requestContext: IRequestContext<RequestContext, ApplicationRegistry<unknown>>,
    private readonly _extractor: IServiceExtractor<HttpHeaders, Metadata>,
    private readonly _gateKeeper: IGateKeeper,
    private readonly _logger: ILogger,
  ) {}

  public async execute<T>(
    req: { method: HttpMethod; path: string },
    headers: HttpHeaders,
    next: () => Promise<ResponseDto<T>>,
  ): Promise<ResponseDto<T>> {
    const isPublic = this._routeMatcher.match(req)
    let correlationId = GuidHelper.generate()
    let requestId = GuidHelper.generate()
    let spanId: Guid = correlationId
    let formatIndicator = 'application/json'

    try {
      const meta = this._extractor.extract(headers)
      correlationId = meta.correlationId ?? correlationId
      requestId = meta.requestId ?? requestId
      spanId = meta.spanId ?? spanId
      formatIndicator = meta.formatIndicator

      const metadata: Metadata = {
        ...meta,
        correlationId,
        requestId,
        spanId,
      }

      const authResult = await this._gateKeeper.authenticate(meta.token)
      if (!authResult.isOk()) {
        const error = authResult.getErrorOrThrow()
        this._logger.warn(
          `Authentication failed for request on path: ${req.path}. Code: ${error.code}`,
        )

        return HttpHelper.error(
          {
            success: false,
            error: {
              code: error.code,
              message: error.message,
              details: `[Authentication Error] Failed to authenticate request on path: ${req.path}`,
              path: req.path,
            },
            correlationId: metadata.correlationId!,
            requestId: metadata.requestId!,
            spanId: metadata.spanId!,
            timestamp: new Date().toISOString(),
          },
          error.status ?? STATUS_CODES.UNAUTHORIZED,
          { 'Content-Type': [formatIndicator] },
        )
      }

      const requestContext = ContextMapper.map({
        metadata,
        identity: authResult.getValueOrThrow()!,
        path: req.path,
        isPublic,
      })

      return await this._requestContext.runAsync(requestContext, async () => {
        return next()
      })
    } catch (error) {
      this._logger.error('RequestContextMiddleware encountered an error', error)
      return HttpHelper.error(
        {
          success: false,
          error: {
            code: ERROR_CODES.SYSTEM_ERROR,
            message: ERROR_CODE_MESSAGES[ERROR_CODES.SYSTEM_ERROR],
            details: `[Fatal System Error] Exception caught during request handling on path: ${req.path}`,
            path: req.path,
          },
          correlationId,
          requestId,
          spanId,
          timestamp: new Date().toISOString(),
        },
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        { 'Content-Type': [formatIndicator] },
      )
    }
  }
}
