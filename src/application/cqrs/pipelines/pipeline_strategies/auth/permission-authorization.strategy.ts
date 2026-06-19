import type {
  AppError,
  ExecutionContext,
  Identity,
  IPolicyRegistry,
  IRequest,
  IRequestContext,
} from '@/domain'
import { Result } from '@/domain'
import { Guards } from '@/shared'

import { BaseAuthorizationStrategy } from './base-authorization.strategy'

/**
 * @description Authorization strategy that checks if the authenticated user has at least one of the required permissions specified in the command. It extends the BaseAuthorizationStrategy and implements the performAuthorizationCheck method to verify if the user's permissions match any of the required permissions for the command. If the user is not authenticated or does not have the necessary permissions, it returns a failed Result with an appropriate AppError.
  
   * 
   * @author Mattia Carcione MC
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class PermissionAuthorizationStrategy extends BaseAuthorizationStrategy<IRequest> {
  /** @description Constructs a new instance of the PermissionAuthorizationStrategy class, which is responsible for checking if the authenticated user has the required permissions specified in the command. It takes an IRequestContext as a parameter, which is used to retrieve the identity of the currently authenticated user during the authorization process.
   * @param requestContext An instance of IRequestContext used to access the identity of the currently authenticated user. This context is essential for performing the authorization checks based on the user's permissions when executing commands that require specific permission-based access.
   *
   * @author Mattia Carcione °
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  constructor(
    private readonly _policy: IPolicyRegistry,
    requestContext: IRequestContext<ExecutionContext>,
  ) {
    super(requestContext)
  }

  protected async performAuthorizationCheck(
    command: IRequest,
    auth: Identity,
  ): Promise<Result<void, AppError>> {
    const policy = this._policy.getPolicy(command.intent)
    if (!Guards.isDefined(policy))
      return this.createAuthError(command, 'No authorization policy found for the command.')

    if (!Guards.isNullOrEmpty(policy.permissions)) {
      const permissions = auth.permissions ?? []
      const hasRequiredPermission = policy.permissions?.some((permission) =>
        permissions.includes(permission.toLowerCase()),
      )
      if (!Guards.isDefined(hasRequiredPermission))
        return this.createAuthError(command, 'User does not have the required permissions.')
    }

    return Result.ok()
  }
}
