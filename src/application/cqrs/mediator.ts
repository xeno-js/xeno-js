import type {
  Delegate,
  IBaseRequest,
  ICommand,
  IMediator,
  IPipelineBehavior,
  IQuery,
  IServiceScope,
  ResultType,
} from '@/domain'
import { AppError, Result } from '@/domain'
import { Guards, TokenHelper } from '@/shared'

/**
 * @description Mediator implementation for CQRS pattern. It is responsible for sending commands and executing queries by delegating them to the appropriate handlers, while also applying any registered pipeline behaviors (middlewares).
 */
export class Mediator implements IMediator {
  /**
   * @param _resolver An instance of IServiceScope used to resolve handlers for commands and queries.
   */
  constructor(
    private readonly _resolver: IServiceScope,
    private readonly _token: string,
  ) {}

  /**
   * @inheritdoc
   */
  async send<TResponse>(request: ICommand<TResponse>): Promise<ResultType<TResponse>> {
    return this.process(request)
  }

  /**
   * @inheritdoc
   */
  async query<TResponse>(request: IQuery<TResponse>): Promise<ResultType<TResponse>> {
    return this.process(request)
  }

  /**
   * @description Internal method to process both commands and queries. It resolves the appropriate handler for the request and applies the registered pipeline behaviors in the correct order.
   * @param request The command or query to be processed.
   * @returns A promise that resolves to the result of processing the request.
   */
  private async process<TResponse>(
    request: IBaseRequest<TResponse>,
  ): Promise<ResultType<TResponse>> {
    if (Guards.isDefined(request.signal) && request.signal.aborted)
      return Result.fail(AppError.aborted(request.token.symbol.toString()))

    const handler = this._resolver.resolve(request.token)

    const pipelines = this._resolver.resolve(
      TokenHelper.createToken<IPipelineBehavior<IBaseRequest<TResponse>, TResponse>>(this._token),
    )

    const next: Delegate<TResponse> = () => handler.handle(request)

    return pipelines.handle(request, next)
  }
}
