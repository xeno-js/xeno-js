import type { Delegate, IPipelineBehavior, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import type { IBaseRequest } from '@/shared'
import { PIPELINE_ERROR_CODES, PIPELINE_ERROR_CODES_KEYS, STATUS_CODES } from '@/shared'

/**
 * @description A pipeline behavior that handles exceptions thrown during the execution of a request in the CQRS pattern. It catches any unhandled exceptions, wraps them in an AppError with a standardized error code and message, and returns a failed Result containing the AppError. This ensures that exceptions are consistently handled and logged across the application, providing a clear mechanism for error reporting and debugging in the context of CQRS pipelines.
 * @template TInput - The type of the input request, which must extend IBaseRequest.
 * @template TResult - The type of the result returned by the pipeline, which can be any type.
 */
export class ExceptionPipeline<TInput extends IBaseRequest, TResult> implements IPipelineBehavior<
  TInput,
  TResult
> {
  public async handle(request: TInput, next: Delegate<TResult>): Promise<ResultType<TResult>> {
    try {
      return await next()
    } catch (error: unknown) {
      if (error instanceof AppError) return Result.fail(error)

      const appError = AppError.create({
        code: PIPELINE_ERROR_CODES.SYSTEM_EXCEPTION,
        message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.SYSTEM_EXCEPTION],
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        name: request.intent,
        cause: error,
      })
      return Result.fail(appError)
    }
  }
}
