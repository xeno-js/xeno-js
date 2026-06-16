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
 * @description Authorization strategy that checks if the authenticated user has at least one of the required roles specified in the command. It extends the BaseAuthorizationStrategy and implements the performAuthorizationCheck method to verify if the user's roles match any of the required roles for the command. If the user is not authenticated or does not have the necessary roles, it returns a failed Result with an appropriate AppError.
 */
export class RoleAuthorizationStrategy extends BaseAuthorizationStrategy<IRequest> {
  /** @description Constructs a new instance of the RoleAuthorizationStrategy class, which is responsible for checking if the authenticated user has the required roles specified in the command. It takes an IRequestContext as a parameter, which is used to retrieve the identity of the currently authenticated user during the authorization process.
   * @param requestContext An instance of IRequestContext used to access the identity of the currently authenticated user. This context is essential for performing the authorization checks based on the user's roles when executing commands that require specific role-based permissions.
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
    const policy = await this._policy.getPolicy(command.intent)
    if (!Guards.isDefined(policy))
      return this.createAuthError(command, 'No authorization policy found for the command.')

    if (!Guards.isNullOrEmpty(policy.permissions)) {
      const roles = auth.roles ?? []
      const hasRequiredRole = policy.roles?.some((role) => roles.includes(role.toLowerCase()))
      if (!Guards.isDefined(hasRequiredRole))
        return this.createAuthError(command, 'User does not have the required roles.')
    }

    return Result.ok()
  }
}
