import type { CacheClientConfig, ICache, IFactory } from '@xeno-js/shared'
import { Guards } from '@xeno-js/shared'
import type { RedisOptions } from 'ioredis'
import { Redis } from 'ioredis'

import { RedisCache } from '../cache/redis.cache'

/**
 * @description Factory class responsible for creating instances of RedisCache based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the RedisCache, including the initialization of the underlying Redis instance with the specified configuration options such as host, port, and authentication settings. This design promotes separation of concerns and allows for flexibility in managing RedisCache instances across the application.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export class RedisCacheFactory implements IFactory<CacheClientConfig, ICache> {
  public create(config: CacheClientConfig): ICache {
    const host = config?.host ?? 'localhost'
    const port = config?.port ?? 6379
    const password = config?.password
    const username = config?.username
    const useTls = config?.tls ?? false
    const maxRetries = config?.maxRetriesPerRequest ?? 3

    const redisOptions: RedisOptions = {
      host,
      port,
      maxRetriesPerRequest: maxRetries,

      // Strategia di riconnessione esponenziale per garantire resilienza
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
    }

    if (Guards.isDefined(password)) {
      redisOptions.password = password
    }

    if (Guards.isDefined(username)) {
      redisOptions.username = username
    }

    if (useTls) {
      redisOptions.tls = {}
    }

    const nativeRedisInstance = new Redis(redisOptions)

    nativeRedisInstance.on('error', (err) => {
      console.error('❌ [Redis Error]:', err.message)
    })

    return new RedisCache(nativeRedisInstance)
  }
}
