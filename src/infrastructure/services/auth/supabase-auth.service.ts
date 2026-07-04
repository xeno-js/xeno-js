import type { SupabaseClient, User } from '@supabase/supabase-js'

import type { IAuthService, IBaseMapper, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import type { AuthClaims } from '@/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, Guards, STATUS_CODES } from '@/shared'

/**
 * @description The SupabaseAuthService class is responsible for handling authentication-related operations using a SupabaseClient instance. It implements the IAuthService interface, providing methods to check if a user is authenticated and to retrieve authentication claims from a given token. The authenticate method interacts with the Supabase authentication API to fetch user information based on the provided token, while the isAuthenticated method checks if there is an active session. The class also includes error handling to create standardized authentication errors when necessary.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class SupabaseAuthService implements IAuthService {
  constructor(
    private readonly _supabase: SupabaseClient,
    private readonly _mapper: IBaseMapper<User, AuthClaims>,
  ) {}

  public async authenticate(token: string): Promise<ResultType<AuthClaims>> {
    const { data, error } = await this._supabase.auth.getUser(token)

    if (Guards.isDefined(error) || !Guards.isDefined(data.user)) {
      return Result.fail(this.createForbiddenError(error?.message ?? 'Unknown error'))
    }

    const user = data.user
    const claims = this._mapper.map(user)
    return Result.ok(claims)
  }

  public async isAuthenticated(): Promise<boolean> {
    const session = await this._supabase.auth.getSession()
    return Guards.isDefined(session.data.session)
  }

  /**
   * @description Creates an authentication error with a standardized format.
   * @param message The error message to include in the authentication error.
   * @returns An AppError instance representing the authentication error.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  private createForbiddenError(message: string): AppError {
    return AppError.create({
      code: ERROR_CODES.AUTHENTICATION_FAILED,
      message: ERROR_CODE_MESSAGES[ERROR_CODES.AUTHENTICATION_FAILED],
      name: 'AuthenticationService',
      status: STATUS_CODES.UNAUTHORIZED,
      cause: message,
    })
  }
}
