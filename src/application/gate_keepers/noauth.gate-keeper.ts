import type { Identity, IGateKeeper, ResultType } from '@/domain'
import { Result } from '@/domain'
import type { Optional } from '@/shared'
import { GUEST } from '@/shared'

/**
 * @description The NoAuthGateKeeper class is a specialized implementation of the IGateKeeper interface that bypasses authentication and authorization checks. It is designed for scenarios where authentication is not required, such as public endpoints or testing environments. The authenticate method returns a guest identity, effectively granting access without requiring a valid token.

   * 
   * @author Gantry5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Gantry5 
   */
export class NoAuthGateKeeper implements IGateKeeper {
  public async authenticate(_token: Optional<string>): Promise<ResultType<Identity>> {
    const guest = GUEST as unknown as Identity

    return Result.ok(guest)
  }
}
