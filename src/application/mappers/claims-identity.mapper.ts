import type { IBaseMapper, Identity } from '@/domain'
import type { AuthClaims } from '@/shared'
import { GuidHelper } from '@/shared'

/**
 * @description ClaimsIdentityMapper is responsible for mapping authentication claims (AuthClaims) to an Identity object. This mapper takes the claims extracted from a token (such as a JWT) and transforms them into a structured Identity that can be used throughout the application for authentication and authorization purposes. The mapping includes parsing the user ID and tenant ID from the claims, as well as extracting roles and permissions.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export class ClaimsIdentityMapper implements IBaseMapper<AuthClaims, Identity> {
  public map(claims: AuthClaims): Identity {
    return {
      userId: GuidHelper.parse(claims.sub),
      tenantId: GuidHelper.parse(claims.tenantId),
      roles: claims.roles,
      permissions: claims.permissions,
    }
  }
}
