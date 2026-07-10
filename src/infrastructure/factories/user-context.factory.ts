import type { IFactory, IIdentityAccessor } from '@/domain'
import type { Guid, Optional, UserContext } from '@/shared'
import { Guards } from '@/shared'

/**
 * @description Factory class responsible for creating instances of UserContext. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the UserContext, promoting separation of concerns and flexibility in managing user context instances across the application.
 *
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class UserContextFactory implements IFactory<void, UserContext> {
  /**
   * @description Constructs an instance of UserContextFactory.
   * @param _identityFactory - An instance of IIdentityAccessor that provides access to the current identity. This factory is used to retrieve the identity details when creating a UserContext instance.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  constructor(private readonly _identityFactory: IIdentityAccessor) {}

  public create(): UserContext {
    const output: { userId: Optional<Guid>; tenantId: Optional<Guid> } = {
      userId: undefined,
      tenantId: undefined,
    }

    const identity = this._identityFactory.getIdentity()

    if (Guards.isDefined(identity)) {
      output.userId = identity.userId
      output.tenantId = identity.tenantId
    }

    return output
  }
}
