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
  readonly roles: Optional<string[]>

  /** @description The email address of the user, which can be used for contact and identification purposes. */
  readonly email?: Optional<string>

  /** @description The permissions assigned to the user, which can be used for fine-grained authorization checks. */
  readonly permissions?: Optional<string[]>

  /** @description The timestamp indicating when the user's account was deleted, if applicable. */
  readonly deletedAt?: Optional<Date>

  /** @description The timestamp indicating until when the user's account is banned, if applicable. */
  readonly bannedUntil?: Optional<Date>

  /** @description The correlation ID associated with the user's identity, which can be used for tracing and debugging purposes across different components of the application. */
  readonly correlationId: Optional<string>
}
