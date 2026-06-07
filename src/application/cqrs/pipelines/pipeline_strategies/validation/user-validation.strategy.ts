import { BaseValidationStrategy } from '@/application'
import type { ISecureCommand, ResultType } from '@/domain'
import { Result } from '@/domain'
import { Guards, GuidHelper } from '@/shared'

/**
 * @description Strategy that checks the integrity of secure commands by validating the user ID. It implements the IStrategy interface and is applicable to any command that implements the ISecureCommand interface. The strategy verifies that the user ID is a valid and non-empty GUID, ensuring that the command has not been tampered with or contains uninitialized values. If the validation fails, it returns a failed Result with an appropriate AppError indicating a validation error.
 */
export class UserIntegrityStrategy extends BaseValidationStrategy {
  public isApplicable(request: ISecureCommand): boolean {
    return !Guards.isNullOrEmpty(request.userId)
  }

  public async execute(request: ISecureCommand): Promise<ResultType<boolean>> {
    if (!GuidHelper.isValid(request.userId) || GuidHelper.isEmpty(request.userId))
      return this.createValidationError(request, 'Malicious or uninitialized Guid detected.')

    return Result.ok(true)
  }
}
