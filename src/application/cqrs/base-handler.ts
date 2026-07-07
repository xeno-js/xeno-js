import type {
  ExecutionContext,
  IHandler,
  IRequest,
  IRequestContext,
  IStrategy,
  ResultType,
} from '@/domain'
import { Guards, type Guid, type Optional, type UserContext } from '@/shared'

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
  TRequest extends IRequest<unknown, TResponse>,
  TResponse,
> implements IHandler<TRequest, TResponse> {
  constructor(
    private readonly _requestContext: IRequestContext<ExecutionContext>,
    private readonly _strategies: IStrategy<TRequest>[] = [],
  ) {}

  abstract handle(request: TRequest, signal: AbortSignal): Promise<ResultType<TResponse>>

  /**
   * Validates the current request by executing all strategies in the _strategies array.
   * If any strategy fails, an AppError is thrown with the corresponding error code and message.
   *
   * @template TRequest The type of the request object.
   * @param req The request object.
   * @returns A Promise that resolves if all strategies succeed, or rejects with an AppError if any strategy fails.
   * @throws {AppError} If any strategy fails or the user is not authenticated.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  protected async _validateCurrent(req: TRequest): Promise<void> {
    for (const strategy of this._strategies) {
      const result = await strategy.execute(req)
      if (!result.isOk()) {
        throw result.getErrorOrThrow()
      }
    }
  }

  protected _getCurrentContext(): UserContext {
    const output: { userId: Optional<Guid>; tenantId: Optional<Guid> } = {
      userId: undefined,
      tenantId: undefined,
    }

    const ctx = this._requestContext.getContext()

    if (Guards.isDefined(ctx)) {
      output.userId = ctx.context.identity?.userId
      output.tenantId = ctx.context.identity?.tenantId
    }

    return output
  }
}
