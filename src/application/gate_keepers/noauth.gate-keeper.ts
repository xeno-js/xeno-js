import type { Identity, IGateKeeper, ResultType } from '@xeno-js/shared'
import type { Optional } from '@xeno-js/shared'
import { Result } from '@xeno-js/shared'
import { GUEST } from '@xeno-js/shared'

/**
 * @description The NoAuthGateKeeper class is a specialized implementation of the IGateKeeper interface that bypasses authentication and authorization checks. It is designed for scenarios where authentication is not required, such as public endpoints or testing environments. The authenticate method returns a guest identity, effectively granting access without requiring a valid token.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class NoAuthGateKeeper implements IGateKeeper {
  public async authenticate(_token: Optional<string>): Promise<ResultType<Identity>> {
    const guest = GUEST as unknown as Identity

    return Result.ok(guest)
  }
}
