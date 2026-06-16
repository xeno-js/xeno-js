import type { Identity, IGateKeeper, ResultType } from '@/domain'
import { Result } from '@/domain'
import type { Optional } from '@/shared'
import { GUEST } from '@/shared'

/**
 * @description The NoAuthGateKeeper class is a specialized implementation of the IGateKeeper interface that bypasses authentication and authorization checks. It is designed for scenarios where authentication is not required, such as public endpoints or testing environments. The authorize method always returns true, allowing access to any permission, while the authenticate method returns a guest identity, effectively granting access without requiring a valid token.
 */
export class NoAuthGateKeeper implements IGateKeeper {
  public authorize(_identity: Identity, _permission: string): boolean {
    return true
  }

  public async authenticate(_token: Optional<string>): Promise<ResultType<Identity>> {
    const guest = GUEST as unknown as Identity

    return Result.ok(guest)
  }
}
