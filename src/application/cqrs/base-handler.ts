import type { IFactory, IHandler, IRequest, ResultType, UserContext } from '@xeno-js/shared'

/**
 * BaseHandler is an abstract class that implements the IHandler interface.
 * It provides a base implementation for handling requests and executing strategies.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export abstract class BaseHandler<
  TRequest extends IRequest<TResponse>,
  TResponse,
> implements IHandler<TRequest, TResponse> {
  constructor(private readonly _identityFactory: IFactory<void, UserContext>) {}

  abstract handle(request: TRequest, signal: AbortSignal): Promise<ResultType<TResponse>>

  protected _getCurrentContext(): UserContext {
    return this._identityFactory.create()
  }
}
