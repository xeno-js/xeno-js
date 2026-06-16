import type { IAuthService, IBaseMapper, Identity, IGateKeeper, ResultType } from '@/domain'
import { Result } from '@/domain'
import type { AuthClaims, Optional } from '@/shared'
import { Guards, GUEST, ROLES } from '@/shared'

/**
 * @description The GateKeeper class is responsible for authorizing users based on their identity and permissions. It provides a method to check if a user has a specific permission, taking into account their roles and permissions. The authorize method checks if the user's permissions include the required permission or if they have a role that grants them access (e.g., SUPER_ADMIN or ADMIN). If the user does not have the necessary permissions, it returns false.
 */
export class GateKeeper implements IGateKeeper {
  constructor(
    private readonly _authService: IAuthService,
    private readonly _mapper: IBaseMapper<AuthClaims, Identity>,
  ) {}

  public authorize(identity: Identity, permission: string): boolean {
    if (Guards.isNullOrEmpty(identity.permissions)) {
      return false
    }

    if (
      !Guards.isNullOrEmpty(identity.roles) &&
      (identity.roles.includes(ROLES.SUPER_ADMIN) || identity.roles.includes(ROLES.ADMIN))
    ) {
      return true
    }

    return identity.permissions.includes(permission)
  }

  public async authenticate(token: Optional<string>): Promise<ResultType<Identity>> {
    const guest = GUEST as unknown as Identity

    if (Guards.isNullOrEmpty(token)) {
      return Result.ok(guest)
    }

    const authResult = await this._authService.authenticate(token)
    if (!authResult.isOk()) {
      return Result.fail(authResult.getErrorOrThrow())
    }

    const claims = authResult.getValueOrThrow()
    if (Guards.isNullOrEmpty(claims)) {
      return Result.ok(guest)
    }

    return Result.ok(this._mapper.map(claims))
  }
}
