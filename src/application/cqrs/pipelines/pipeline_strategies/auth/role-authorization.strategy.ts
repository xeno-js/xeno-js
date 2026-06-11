import { BaseAuthorizationStrategy } from '@/application'
import type { AppError, IRequestContext } from '@/domain'
import { Result } from '@/domain'
import type { ExecutionContext, IBaseRequest, Identity } from '@/shared'
import { Guards } from '@/shared'

/**
 * @description Authorization strategy that checks if the authenticated user has at least one of the required roles specified in the command. It extends the BaseAuthorizationStrategy and implements the performAuthorizationCheck method to verify if the user's roles match any of the required roles for the command. If the user is not authenticated or does not have the necessary roles, it returns a failed Result with an appropriate AppError.
 */
export class RoleAuthorizationStrategy extends BaseAuthorizationStrategy<IBaseRequest> {
  /** @description Constructs a new instance of the RoleAuthorizationStrategy class, which is responsible for checking if the authenticated user has the required roles specified in the command. It takes an IRequestContext as a parameter, which is used to retrieve the identity of the currently authenticated user during the authorization process.
   * @param requestContext An instance of IRequestContext used to access the identity of the currently authenticated user. This context is essential for performing the authorization checks based on the user's roles when executing commands that require specific role-based permissions.
   */
  constructor(requestContext: IRequestContext<ExecutionContext>) {
    super(requestContext)
  }

  public isApplicable(command: IBaseRequest): command is IBaseRequest {
    return !Guards.isNullOrEmpty(command.roles)
  }

  protected performAuthorizationCheck(
    command: IBaseRequest,
    auth: Identity,
  ): Result<void, AppError> {
    const roles = auth.roles ?? []
    const hasRequiredRole = command.roles?.some((role) => roles.includes(role))
    if (!Guards.isDefined(hasRequiredRole))
      return this.createAuthError(command, 'User does not have the required roles.')

    return Result.ok()
  }
}
