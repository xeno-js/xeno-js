/**
 * @fileoverview Defines the BaseRequest class, which serves as a base implementation for both command and query requests in a CQRS architecture. The BaseRequest class implements the IBaseRequest interface and provides common properties such as the request type, timestamp, and a unique token for identification.
 */

import type { IBaseRequest } from '@/domain'
import type { Dictionary, Guid, Optional, RequestType } from '@/shared'

/**
 * A class representing a base request in a CQRS architecture. This class implements the IBaseRequest interface and provides common properties and functionality for both command and query requests.
 */
export abstract class BaseRequest implements IBaseRequest {
  /**
   * Constructs a new BaseRequest instance with the provided properties.
   * @param id A unique identifier for the request, which can be used for tracing and correlation purposes.
   * @param timestamp The timestamp when the request was created.
   * @param correlationId A unique identifier used to correlate related requests.
   * @param tenantId An optional identifier for the tenant associated with the request.
   * @param intent A string representing the intent of the request.
   * @param type The type of the request, which can be used to distinguish between different kinds of requests (e.g., command, query).
   * @param userId An optional identifier for the user making the request.
   * @param roles An optional array of roles associated with the user.
   * @param permissions An optional array of permissions associated with the user.
   * @param rawHeaders An optional dictionary of raw headers associated with the request.
   * @param signal An optional AbortSignal to allow cancellation of the request.
   */
  protected constructor(
    public readonly id: Guid,
    public readonly timestamp: Date,
    public readonly correlationId: Guid,
    public readonly tenantId: Optional<Guid>,
    public readonly intent: string,
    public readonly type: RequestType,
    public readonly userId: Optional<Guid>,
    public readonly roles: Optional<readonly string[]>,
    public readonly permissions: Optional<readonly string[]>,
    public readonly rawHeaders: Optional<Dictionary<string>>,
    public readonly signal: Optional<AbortSignal>,
  ) {}
}
