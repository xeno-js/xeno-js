import type { AppError, ExecutionContext, Identity, IRequest, IRequestContext } from '@/domain'
import { Result } from '@/domain'
import { Guards, GuidHelper } from '@/shared'

import { BaseAuthorizationStrategy } from './base-authorization.strategy'

/**
 * @description Authorization strategy that checks if the authenticated user has the required user ID specified in the command. It extends the BaseAuthorizationStrategy and implements the performAuthorizationCheck method to verify if the user's ID matches the required user ID for the command. If the user is not authenticated or does not have the necessary user ID, it returns a failed Result with an appropriate AppError.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export class UserAuthorizationStrategy extends BaseAuthorizationStrategy<IRequest> {
  /** @description Constructs a new instance of the UserAuthorizationStrategy class, which is responsible for checking if the authenticated user has the required user ID specified in the command. It takes an IRequestContext as a parameter, which is used to retrieve the identity of the currently authenticated user during the authorization process.
   * @param requestContext An instance of IRequestContext used to access the identity of the currently authenticated user. This context is essential for performing the authorization checks based on the user's ID when executing commands that require specific user-based permissions.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  constructor(requestContext: IRequestContext<ExecutionContext>) {
    super(requestContext)
  }

  protected async performAuthorizationCheck(
    command: IRequest,
    auth: Identity,
  ): Promise<Result<void, AppError>> {
    if (Guards.isNullOrEmpty(auth.userId) || !GuidHelper.isValidGuid(auth.userId))
      return this.createUnauthError(command, 'User is not authenticated.')

    return Result.ok()
  }
}
