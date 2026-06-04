import type { Guid, Optional } from '@/shared'

import type { IBaseRequest } from './index'

/**
 * @fileoverview Defines the ICommand interface for command requests in a CQRS architecture.
 */

/**
 * @description An interface representing a secure command request, which extends the base ICommand interface and includes a userId property for identifying the user associated with the command. This can be used for authorization and auditing purposes in a CQRS architecture.
 */
export interface ISecureCommand<T = unknown> extends IBaseRequest<T> {
  /** @description The unique identifier of the user associated with the command, which can be used for authorization and auditing purposes. */
  readonly userId: Guid

  /** @description The roles required to execute the command, which can be used for authorization purposes. */
  readonly requiredRoles: Optional<readonly string[]>
}
