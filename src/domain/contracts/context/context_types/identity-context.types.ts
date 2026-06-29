import type { Guid, Optional } from '@/shared'

/**
 * @fileoverview Defines the Identity interface representing the authenticated user's identity in the system.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */

/**
 * An interface representing the authenticated user's identity in the system. This interface includes properties such as the user's unique identifier, email address, and assigned roles, which can be used for authentication and authorization purposes throughout the application.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export interface Identity {
  /** @description The unique identifier of the user.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  readonly userId: Optional<Guid>

  /** @description The tenant ID associated with the user.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  readonly tenantId: Optional<Guid>

  /** @description The roles assigned to the user, which can be used for authorization purposes.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  readonly roles: Optional<string[]>

  /** @description The permissions assigned to the user, which can be used for fine-grained authorization checks.
   *
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5
   */
  readonly permissions: Optional<string[]>
}
