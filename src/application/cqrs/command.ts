import { BaseRequest } from '@/application'
import type { ICommand } from '@/domain'
import type { Dictionary, Guid, Optional } from '@/shared'
import { REQUEST_TYPE } from '@/shared'

/**
 * @fileoverview Defines the Command class, which serves as a base implementation for command requests in a CQRS architecture. The Command class implements the ICommand interface and provides common properties such as the request type, timestamp, and a unique token for identification.
 */

/**
 * A class representing a command request in a CQRS architecture. This class implements the ICommand interface and provides common properties and functionality for all command requests.
 * @template T - The type of the response that the command will return after being handled.
 */
export abstract class Command<T = unknown> extends BaseRequest implements ICommand<T> {
  /**
   * Constructs a new Command instance with a unique token based on the provided string.
   * @param token A string used to create a unique token for this command, which can be used for idempotency and tracing purposes.
   */
  protected constructor(
    public readonly payload: T,
    id: Guid,
    timestamp: Date,
    correlationId: Guid,
    tenantId: Optional<Guid>,
    intent: string,
    userId: Optional<Guid>,
    roles: Optional<readonly string[]>,
    permissions: Optional<readonly string[]>,
    rawHeaders: Optional<Dictionary<string>>,
    signal: Optional<AbortSignal>,
  ) {
    super(
      id,
      timestamp,
      correlationId,
      tenantId,
      intent,
      REQUEST_TYPE.COMMAND,
      userId,
      roles,
      permissions,
      rawHeaders,
      signal,
    )
  }
}
