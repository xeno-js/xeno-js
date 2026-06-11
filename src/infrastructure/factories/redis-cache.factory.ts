import { Redis } from 'ioredis'

import type { ICache, IFactory } from '@/domain'
import { RedisCache } from '@/infrastructure'
import type { CacheClientConfig } from '@/shared'

/**
 * @description Factory class responsible for creating instances of RedisCache based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the RedisCache, including the initialization of the underlying Redis instance with the specified configuration options such as host, port, and authentication settings. This design promotes separation of concerns and allows for flexibility in managing RedisCache instances across the application.
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
