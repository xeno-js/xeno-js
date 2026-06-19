import type { AppError, ExecutionContext, Identity, IRequest, IRequestContext } from '@/domain'
import { Result } from '@/domain'
import { Guards, GuidHelper } from '@/shared'

import { BaseAuthorizationStrategy } from './base-authorization.strategy'

/**
 * @description Authorization strategy that checks if the authenticated tenant has the required tenant ID specified in the command. It extends the BaseAuthorizationStrategy and implements the performAuthorizationCheck method to verify if the tenant's ID matches the required tenant ID for the command. If the tenant is not authenticated or does not have the necessary tenant ID, it returns a failed Result with an appropriate AppError.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class TenantAuthorizationStrategy extends BaseAuthorizationStrategy<IRequest> {
  /** @description Constructs a new instance of the TenantAuthorizationStrategy class, which is responsible for checking if the authenticated tenant has the required tenant ID specified in the command. It takes an IRequestContext as a parameter, which is used to retrieve the identity of the currently authenticated tenant during the authorization process.
   * @param requestContext An instance of IRequestContext used to access the identity of the currently authenticated tenant. This context is essential for performing the authorization checks based on the tenant's ID when executing commands that require specific tenant-based permissions.
   *
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  constructor(requestContext: IRequestContext<ExecutionContext>) {
    super(requestContext)
  }

  protected async performAuthorizationCheck(
    command: IRequest,
    auth: Identity,
  ): Promise<Result<void, AppError>> {
    if (Guards.isNullOrEmpty(auth.tenantId) || !GuidHelper.isValidGuid(auth.tenantId))
      return this.createUnauthError(command, 'Tenant is not authenticated.')

    return Result.ok()
  }
}
