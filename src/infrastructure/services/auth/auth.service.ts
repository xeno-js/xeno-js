import { type SupabaseClient } from '@supabase/supabase-js'

import type { IAuthService, ResultType } from '@/domain'
import { AppError, Result } from '@/domain'
import type { AuthClaims } from '@/shared'
import { ERROR_CODE_MESSAGES, ERROR_CODES, Guards, STATUS_CODES } from '@/shared'

export class AuthService implements IAuthService {
  constructor(private readonly _supabase: SupabaseClient) {}

  public async getClaims(token: string): Promise<ResultType<AuthClaims>> {
    const { data, error } = await this._supabase.auth.getUser(token)

    if (Guards.isDefined(error) || !Guards.isDefined(data.user)) {
      return Result.fail(this.createAuthError(error?.message ?? 'Unknown error'))
    }
    const user = data.user

    if (Guards.isDefined(user.deleted_at)) {
      return Result.fail(this.createAuthError('This user has been deleted'))
    }

    if (Guards.isDefined(user.banned_until)) {
      if (new Date(user.banned_until) > new Date()) {
        return Result.fail(this.createAuthError('This user is temporarily suspended'))
      }
    }
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
      email: user.email,
      tenantId,
      roles,
      permissions,
      deletedAt: user.deleted_at,
      bannedUntil: user.banned_until,
    }
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
