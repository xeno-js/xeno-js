import type {
  Delegate,
  ExecutionContext,
  IHandler,
  IMediator,
  IPipelineBehavior,
  IRequestContext,
  ResultType,
} from '@/domain'
import { AppError, Result } from '@/domain'
import type { IBaseRequest, ICommand, IQuery } from '@/shared'
import {
  ERROR_CODE_MESSAGES,
  ERROR_CODES,
  Guards,
  STATUS_CODES,
  TokenHelper,
  TOKENS,
} from '@/shared'

/**
 * @description Mediator implementation for CQRS pattern. It is responsible for sending commands and executing queries by delegating them to the appropriate handlers, while also applying any registered pipeline behaviors (middlewares).
 */
export class Mediator implements IMediator {
  /**
   * @param _requestContext An instance of IRequestContext used to manage the execution context for commands and queries.
   */
  constructor(private readonly _requestContext: IRequestContext<ExecutionContext>) {}

  /**
   * @inheritdoc
   */
  async send<TResponse>(request: ICommand<unknown>): Promise<ResultType<TResponse>> {
    return this.process(request, TOKENS.COMMAND_PIPELINES_BEHAVIOR)
  }

  /**
   * @inheritdoc
   */
  async query<TResponse>(request: IQuery): Promise<ResultType<TResponse>> {
    return this.process(request, TOKENS.QUERY_PIPELINES_BEHAVIOR)
  }

  /**
   * @description Internal method to process both commands and queries. It resolves the appropriate handler for the request and applies the registered pipeline behaviors in the correct order.
   * @param request The command or query to be processed.
   * @returns A promise that resolves to the result of processing the request.
   */
  private async process<TResponse>(
    request: IBaseRequest,
    pipelineToken: string,
  ): Promise<ResultType<TResponse>> {
    if (Guards.isDefined(request.signal) && request.signal.aborted)
      return Result.fail(AppError.aborted(request.intent))

    const { scope } = this._requestContext.getContext() ?? {}
    if (!Guards.isDefined(scope))
      return Result.fail(
        AppError.create({
          code: ERROR_CODES.SCOPE_NOT_AVAILABLE,
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          name: request.intent,
          message: ERROR_CODE_MESSAGES[ERROR_CODES.SCOPE_NOT_AVAILABLE],
          cause: new Error('Service scope is required to process the request.'),
        }),
      )

    const token = TokenHelper.createToken<IHandler<IBaseRequest, TResponse>>(request.intent)
    const handler = scope.resolve(token)

    const pipelines = scope.resolve(
      TokenHelper.createToken<IPipelineBehavior<IBaseRequest, TResponse>>(pipelineToken),
    )

    const next: Delegate<TResponse> = () => handler.handle(request)

    return pipelines.handle(request, next)
  }
}
