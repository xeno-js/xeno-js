import type { IAuthService, IBaseMapper, Identity, IStrategy, ResultType } from '@/domain'
import { Result } from '@/domain'
import type { AuthClaims, Optional } from '@/shared'
import { Guards, GUEST } from '@/shared'

/**
 * Strategia reale che interroga il GateKeeper (per siti con Auth)
 */
export class AuthMiddleware implements IStrategy<Optional<string>, Identity> {
  constructor(
    private readonly _authService: IAuthService,
    private readonly _mapper: IBaseMapper<AuthClaims, Identity>,
  ) {}

  public isApplicable(_token: Optional<string>): boolean {
    return true
  }

  public async execute(token: Optional<string>): Promise<ResultType<Identity>> {
    const guest = GUEST as unknown as Identity

    if (Guards.isNullOrEmpty(token)) {
      return Result.ok(guest)
    }

    const authResult = await this._authService.getClaims(token)
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
