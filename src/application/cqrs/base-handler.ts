import type { ExecutionContext, IHandler, IRequest, IRequestContext, ResultType } from '@/domain'
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
  TRequest extends IRequest<TResponse>,
  TResponse,
> implements IHandler<TRequest, TResponse> {
  constructor(private readonly _requestContext: IRequestContext<ExecutionContext>) {}

  abstract handle(request: TRequest, signal: AbortSignal): Promise<ResultType<TResponse>>

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
