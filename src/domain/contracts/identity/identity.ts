import type { Guid, Optional } from '@/shared'

/**
 * @fileoverview Defines the Identity interface representing the authenticated user's identity in the system.
 */

/**
 * An interface representing the authenticated user's identity in the system. This interface includes properties such as the user's unique identifier, email address, and assigned roles, which can be used for authentication and authorization purposes throughout the application.
 */
export interface Identity {
  /** @description The unique identifier of the user. */
  readonly userId: Optional<Guid>

  /** @description The tenant ID associated with the user. */
  readonly tenantId: Optional<Guid>

  /** @description The roles assigned to the user, which can be used for authorization purposes. */
  readonly roles: Optional<readonly string[]>

  /** @description The correlation ID associated with the user's identity, which can be used for tracing and debugging purposes across different components of the application. */
  readonly correlationId: Optional<string>
}
