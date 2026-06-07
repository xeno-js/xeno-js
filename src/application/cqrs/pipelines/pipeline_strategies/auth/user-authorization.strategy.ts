import { BaseAuthorizationStrategy } from '@/application'
import type { AppError, Identity, IRequestContext, ISecureCommand } from '@/domain'
import { Result } from '@/domain'
import { Guards } from '@/shared'

/**
 * @description Authorization strategy that checks if the authenticated user has the required user ID specified in the command. It extends the BaseAuthorizationStrategy and implements the performAuthorizationCheck method to verify if the user's ID matches the required user ID for the command. If the user is not authenticated or does not have the necessary user ID, it returns a failed Result with an appropriate AppError.
 */
export class UserAuthorizationStrategy extends BaseAuthorizationStrategy<ISecureCommand> {
  /** @description Constructs a new instance of the UserAuthorizationStrategy class, which is responsible for checking if the authenticated user has the required user ID specified in the command. It takes an IRequestContext as a parameter, which is used to retrieve the identity of the currently authenticated user during the authorization process.
   * @param requestContext An instance of IRequestContext used to access the identity of the currently authenticated user. This context is essential for performing the authorization checks based on the user's ID when executing commands that require specific user-based permissions.
   */
  constructor(requestContext: IRequestContext<Identity>) {
    super(requestContext)
  }

  public isApplicable(command: ISecureCommand): command is ISecureCommand {
    return !Guards.isNullOrEmpty(command.userId)
  }

  protected performAuthorizationCheck(
    command: ISecureCommand,
    auth: Identity,
  ): Result<void, AppError> {
    if (auth.userId !== command.userId)
      return this.createAuthError(command, 'User authenticated mismatch.')

    return Result.ok()
  }
}
