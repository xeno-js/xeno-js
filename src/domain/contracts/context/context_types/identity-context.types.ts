import type { Guid, Optional } from '@/shared'

/**
 * @fileoverview Defines the Identity interface representing the authenticated user's identity in the system.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */

/**
 * An interface representing the authenticated user's identity in the system. This interface includes properties such as the user's unique identifier, email address, and assigned roles, which can be used for authentication and authorization purposes throughout the application.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export interface Identity {
  /** @description The unique identifier of the user.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  readonly userId: Optional<Guid>

  /** @description The tenant ID associated with the user.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  readonly tenantId: Optional<Guid>

  /** @description The roles assigned to the user, which can be used for authorization purposes.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  readonly roles: Optional<string[]>

  /** @description The permissions assigned to the user, which can be used for fine-grained authorization checks.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  readonly permissions: Optional<string[]>
}
