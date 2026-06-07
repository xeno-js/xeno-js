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
 * @description Pipeline behavior that establishes the Multi-Tenant boundary by ensuring that the tenantId is present and valid in the incoming command. If the tenantId is missing or invalid, it returns a failed Result with an appropriate AppError indicating that the tenant is not authenticated. This pipeline should be placed early in the pipeline chain to prevent unauthorized access to tenant-specific resources and ensure that all subsequent operations are executed within the correct tenant context.
 */
export class TenantContextPipeline<
  TInput extends ISecureCommand<TResult>,
  TResult,
> implements IPipelineBehavior<TInput, TResult> {
  public async handle(request: TInput, next: Delegate<TResult>): Promise<ResultType<TResult>> {
    if (Guards.isNullOrEmpty(request.tenantId)) {
      return Result.fail(
        AppError.create({
          code: PIPELINE_ERROR_CODES.AUTH_UNAUTHENTICATED,
          message: PIPELINE_ERROR_CODES_KEYS[PIPELINE_ERROR_CODES.AUTH_UNAUTHENTICATED],
          status: STATUS_CODES.UNAUTHORIZED,
          name: request.token.symbol.toString(),
          cause: new Error(`Tenant is not authenticated.`),
        }),
      )
    }

    return next()
  }
}
