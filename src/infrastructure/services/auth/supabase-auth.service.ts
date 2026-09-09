import type { Session as SupabaseSession, SupabaseClient, User } from '@supabase/supabase-js'
import type {
  AuthClaims,
  IAuthService,
  IBaseMapper,
  Optional,
  ResultType,
  Session,
} from '@xeno-js/shared'
import { AppError, Guards, Result } from '@xeno-js/shared'

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
    private readonly _sessionMapper: IBaseMapper<SupabaseSession, Session>,
  ) {}

  public async authenticate(token: string): Promise<ResultType<AuthClaims>> {
    const { data, error } = await this._supabase.auth.getUser(token)

    if (Guards.isDefined(error) || !Guards.isDefined(data.user)) {
      return Result.fail(
        AppError.authFailed('SupabaseAuthenticationService', error?.message ?? 'Unknown error'),
      )
    }

    const user = data.user
    const claims = this._mapper.map(user)
    return Result.ok(claims)
  }

  public async isAuthenticated(): Promise<boolean> {
    const session = await this._supabase.auth.getSession()
    return Guards.isDefined(session.data.session)
  }

  public async exchangeCodeForSession(code: string): Promise<ResultType<Optional<Session>>> {
    const { data, error } = await this._supabase.auth.exchangeCodeForSession(code)
    if (Guards.isDefined(error) || !Guards.isDefined(data.session))
      return Result.fail(
        AppError.authFailed('SupabaseAuthenticationService', error?.message ?? 'Unknown error'),
      )

    const session = data.session

    if (Guards.isDefined(session)) return Result.ok(this._sessionMapper.map(session))

    return Result.ok()
  }
}
