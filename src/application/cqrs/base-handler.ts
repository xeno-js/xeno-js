import type { ExecutionContext, IHandler, IRequestContext, IStrategy, ResultType } from '@/domain'
import { AppError } from '@/domain'
import type { Guid, Optional } from '@/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, Guards, STATUS_CODES } from '@/shared'

/**
 * BaseHandler is an abstract class that implements the IHandler interface.
 * It provides a base implementation for handling requests and executing strategies.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export abstract class BaseHandler<TRequest, TResponse> implements IHandler<TRequest, TResponse> {
  constructor(
    private readonly _requestContext: IRequestContext<ExecutionContext>,
    private readonly _strategies: IStrategy<TRequest>[] = [],
  ) {}

  abstract handle(request: TRequest, signal: AbortSignal): Promise<ResultType<TResponse>>

  /**
   * Retrieves the user identity from the request context after executing all strategies.
   * If any strategy fails, it throws an AppError with the appropriate error details.
   * @param req The request object.
   * @returns A promise that resolves to an object containing the userId and tenantId.
   * @throws {AppError} If any strategy fails or the user is not authenticated.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  protected async _getCurrentUser(
    req: TRequest,
  ): Promise<{ userId: Optional<Guid>; tenantId: Optional<Guid> }> {
    for (const strategy of this._strategies) {
      const result = await strategy.execute(req)
      if (!result.isOk()) {
        throw result.getErrorOrThrow()
      }
    }

    const { context } = this._requestContext.getContext() ?? {}

    if (!Guards.isDefined(context)) {
      AppError.throw({
        code: ERROR_CODES.AUTHENTICATION_FAILED,
        message: ERROR_CODE_MESSAGES[ERROR_CODES.AUTHENTICATION_FAILED],
        status: STATUS_CODES.UNAUTHORIZED,
        cause: new Error('User is not authenticated.'),
        name: this.constructor.name,
      })
    }

    return context.identity
  }
}
