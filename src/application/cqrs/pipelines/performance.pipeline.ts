import type {
  Delegate,
  IBaseRequest,
  Identity,
  ILogger,
  IPipelineBehavior,
  IRequestContext,
  ResultType,
} from '@/domain'
import { Guards, REQUEST_TYPE } from '@/shared'

/**
 * @description Default threshold in milliseconds for logging performance warnings. If a request takes longer than this threshold to execute, a warning will be logged. This value can be overridden by providing a different thresholdMs value when constructing the PerformancePipeline instance.
 */
const defaultThresholdMs = 500

/**
 * @description A pipeline behavior that measures the execution time of commands and queries, logging a warning if the execution time exceeds a specified threshold. This pipeline can be used to identify performance bottlenecks in the application and ensure that requests are processed within acceptable time limits.
 *
 * @template TInput - The type of the input request, which must extend the IBaseRequest interface.
 * @template TResult - The type of the result returned by the request handler.
 */
export class PerformancePipeline<
  TInput extends IBaseRequest<TResult>,
  TResult,
> implements IPipelineBehavior<TInput, TResult> {
  /**
   * @description Threshold in milliseconds for logging performance warnings. If a request takes longer than this threshold to execute, a warning will be logged. This value is set through the constructor and must be a positive integer.
   */
  private readonly _thresholdMs: number

  /**
   * @description Constructs a new instance of the PerformancePipeline class, which requires an ILogger for logging and an IRequestContext for accessing the current user's identity context. The pipeline will use these dependencies to log performance-related information about each request being handled, including any warnings when execution times exceed the specified threshold.
   * @param _logger An instance of ILogger used for logging performance warnings related to the handling of requests.
   * @param _requestContext An instance of IRequestContext used to access the current user's identity context, allowing the pipeline to include user-related information in the logs for better traceability and debugging.
   * @param thresholdMs An optional parameter that specifies the execution time threshold in milliseconds. If a request takes longer than this threshold to execute, a warning will be logged. The default value is 500ms.
   * @throws Will throw an error if the provided thresholdMs value is not a positive integer.
   */
  constructor(
    private readonly _logger: ILogger,
    private readonly _requestContext: IRequestContext<Identity>,
    thresholdMs: number = defaultThresholdMs,
  ) {
    if (!Guards.isInteger(thresholdMs) || thresholdMs <= 0)
      throw new Error(`Invalid thresholdMs value: ${thresholdMs}. It must be a positive integer.`)
    this._thresholdMs = thresholdMs
  }

  public async handle(request: TInput, next: Delegate<TResult>): Promise<ResultType<TResult>> {
    const requestType = REQUEST_TYPE[request.type]
    const resolverToken = request.token.symbol.toString()

    const startTime = performance.now()
    try {
      return await next()
    } finally {
      const endTime = performance.now()
      const duration = endTime - startTime

      if (duration > this._thresholdMs) {
        const identity = this._requestContext.getIdentity()
        this._logger.warn(
          `Performance warning: ${requestType} ${resolverToken} took ${duration.toFixed(2)}ms`,
          {
            context: {
              messageType: requestType,
              command: resolverToken,
              requestId: request.id,
              correlationId: identity?.correlationId,
              userId: identity?.userId,
              tenantId: identity?.tenantId,
            },
          },
        )
      }
    }
  }
}
