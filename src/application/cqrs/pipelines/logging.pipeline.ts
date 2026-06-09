import type {
  AppError,
  Delegate,
  IBaseRequest,
  Identity,
  ILogger,
  IPipelineBehavior,
  IRequestContext,
  ResultType,
} from '@/domain'
import type { Optional } from '@/shared'
import { REQUEST_TYPE } from '@/shared'

/**
 * @description A pipeline behavior that logs the handling of commands and queries, including their success or failure, along with contextual information such as request ID, correlation ID, and user ID.
 * This pipeline can be used to enhance observability and debugging capabilities in the application by providing detailed logs for each request processed through the CQRS pipeline.
 *
 * @template TInput - The type of the input request, which must extend the IBaseRequest interface.
 * @template TResult - The type of the result returned by the request handler.
 */
export class LoggingPipeline<
  TInput extends IBaseRequest<TResult>,
  TResult,
> implements IPipelineBehavior<TInput, TResult> {
  /**
   * @description Constructs a new instance of the LoggingPipeline class, which requires an ILogger for logging and an IRequestContext for accessing the current user's identity context. The pipeline will use these dependencies to log relevant information about each request being handled, including any errors that occur during processing.
   * @param _logger An instance of ILogger used for logging informational messages and errors related to the handling of requests.
   * @param _requestContext An instance of IRequestContext used to access the current user's identity context, allowing the pipeline to include user-related information in the logs for better traceability and debugging.
   */
  constructor(
    private readonly _logger: ILogger,
    private readonly _requestContext: IRequestContext<Identity>,
  ) {}

  public async handle(request: TInput, next: Delegate<TResult>): Promise<ResultType<TResult>> {
    const requestType = REQUEST_TYPE[request.type]
    const resolverToken = request.token.symbol.toString()

    this.logContext('info', request, `Handling ${requestType} ${resolverToken}`)

    const result = await next()

    if (!result.isOk()) {
      const error = result.getErrorOrThrow()
      this.logContext(
        'error',
        request,
        `Failed to handle ${requestType} ${resolverToken}: ${error.message}`,
        error,
      )
    } else {
      this.logContext('info', request, `Successfully handled ${requestType} ${resolverToken}`)
    }

    return result
  }

  private logContext(
    type: 'info' | 'error',
    request: IBaseRequest<unknown>,
    message: string,
    error: Optional<AppError> = undefined,
  ): void {
    const identity = this._requestContext.getContext()
    const context = {
      context: {
        messageType: REQUEST_TYPE[request.type],
        command: request.token.symbol.toString(),
        requestId: request.id,
        correlationId: identity?.correlationId,
        userId: identity?.userId,
        tenantId: identity?.tenantId,
      },
    }
    switch (type) {
      case 'info':
        this._logger.info(message, context)
        break
      case 'error':
        this._logger.error(message, error, {
          ...context,
          error: {
            code: error?.code,
            status: error?.status,
            stack: error?.stack,
          },
        })
        break
    }
  }
}
