import type { Redis } from 'ioredis'

import type { ICache } from '@/domain'
import type { Optional } from '@/shared'
import { Guards, StringHelper } from '@/shared'

/**
 * @description The RedisCache class provides an implementation of the ICache interface using Redis as the underlying caching mechanism. This class allows for storing, retrieving, and managing cached values in a Redis database, supporting features such as time-to-live (TTL) for cache entries and atomic operations for setting values only if they do not already exist. The RedisCache class abstracts away the details of interacting with Redis, providing a simple and consistent interface for caching operations within the application.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export class RedisCache implements ICache {
  /**
   * @description Constructs a new instance of the RedisCache class, which takes an instance of the Redis client as a parameter. This client is used to perform caching operations such as setting, getting, and removing values from the Redis database. The constructor initializes the RedisCache with the provided Redis client, allowing it to interact with the Redis server for all caching operations defined in the ICache interface.
   * @param _redisClient An instance of the Redis client from the ioredis library, used to perform caching operations in the Redis database.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  constructor(private readonly _redisClient: Redis) {}

  public async get<T>(key: string): Promise<Optional<T>> {
    const value: string | null = await this._redisClient.get(key)
    if (!Guards.isDefined(value)) {
      return undefined
    }
    return JSON.parse(value) as T
  }

  public async set<T>(key: string, value: T, ttl: Optional<number>): Promise<void> {
    const stringValue = StringHelper.safeStringify(value)
    const ttlOption = Guards.isDefined(ttl) ? ttl : 86400 // Default TTL of 1 day if not provided

    await this._redisClient.set(key, stringValue, 'EX', ttlOption)
  }

  public async setIfAbsent<T>(key: string, value: T, ttl: Optional<number>): Promise<boolean> {
    const stringValue = StringHelper.safeStringify(value)
    const ttlOption = Guards.isDefined(ttl) ? ttl : 300 // Default TTL of 5 minutes for locks if not provided
    const result = await this._redisClient.set(key, stringValue, 'EX', ttlOption, 'NX')
    return result === 'OK'
  }

  public async remove(key: string): Promise<void> {
    await this._redisClient.del(key)
  }

  public async has(key: string): Promise<boolean> {
    const exists = await this._redisClient.exists(key)
    return exists === 1
  }

  public async clear(): Promise<void> {
    await this._redisClient.flushdb()
  }
}
