import type { IServiceContainer } from '@/domain'
import { Guards } from '@/shared'

import type { CacheConfig } from '../config'

/**
 * @description Utility functions for configuring caching in the service container.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export const CacheUtils = Object.freeze({
  /**
   * @description Checks if the provided cache configuration requires any cache strategies.
   * @param cacheConfig The cache configuration to check.
   * @returns True if any cache strategies are required, false otherwise.
  
   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  addCache: async (container: IServiceContainer, opts: CacheConfig): Promise<void> => {
    const { INJECTION_TOKENS } = await import('../../di/injection-tokens.constants')

    if (opts.inMemory) {
      const { InMemoryCache } = await import('../../cache/in-memory.cache')
      container.addSingleton(INJECTION_TOKENS.CACHE, InMemoryCache, [])
      return
    }

    if (Guards.isDefined(opts.redis)) {
      const { RedisCacheFactory } = await import('../../factories/redis-cache.factory')
      container.addSingletonFactory(INJECTION_TOKENS.CACHE, () => {
        const config = opts.redis
        return new RedisCacheFactory().create(config!)
      })
    }
  },
} as const)
