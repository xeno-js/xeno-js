import { BaseAuthorizationStrategy } from '@/application'
import type {
  AppError,
  ExecutionContext,
  IAuthService,
  IBaseRequest,
  Identity,
  IRequestContext,
} from '@/domain'
import { Result } from '@/domain'
import { Guards } from '@/shared'

/**
 * @description Authorization strategy that checks if the authenticated user has at least one of the required permissions specified in the command. It extends the BaseAuthorizationStrategy and implements the performAuthorizationCheck method to verify if the user's permissions match any of the required permissions for the command. If the user is not authenticated or does not have the necessary permissions, it returns a failed Result with an appropriate AppError.
 */
export class AuthorizationStrategy extends BaseAuthorizationStrategy<IBaseRequest> {
  /** @description Constructs a new instance of the AuthorizationStrategy class, which is responsible for checking if the authenticated user has the required permissions specified in the command. It takes an IRequestContext as a parameter, which is used to retrieve the identity of the currently authenticated user during the authorization process.
   * @param requestContext An instance of IRequestContext used to access the identity of the currently authenticated user. This context is essential for performing the authorization checks based on the user's permissions when executing commands that require specific permission-based access.
   */
  constructor(
    private readonly _authService: IAuthService,
    requestContext: IRequestContext<ExecutionContext>,
  ) {
    super(requestContext)
  }

  public isApplicable(command: IBaseRequest): command is IBaseRequest {
    return !Guards.isNullOrEmpty(command.permissions)
  }

  protected performAuthorizationCheck(
    command: IBaseRequest,
    auth: Identity,
  ): Result<void, AppError> {
    const permissions = auth.permissions ?? []
    for (const permission of permissions) {
      if (this._authService.authorize(auth, permission)) {
        return Result.ok()
      }
    }

    return this.createAuthError(command, 'User does not have the required permissions.')
  }
}
