import type { ExecutionContext, ICache, IIdempotencyStore, IRequestContext } from '@/domain'
import type { Optional } from '@/shared'
import { Guards, IDEMPOTENCY_CONSTANTS } from '@/shared'

/**
 * @description The IdempotencyStore class provides an implementation of the IIdempotencyStore interface, utilizing a caching mechanism to manage locks and processed command results for idempotent operations. This class is designed to ensure that commands with the same ID are processed only once, preventing duplicate processing and allowing for retrieval of results from previously processed commands. The IdempotencyStore uses the IRequestContext to build contextual keys for storing locks and results in a multi-tenant environment, following the AWS SaaS Factory Pattern for logical partitioning. By leveraging the ICache interface, the IdempotencyStore can efficiently manage locks and stored results with configurable time-to-live (TTL) values, ensuring that stale data is automatically cleaned up over time.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class IdempotencyStore implements IIdempotencyStore {
  /**
   * @description Constructs a new instance of IdempotencyStore, accepting an instance of ICache for accessing the caching system and an instance of IRequestContext for obtaining the user's identity context. The IdempotencyStore uses the caching system to manage locks and results of idempotent commands, ensuring that commands with the same ID are processed only once. The identity context is used to build contextual keys, allowing for more granular management of idempotent commands in multi-tenant scenarios.
   * @param _cache An instance of ICache that provides methods to interact with the underlying caching system, used to store locks and results of idempotent commands.
   * @param _requestContext An instance of IRequestContext that allows access to the user's identity context, used to build contextual keys for idempotent commands, supporting multi-tenant scenarios.
  
   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  constructor(
    private readonly _cache: ICache,
    private readonly _requestContext: IRequestContext<ExecutionContext>,
  ) {}

  public async acquireLock(requestId: string, ttlSeconds: number): Promise<boolean> {
    const key = this.buildContextualKey(requestId)
    return await this._cache.setIfAbsent(
      `${IDEMPOTENCY_CONSTANTS.LOCK_KEY_PREFIX}${key}`,
      IDEMPOTENCY_CONSTANTS.LOCKED_VALUE,
      ttlSeconds,
    )
  }

  public async hasBeenProcessed(commandId: string): Promise<boolean> {
    const key = this.buildContextualKey(commandId)
    return await this._cache.has(`${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}${key}`)
  }

  public async markAsProcessed<T>(
    commandId: string,
    payload: T,
    ttlSeconds: number,
  ): Promise<void> {
    const key = this.buildContextualKey(commandId)
    await this._cache.set(
      `${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}${key}`,
      payload,
      ttlSeconds,
    )
  }

  public async getPayload<T>(commandId: string): Promise<Optional<T>> {
    const key = this.buildContextualKey(commandId)
    const payload = await this._cache.get<T>(`${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}${key}`)

    return payload
  }

  public async releaseLock(commandId: string): Promise<void> {
    const key = this.buildContextualKey(commandId)
    await this._cache.remove(`${IDEMPOTENCY_CONSTANTS.LOCK_KEY_PREFIX}${key}`)
  }

  /**
   * @description Builds a contextual key for the given requestId by incorporating the identity of the user from the request context. This method constructs a key that includes a tenant prefix if the identity is defined and has a tenantId, following the AWS SaaS Factory Pattern for logical partitioning. If the identity is not defined or does not have a tenantId, it falls back to a simpler key format without the tenant prefix. This contextual key is used for storing locks and processed command results in the cache, allowing for more granular management of idempotent commands in multi-tenant scenarios.
   * @param requestId The unique identifier for the command or request for which the contextual key is being built. This ID is used as part of the key construction to ensure that locks and processed results are associated with the correct command or request.
   * @returns A string representing the contextual key to be used in the cache for storing locks and processed command results, incorporating tenant information if available.
  
   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  private buildContextualKey(requestId: string): string {
    const { context } = this._requestContext.getContext() ?? {}

    // AWS SaaS Factory Pattern: logical partitioning via tenant prefix keyspace
    if (Guards.isDefined(context) && !Guards.isNullOrEmpty(context.identity.tenantId)) {
      return `tenant:${context.identity.tenantId}:commands:${requestId}`
    }

    return `commands:${requestId}`
  }
}
