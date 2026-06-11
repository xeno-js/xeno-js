import type {
  Delegate,
  IHandler,
  IMediator,
  IPipelineBehavior,
  IServiceScope,
  ResultType,
} from '@/domain'
import { AppError, Result } from '@/domain'
import type { IBaseRequest, ICommand, IQuery } from '@/shared'
import { Guards, TokenHelper, TOKENS } from '@/shared'

/**
 * @description Mediator implementation for CQRS pattern. It is responsible for sending commands and executing queries by delegating them to the appropriate handlers, while also applying any registered pipeline behaviors (middlewares).
 */
export class Mediator implements IMediator {
  /**
   * @param _resolver An instance of IServiceScope used to resolve handlers for commands and queries.
   */
  constructor(private readonly _resolver: IServiceScope) {}

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

    const token = TokenHelper.createToken<IHandler<IBaseRequest, TResponse>>(request.intent)
    const handler = this._resolver.resolve(token)

    const pipelines = this._resolver.resolve(
      TokenHelper.createToken<IPipelineBehavior<IBaseRequest, TResponse>>(pipelineToken),
    )

    const next: Delegate<TResponse> = () => handler.handle(request)

    return pipelines.handle(request, next)
  }
}
