import type { Guid, Optional } from './common.types'

/**
 * @file auth.types.ts
 * @description Defines types related to authentication and authorization.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */

/**
 * @description An interface representing the claims associated with an authenticated user. This typically includes standard claims such as 'sub' (subject) and 'email', as well as any additional claims that may be relevant to the application's authorization logic.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface AuthClaims {
  /**
   * The unique identifier for the user (subject).
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly sub: string
  /**
   * The tenant ID associated with the user, if applicable. This is useful in multi-tenant applications to identify which tenant the user belongs to.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly tenantId: Optional<string>
  /**
   * An array of roles assigned to the user. This can be used for role-based access control (RBAC) to determine what actions the user is authorized to perform.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly roles: Optional<string[]>
  /**
   * An array of permissions assigned to the user. This can be used for permission-based access control to determine what specific operations the user is authorized to perform.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  readonly permissions: Optional<string[]>
}

/**
 * @description An interface representing the context of an authenticated user, including their unique identifier and tenant ID. This context can be used throughout the application to enforce authorization rules and access control based on the user's identity and associated claims.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export interface UserContext {
  /**
   * The unique identifier for the user (subject).
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly userId: Guid

  /**
   * The tenant ID associated with the user, if applicable. This is useful in multi-tenant applications to identify which tenant the user belongs to.
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  readonly tenantId: Optional<Guid>
}
