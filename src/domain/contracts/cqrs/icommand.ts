import type { IBaseRequest } from '@/domain'
import type { Guid, Optional } from '@/shared'

/**
 * @fileoverview Defines the ICommand interface for command requests in a CQRS architecture.
 */

/**
 * @description An interface representing a command request, which extends the IBaseRequest interface and includes a payload property for carrying the data necessary to execute the command. This allows command handlers to access the relevant data needed to perform the desired action in a CQRS architecture.
 */
export interface ICommand<T = unknown> extends IBaseRequest<T> {
  /** @description The payload of the command, which contains the data necessary to execute the command. This can be any type of data relevant to the specific command being executed. */
  readonly payload: T
}

/**
 * @description An interface representing a secure command request, which extends the base ICommand interface and includes a userId and (Optional) tenantId property for identifying the user and (Optional) tenant associated with the command. This can be used for authorization and auditing purposes in a CQRS architecture.
 */
export interface ISecureCommand<T = unknown> extends ICommand<T> {
  /** @description The unique identifier of the user associated with the command, which can be used for authorization and auditing purposes. */
  readonly userId: Guid

  /** @description The tenant ID associated with the user, which can be used for multi-tenant applications to ensure that commands are executed within the correct tenant context. */
  readonly tenantId: Optional<Guid>

  /** @description The roles required to execute the command, which can be used for authorization purposes. */
  readonly requiredRoles: Optional<readonly string[]>
}
