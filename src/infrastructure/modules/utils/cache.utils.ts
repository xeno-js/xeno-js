import type { IServiceContainer } from '@/domain'
import { Guards } from '@/shared'

import type { CacheConfig } from '../config'

/**
 * @description Utility functions for configuring caching in the service container.
 */
export const CacheUtils = Object.freeze({
  /**
   * @description Checks if the provided cache configuration requires any cache strategies.
   * @param cacheConfig The cache configuration to check.
   * @returns True if any cache strategies are required, false otherwise.
   */
  addCache: async (container: IServiceContainer, opts: CacheConfig): Promise<void> => {
    const { INJECTION_TOKENS } = await import('../../di/injection-tokens.constants')

    if (!opts.redis.isEnabled) {
      const { InMemoryCache } = await import('../../cache/in-memory.cache')
      container.addSingleton(INJECTION_TOKENS.CACHE, InMemoryCache, [])
      return
    }

    if (opts.redis.isEnabled) {
      if (!Guards.isDefined(opts.redis.config)) {
        throw new Error('Redis cache configuration must be provided when Redis caching is enabled.')
      }
      const { RedisCacheFactory } = await import('../../factories/redis-cache.factory')
      container.addSingletonFactory(INJECTION_TOKENS.CACHE, () => {
        const config = opts.redis?.config
        return new RedisCacheFactory().create(config!)
      })
    }
  },
} as const)
