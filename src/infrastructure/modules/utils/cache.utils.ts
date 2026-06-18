import type { IServiceContainer } from '@/domain'
import type { Optional } from '@/shared'
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
  addCache: async (container: IServiceContainer, opts: Optional<CacheConfig>): Promise<void> => {
    const { INJECTION_TOKENS } = await import('@/infrastructure/di/injection-tokens.constants')

    if (!Guards.isDefined(opts) || !Guards.isDefined(opts.redis) || !opts.redis.isEnabled) {
      const { InMemoryCache } = await import('@/infrastructure/cache')
      container.addSingleton(INJECTION_TOKENS.CACHE, InMemoryCache, [])
      return
    }

    if (Guards.isDefined(opts.redis) && Guards.isDefined(opts.redis.config)) {
      const { RedisCacheFactory } = await import('@/infrastructure/factories')
      container.addSingletonFactory(INJECTION_TOKENS.CACHE, () => {
        const config = opts.redis?.config
        return new RedisCacheFactory().create(config!)
      })
    }
  },
} as const)
