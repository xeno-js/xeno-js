import type { Identity, IStrategy, ResultType } from '@/domain'
import { Result } from '@/domain'
import { GUEST, type Optional } from '@/shared'

/**
 * Empty middleware strategy (Null Object Pattern) for pure showcase sites without authentication
 */
export class GuestMiddleware implements IStrategy<Optional<string>, Identity> {
  public isApplicable(_token: Optional<string>): boolean {
    return true
  }

  public async execute(_token: Optional<string>): Promise<ResultType<Identity>> {
    return Result.ok(GUEST as unknown as Identity) // Always anonymous, zero external calls
  }
}
