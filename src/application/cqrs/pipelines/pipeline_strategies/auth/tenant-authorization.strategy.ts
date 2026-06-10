import { BaseAuthorizationStrategy } from '@/application'
import type { AppError, ExecutionContext, IBaseRequest, Identity, IRequestContext } from '@/domain'
import { Result } from '@/domain'
import { Guards } from '@/shared'

/**
 * @description Authorization strategy that checks if the authenticated tenant has the required tenant ID specified in the command. It extends the BaseAuthorizationStrategy and implements the performAuthorizationCheck method to verify if the tenant's ID matches the required tenant ID for the command. If the tenant is not authenticated or does not have the necessary tenant ID, it returns a failed Result with an appropriate AppError.
 */
export class TenantAuthorizationStrategy extends BaseAuthorizationStrategy<IBaseRequest> {
  /** @description Constructs a new instance of the TenantAuthorizationStrategy class, which is responsible for checking if the authenticated tenant has the required tenant ID specified in the command. It takes an IRequestContext as a parameter, which is used to retrieve the identity of the currently authenticated tenant during the authorization process.
   * @param requestContext An instance of IRequestContext used to access the identity of the currently authenticated tenant. This context is essential for performing the authorization checks based on the tenant's ID when executing commands that require specific tenant-based permissions.
   */
  constructor(requestContext: IRequestContext<ExecutionContext>) {
    super(requestContext)
  }

  public isApplicable(command: IBaseRequest): command is IBaseRequest {
    return !Guards.isNullOrEmpty(command.tenantId)
  }

  protected performAuthorizationCheck(
    command: IBaseRequest,
    auth: Identity,
  ): Result<void, AppError> {
    if (auth.tenantId !== command.tenantId)
      return this.createAuthError(command, 'Tenant authenticated mismatch.')

    return Result.ok()
  }
}
