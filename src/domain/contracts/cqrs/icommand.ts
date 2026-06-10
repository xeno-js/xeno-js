import type { IBaseRequest } from '@/domain'

/**
 * @fileoverview Defines the ICommand interface for command requests in a CQRS architecture.
 */

/**
 * @description An interface representing a command request, which extends the IBaseRequest interface and includes a payload property for carrying the data necessary to execute the command. This allows command handlers to access the relevant data needed to perform the desired action in a CQRS architecture.
 */
export interface ICommand<TDto = unknown> extends IBaseRequest {
  /** @description The payload of the command, which contains the data necessary to execute the command. This can be any type of data relevant to the specific command being executed. */
  readonly payload: TDto
}
