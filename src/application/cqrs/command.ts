import type { IBaseRequest, IHandler, ISecureCommand } from '@/domain'
import type { Guid, InjectionToken, Optional, RequestType } from '@/shared'
import { GuidHelper, REQUEST_TYPE, TokenHelper } from '@/shared'

/**
 * @fileoverview Defines the Command class, which serves as a base implementation for command requests in a CQRS architecture. The Command class implements the IBaseRequest interface and provides common properties such as the request type, timestamp, and a unique token for identification.
 */

/**
 * A class representing a command request in a CQRS architecture. This class implements the IBaseRequest interface and provides common properties and functionality for all command requests.
 * @template T - The type of the response that the command will return after being handled.
 */
export class Command<T = unknown> implements IBaseRequest<T> {
  /**
   * Constructs a new Command instance with a unique token based on the provided string.
   * @param token A string used to create a unique token for this command, which can be used for idempotency and tracing purposes.
   */
  protected constructor(
    public readonly id: Guid,
    public readonly type: RequestType,
    public readonly timestamp: Date,
    public readonly token: InjectionToken<IHandler<IBaseRequest<T>, T>>,
  ) {}

  /**
   * Static factory method to create a new Command instance with a unique token.
   * @param token A string used to create a unique token for this command, which can be used for idempotency and tracing purposes.
   * @returns A new instance of the Command class.
   */
  static create<T>(token: string, ..._args: unknown[]): IBaseRequest<T> {
    const id = GuidHelper.generate()
    const type = REQUEST_TYPE.QUERY
    const timestamp = new Date()
    const injectionToken = TokenHelper.createToken<IHandler<IBaseRequest<T>, T>>(token)
    return new Command<T>(id, type, timestamp, injectionToken)
  }
}

/**
 * @description A class representing a secure command request in a CQRS architecture. This class extends the base Command class and implements the ISecureCommand interface, providing additional properties for user identification and role-based authorization.
 */
export class SecureCommand<T = unknown> extends Command<T> implements ISecureCommand<T> {
  /**
   * Constructs a new SecureCommand instance with user identification and role-based authorization properties.
   * @param token A string used to create a unique token for this command, which can be used for idempotency and tracing purposes.
   * @param userId The unique identifier of the user associated with the command, which can be used for authorization and auditing purposes.
   * @param requiredRoles The roles required to execute the command, which can be used for authorization purposes (optional).
   */
  protected constructor(
    public readonly userId: Guid,
    public readonly requiredRoles: Optional<readonly string[]> = undefined,
    id: Guid,
    type: RequestType,
    timestamp: Date,
    token: InjectionToken<IHandler<IBaseRequest<T>, T>>,
  ) {
    super(id, type, timestamp, token)
    this.userId = userId
    this.requiredRoles = requiredRoles
  }

  static override create<T>(
    token: string,
    userId: Guid,
    requiredRoles: Optional<readonly string[]> = undefined,
  ): ISecureCommand<T> {
    if (!GuidHelper.isValid(userId)) {
      throw new Error('Invalid user ID')
    }

    const id = GuidHelper.generate()
    const type = REQUEST_TYPE.QUERY
    const timestamp = new Date()
    const injectionToken = TokenHelper.createToken<IHandler<IBaseRequest<T>, T>>(token)
    return new SecureCommand<T>(userId, requiredRoles, id, type, timestamp, injectionToken)
  }
}
