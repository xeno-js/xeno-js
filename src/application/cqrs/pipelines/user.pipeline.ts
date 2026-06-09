import {
  AppError,
  type Delegate,
  type IPipelineBehavior,
  type ISecureCommand,
  Result,
  type ResultType,
} from '@/domain'
import { Guards, PIPELINE_ERROR_CODES, PIPELINE_ERROR_CODES_KEYS, STATUS_CODES } from '@/shared'

/**
 * @description Pipeline behavior that establishes the User boundary by ensuring that the userId is present and valid in the incoming command. If the userId is missing or invalid, it returns a failed Result with an appropriate AppError indicating that the user is not authenticated. This pipeline should be placed early in the pipeline chain to prevent unauthorized access to user-specific resources and ensure that all subsequent operations are executed within the correct user context.
 */
export class UserContextPipeline<
  TInput extends ISecureCommand<TResult>,
  TResult,
> implements IPipelineBehavior<TInput, TResult> {
  public async handle(request: TInput, next: Delegate<TResult>): Promise<ResultType<TResult>> {
    if (Guards.isNullOrEmpty(request.userId)) {
      return Result.fail(
        AppError.create({
          code: PIPELINE_ERROR_CODES.AUTHORIZATION_FAILED,
          message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.AUTHORIZATION_FAILED],
          status: STATUS_CODES.UNAUTHORIZED,
          name: request.token.symbol.toString(),
          cause: new Error(`User is not authenticated.`),
        }),
      )
    }

    return next()
  }
}
