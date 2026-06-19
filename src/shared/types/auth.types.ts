import type { Optional } from './common.types'

/**
 * @file auth.types.ts
 * @description Defines types related to authentication and authorization.
 */

/**
 * @description An interface representing the claims associated with an authenticated user. This typically includes standard claims such as 'sub' (subject) and 'email', as well as any additional claims that may be relevant to the application's authorization logic.
 */
export interface AuthClaims {
  /**
   * The unique identifier for the user (subject).
   */
  readonly sub: string
  /**
   * The tenant ID associated with the user, if applicable. This is useful in multi-tenant applications to identify which tenant the user belongs to.
   */
  readonly tenantId: Optional<string>
  /**
   * An array of roles assigned to the user. This can be used for role-based access control (RBAC) to determine what actions the user is authorized to perform.
   */
  readonly roles: Optional<string[]>
  /**
   * An array of permissions assigned to the user. This can be used for permission-based access control to determine what specific operations the user is authorized to perform.
   */
  readonly permissions: Optional<string[]>
}
