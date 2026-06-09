import type { IAuthService, Identity, IGateKeeper, IMapper, ResultType } from '@/domain'
import { Result } from '@/domain'
import type { AuthClaims, Optional } from '@/shared'
import { Guards, ROLES } from '@/shared'

/**
 * @description The GateKeeper class is responsible for handling authentication and authorization logic within the application. It implements the IGateKeeper interface and relies on an IAuthService to retrieve authentication claims from a provided token. The class uses an IMapper to convert the retrieved AuthClaims into an Identity object that can be used within the application. The authenticate method checks if the token is valid and returns the corresponding Identity, while the authorize method checks if the given Identity has the necessary permissions to perform certain actions based on their roles and permissions.
 */
export class GateKeeper implements IGateKeeper {
  /**
   * @description Constructs a new instance of the GateKeeper class, which takes an IAuthService and an IMapper as dependencies. The IAuthService is used to retrieve authentication claims from a provided token, while the IMapper is used to convert the retrieved AuthClaims into an Identity object that can be used within the application. This design allows for separation of concerns, where the GateKeeper focuses on authentication and authorization logic, while the IAuthService and IMapper handle their respective responsibilities.
   * @param _authService An instance of IAuthService used to retrieve authentication claims from a provided token.
   * @param _mapper An instance of IMapper used to convert AuthClaims into an Identity object.
   */
  constructor(
    private readonly _authService: IAuthService,
    private readonly _mapper: IMapper<Identity, AuthClaims>,
  ) {}

  public async authenticate(token: string): Promise<ResultType<Optional<Identity>>> {
    const result = await this._authService.getClaims(token)
    if (result.isOk()) {
      const claims = result.getValueOrThrow()
      if (Guards.isDefined(claims)) {
        const identity = this._mapper.toEntity(claims)
        return Result.ok(identity)
      }
      return Result.ok(undefined)
    }
    return Result.fail(result.getErrorOrThrow())
  }

  public async authorize(identity: Identity, permission: string): Promise<boolean> {
    if (Guards.isNullOrEmpty(identity) || Guards.isNullOrEmpty(identity.roles)) {
      return false
    }

    if (identity.roles.includes(ROLES.SUPER_ADMIN) || identity.roles.includes(ROLES.ADMIN))
      return true

    if (!Guards.isNullOrEmpty(identity.permissions))
      return identity.permissions.includes(permission)

    return false
  }
}
