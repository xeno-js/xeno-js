import { BaseValidationStrategy } from '@/application'
import type { ISecureCommand, ResultType } from '@/domain'
import { Result } from '@/domain'
import { Guards, GuidHelper } from '@/shared'

/**
 * @description Strategy that checks the integrity of secure commands by validating the tenant ID. It implements the IStrategy interface and is applicable to any command that implements the ISecureCommand interface. The strategy verifies that the tenant ID is a valid and non-empty GUID, ensuring that the command has not been tampered with or contains uninitialized values. If the validation fails, it returns a failed Result with an appropriate AppError indicating a validation error.
 */
export class TenantIntegrityStrategy extends BaseValidationStrategy {
  public isApplicable(request: ISecureCommand): boolean {
    return !Guards.isNullOrEmpty(request.tenantId)
  }

  public async execute(request: ISecureCommand): Promise<ResultType<boolean>> {
    if (
      !Guards.isDefined(request.tenantId) ||
      !GuidHelper.isValid(request.tenantId) ||
      GuidHelper.isEmpty(request.tenantId)
    )
      return this.createValidationError(request, 'Malicious or uninitialized Guid detected.')

    return Result.ok(true)
  }
}
