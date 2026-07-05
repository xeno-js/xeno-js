/**
 * @fileoverview This file defines the roles used within the application. The ROLES constant is an object that contains the different roles available, such as SUPER_ADMIN, ADMIN, USER, and GUEST. Each role is represented as a string value. The Role type is defined as a union of the values of the ROLES object, allowing for type safety when working with roles throughout the application.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */

/** @description An object containing the different roles available within the application. Each role is represented as a string value.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export const ROLES = Object.freeze({
  /** @description The SUPER_ADMIN role, which typically has the highest level of permissions and access within the application.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  SUPER_ADMIN: 'super_admin',
  /** @description The ADMIN role, which typically has elevated permissions and access within the application, but may have some restrictions compared to the SUPER_ADMIN role.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  ADMIN: 'admin',
  /** @description The USER role, which typically has standard permissions and access within the application, allowing them to perform regular user actions but with limited administrative capabilities.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  USER: 'user',
  /** @description The GUEST role, which typically has the most limited permissions and access within the application, often used for unauthenticated users or users with very restricted access.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  GUEST: 'guest',
} as const)

/** @description A type representing the different roles available within the application. It is defined as a union of the values of the ROLES object, allowing for type safety when working with roles throughout the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export type Role = (typeof ROLES)[keyof typeof ROLES]

/** @description An object containing the different permissions available within the application. Each permission is represented as a string value.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export const PERMISSIONS = Object.freeze({
  /** @description The READ permission, which typically allows access to resources or actions within the application that require read-only access.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  READ: 'read',
} as const)

/** @description A type representing the different permissions available within the application. It is defined as a union of the values of the PERMISSIONS object, allowing for type safety when working with permissions throughout the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
