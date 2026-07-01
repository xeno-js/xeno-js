import type { Optional } from './common.types'

/**
 * @file auth.types.ts
 * @description Defines types related to authentication and authorization.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */

/**
 * @description An interface representing the claims associated with an authenticated user. This typically includes standard claims such as 'sub' (subject) and 'email', as well as any additional claims that may be relevant to the application's authorization logic.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export interface AuthClaims {
  /**
   * The unique identifier for the user (subject).
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly sub: string
  /**
   * The tenant ID associated with the user, if applicable. This is useful in multi-tenant applications to identify which tenant the user belongs to.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly tenantId: Optional<string>
  /**
   * An array of roles assigned to the user. This can be used for role-based access control (RBAC) to determine what actions the user is authorized to perform.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly roles: Optional<string[]>
  /**
   * An array of permissions assigned to the user. This can be used for permission-based access control to determine what specific operations the user is authorized to perform.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  readonly permissions: Optional<string[]>
}
