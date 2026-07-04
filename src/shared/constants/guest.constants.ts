import { ROLES } from './roles.constants'

/**
 * @description The GUEST constant represents a default guest user identity with no specific user ID or tenant ID, assigned the GUEST role, and no permissions. This constant can be used throughout the application to represent unauthenticated users or users with minimal access rights, ensuring a consistent representation of guest users across the system.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const GUEST = Object.freeze({
  /** @description The unique identifier for the guest user, which is set to undefined since guest users do not have a specific user ID. This allows the application to differentiate between authenticated users with valid IDs and unauthenticated guest users.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  userId: undefined,
  /** @description The unique identifier for the tenant associated with the guest user, which is set to undefined since guest users do not belong to a specific tenant. This allows the application to handle multi-tenancy scenarios while still accommodating unauthenticated users who do not have an associated tenant.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  tenantId: undefined,
  /** @description An array of roles assigned to the guest user, which includes only the GUEST role. This indicates that the user has minimal access rights and is typically used to represent unauthenticated users or users with limited permissions in the application.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  roles: [ROLES.GUEST],
  /** @description An array of permissions assigned to the guest user, which is empty since guest users do not have any specific permissions. This reinforces the idea that guest users have minimal access rights and cannot perform actions that require specific permissions in the application.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  permissions: [],
} as const)
