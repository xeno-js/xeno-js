import { ROLES } from '@/shared'

/**
 * @description The GUEST constant represents a default guest user identity with no specific user ID or tenant ID, assigned the GUEST role, and no permissions. This constant can be used throughout the application to represent unauthenticated users or users with minimal access rights, ensuring a consistent representation of guest users across the system.
 */
export const GUEST = Object.freeze({
  userId: undefined,
  tenantId: undefined,
  roles: [ROLES.GUEST],
  permissions: undefined,
} as const)
