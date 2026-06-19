import { Redis } from 'ioredis'

import type { ICache, IFactory } from '@/domain'

import { RedisCache } from '../cache/redis.cache'
import type { CacheClientConfig } from '../modules/config/cache.config'

/**
 * @description Factory class responsible for creating instances of RedisCache based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the RedisCache, including the initialization of the underlying Redis instance with the specified configuration options such as host, port, and authentication settings. This design promotes separation of concerns and allows for flexibility in managing RedisCache instances across the application.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class RedisCacheFactory implements IFactory<CacheClientConfig, ICache> {
  public create(config: CacheClientConfig): ICache {
    const redisClient = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
    })

    return new RedisCache(redisClient)
  }
}
