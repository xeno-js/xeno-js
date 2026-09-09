import type { ICache, ICacheKeyBuilder, IIdempotencyStore } from '@xeno-js/shared'
import type { Optional } from '@xeno-js/shared'
import { IDEMPOTENCY_CONSTANTS } from '@xeno-js/shared'

/**
 * @description The IdempotencyStore class provides an implementation of the IIdempotencyStore interface, utilizing a caching mechanism to manage locks and processed command results for idempotent operations. This class is designed to ensure that commands with the same ID are processed only once, preventing duplicate processing and allowing for retrieval of results from previously processed commands. The IdempotencyStore uses the IRequestContext to build contextual keys for storing locks and results in a multi-tenant environment, following the AWS SaaS Factory Pattern for logical partitioning. By leveraging the ICache interface, the IdempotencyStore can efficiently manage locks and stored results with configurable time-to-live (TTL) values, ensuring that stale data is automatically cleaned up over time.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class IdempotencyStore implements IIdempotencyStore {
  /**
   * @description Constructs a new instance of IdempotencyStore, accepting an instance of ICache for accessing the caching system and an instance of IIdentityAccessor for obtaining the user's identity context. The IdempotencyStore uses the caching system to manage locks and results of idempotent commands, ensuring that commands with the same ID are processed only once. The identity context is used to build contextual keys, allowing for more granular management of idempotent commands in multi-tenant scenarios.
   * @param _cache An instance of ICache that provides methods to interact with the underlying caching system, used to store locks and results of idempotent commands.
   * @param _identityAccessor An instance of IIdentityAccessor that allows access to the user's identity context, used to build contextual keys for idempotent commands, supporting multi-tenant scenarios.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  constructor(
    private readonly _cache: ICache,
    private readonly _cacheKeyBuilder: ICacheKeyBuilder,
  ) {}

  public async acquireLock(requestId: string, ttlSeconds: number): Promise<boolean> {
    const key = this._cacheKeyBuilder.buildContextualKey(`command:${requestId}`)
    return await this._cache.setIfAbsent(
      `${IDEMPOTENCY_CONSTANTS.LOCK_KEY_PREFIX}${key}`,
      IDEMPOTENCY_CONSTANTS.LOCKED_VALUE,
      ttlSeconds,
    )
  }

  public async hasBeenProcessed(commandId: string): Promise<boolean> {
    const key = this._cacheKeyBuilder.buildContextualKey(`command:${commandId}`)
    return await this._cache.has(`${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}${key}`)
  }

  public async markAsProcessed<T>(
    commandId: string,
    payload: T,
    ttlSeconds: number,
  ): Promise<void> {
    const key = this._cacheKeyBuilder.buildContextualKey(`command:${commandId}`)
    await this._cache.set(
      `${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}${key}`,
      payload,
      ttlSeconds,
    )
  }

  public async getPayload<T>(commandId: string): Promise<Optional<T>> {
    const key = this._cacheKeyBuilder.buildContextualKey(`command:${commandId}`)
    const payload = await this._cache.get<T>(`${IDEMPOTENCY_CONSTANTS.PROCESSED_KEY_PREFIX}${key}`)

    return payload
  }

  public async releaseLock(commandId: string): Promise<void> {
    const key = this._cacheKeyBuilder.buildContextualKey(`command:${commandId}`)
    await this._cache.remove(`${IDEMPOTENCY_CONSTANTS.LOCK_KEY_PREFIX}${key}`)
  }
}
