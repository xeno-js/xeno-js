import { type SupabaseClient } from '@supabase/supabase-js'

import type { IAuthService, Identity, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import type { AuthClaims } from '@/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, Guards, STATUS_CODES } from '@/shared'

/**
 * @description The AuthService class is responsible for handling authentication-related operations using a SupabaseClient instance. It implements the IAuthService interface, providing methods to check if a user is authenticated and to retrieve authentication claims from a given token. The getClaims method interacts with the Supabase authentication API to fetch user information based on the provided token, while the isAuthenticated method checks if there is an active session. The class also includes error handling to create standardized authentication errors when necessary.
 */
export class AuthService implements IAuthService {
  constructor(private readonly _supabase: SupabaseClient) {}

  public async getClaims(token: string): Promise<ResultType<AuthClaims>> {
    const { data, error } = await this._supabase.auth.getUser(token)

    if (Guards.isDefined(error) || !Guards.isDefined(data.user)) {
      return Result.fail(this.createAuthError(error?.message ?? 'Unknown error'))
    }

    const user = data.user
    const tenantId = Guards.isString(user.app_metadata?.['tenant_id'])
      ? user.app_metadata?.['tenant_id']
      : undefined
    const roles = Guards.isArray(user.app_metadata?.['roles'])
      ? (user.app_metadata?.['roles'] as string[])
      : undefined
    const permissions = Guards.isArray(user.app_metadata?.['permissions'])
      ? (user.app_metadata?.['permissions'] as string[])
      : undefined

    const claims: AuthClaims = {
      sub: user.id,
      tenantId,
      roles,
      permissions,
    }
    return Result.ok(claims)
  }

  public authorize(identity: Identity, permission: string): boolean {
    if (Guards.isNullOrEmpty(identity.permissions)) {
      return false
    }

    if (
      !Guards.isNullOrEmpty(identity.roles) &&
      (identity.roles.includes('SUPER_ADMIN') || identity.roles.includes('ADMIN'))
    ) {
      return true
    }

    return identity.permissions.includes(permission)
  }

  public async isAuthenticated(): Promise<boolean> {
    const session = await this._supabase.auth.getSession()
    return Guards.isDefined(session.data.session)
  }

  /**
   * @description Creates an authentication error with a standardized format.
   * @param message The error message to include in the authentication error.
   * @returns An AppError instance representing the authentication error.
   */
  private createAuthError(message: string): AppError {
    return AppError.create({
      code: ERROR_CODES.AUTHENTICATION_FAILED,
      message: ERROR_CODE_MESSAGES[ERROR_CODES.AUTHENTICATION_FAILED],
      name: 'AuthenticationError',
      status: STATUS_CODES.UNAUTHORIZED,
      cause: message,
    })
  }
}
