import type {
  Delegate,
  IBaseRequest,
  IMediator,
  IPipelineBehavior,
  IServiceScope,
  ResultType,
} from '@/domain'

/**
 * @description Mediator implementation for CQRS pattern. It is responsible for sending commands and executing queries by delegating them to the appropriate handlers, while also applying any registered pipeline behaviors (middlewares).
 */
export class Mediator implements IMediator {
  /**
   * @param _resolver An instance of IServiceScope used to resolve handlers for commands and queries.
   * @param _pipelines An optional array of IPipelineBehavior instances that represent the middleware pipeline to be applied to all requests.
   */
  constructor(
    private readonly _resolver: IServiceScope,
    private readonly _pipelines: IPipelineBehavior,
  ) {}

  /**
   * @inheritdoc
   */
  async send<TResponse>(request: IBaseRequest<TResponse>): Promise<ResultType<TResponse>> {
    return this.process(request)
  }

  /**
   * @inheritdoc
   */
  async query<TResponse>(request: IBaseRequest<TResponse>): Promise<ResultType<TResponse>> {
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
    const handler = this._resolver.resolve(request.token)

    const next: Delegate<TResponse> = () => handler.handle(request)

    return this._pipelines.handle(request, next)
  }
}
