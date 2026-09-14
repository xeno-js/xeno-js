import type { CacheConfig } from '@xeno-js/shared'

import type { IServiceContainer } from '@/domain'

import type { XenoRegistry } from '../../xeno-registry'

/**
 * @description Utility functions for configuring caching in the service container.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export const CacheUtils = Object.freeze({
  /**
   * @description Checks if the provided cache configuration requires any cache strategies.
   * @param container The service container to which the cache strategies will be added.
   * @param opts The cache configuration options.
   * @returns True if any cache strategies are required, false otherwise.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  async addCache<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: CacheConfig,
  ): Promise<void> {
    const { Guards, TOKENS } = await import('@xeno-js/shared')
    if (!opts.inMemory && !Guards.isDefined(opts.redis)) {
      throw new Error(
        'No cache strategies are configured. Please provide at least one cache strategy.',
      )
    }

    const { CacheKeyBuilder } = await import('@xeno-js/shared')
    container.addSingleton(
      TOKENS.CACHE_KEY_BUILDER,
      (c) => new CacheKeyBuilder(c.resolve(TOKENS.IDENTITY_ACCESSOR)),
    )

    if (opts.inMemory || !Guards.isDefined(opts.redis)) {
      const { InMemoryCache } = await import('@xeno-js/shared')
      container.addSingleton(TOKENS.CACHE, () => new InMemoryCache())
      return
    }

    if (Guards.isDefined(opts.redis)) {
      const { RedisCacheFactory } = await import('../../factories/redis-cache.factory')
      container.addSingleton(TOKENS.CACHE, () => {
        const config = opts.redis
        return new RedisCacheFactory().create(config!)
      })
    }
  },
} as const)
