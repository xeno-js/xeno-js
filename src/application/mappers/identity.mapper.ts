import type { Identity, IMapper } from '@/domain'
import { type AuthClaims, Guards, GuidHelper } from '@/shared'

/**
 * @fileoverview IdentityMapper is responsible for mapping between the AuthClaims received from the authentication service and the Identity used within the application. It implements the IMapper interface to provide methods for converting between these two types.
 */
export class IdentityMapper implements IMapper<Identity, AuthClaims> {
  public toEntity(raw: AuthClaims): Identity {
    return {
      userId: GuidHelper.parse(raw.sub),
      tenantId: GuidHelper.parse(raw.tenantId),
      roles: raw.roles ?? [],
      email: raw.email,
      permissions: raw.permissions,
      deletedAt: Guards.isDefined(raw.deletedAt) ? new Date(raw.deletedAt) : undefined,
      bannedUntil: Guards.isDefined(raw.bannedUntil) ? new Date(raw.bannedUntil) : undefined,
      correlationId: undefined,
    }
  }

  public toDto(entity: Identity): AuthClaims {
    const authClaims: AuthClaims = {
      sub: entity.userId?.toString() ?? '',
      tenantId: entity.tenantId?.toString() ?? '',
      roles: entity.roles,
      email: entity.email,
      permissions: entity.permissions,
      deletedAt: entity.deletedAt?.toISOString(),
      bannedUntil: entity.bannedUntil?.toISOString(),
    }
    return authClaims
  }
}
