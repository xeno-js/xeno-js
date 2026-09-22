import type { IServiceContainer, PipelineConfig } from '@/domain'

import type { XenoRegistry } from '../../xeno-registry'

/**
 * @description Utility functions for configuring command and query pipelines in the service container.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export const PipelineUtils = Object.freeze({
  /**
   * @description Checks if the provided command configuration requires any command strategies.
   * @param commandConfig The command configuration to check.
   * @returns True if any command strategies are required, false otherwise.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  async addCommand<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: PipelineConfig<TRegistry>['commandBus'] & { isCache: boolean },
  ): Promise<(keyof TRegistry)[]> {
    const pipelines: (keyof TRegistry)[] = []
    const { Guards, TOKENS } = await import('@xeno-js/shared')
    if (Guards.isDefined(opts.idempotency)) {
      const { IdempotencyStore } = await import('../../idempotency/idempotency-store')
      container.addSingleton(
        TOKENS.IDEMPOTENCY_STORE,
        (c) => new IdempotencyStore(c.resolve(TOKENS.CACHE), c.resolve(TOKENS.CACHE_KEY_BUILDER)),
      )

      const { IdempotencyPipeline } = await import('@/application')
      container.addSingleton(TOKENS.IDEMPOTENCY_PIPELINE, (c) => {
        const requestContext = c.resolve(TOKENS.NETWORK_CONTEXT_ACCESSOR)
        const idempotencyStore = c.resolve(TOKENS.IDEMPOTENCY_STORE)
        const config = opts.idempotency
        return new IdempotencyPipeline(
          requestContext,
          idempotencyStore,
          config?.lockTtlSeconds,
          config?.processedTtlSeconds,
        )
      })
      pipelines.push(TOKENS.IDEMPOTENCY_PIPELINE)
    }

    if (Guards.isDefined(opts.concurrency)) {
      const { ConcurrencyRetryPipeline } = await import('@/application')
      container.addSingleton(TOKENS.CONCURRENCY_RETRY_PIPELINE, () => {
        const config = opts.concurrency
        return new ConcurrencyRetryPipeline(config?.maxRetries, config?.delayConfig)
      })
      pipelines.push(TOKENS.CONCURRENCY_RETRY_PIPELINE)
    }
    return pipelines
  },
  /**
   * @description Checks if the provided query configuration requires any query strategies.
   * @param queryConfig The query configuration to check.
   * @returns True if any query strategies are required, false otherwise.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/xeno-js/xeno-js
   */
  async addQuery<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: { isCache: boolean },
  ): Promise<(keyof TRegistry)[]> {
    const { TOKENS } = await import('@xeno-js/shared')
    const pipelines: (keyof TRegistry)[] = []

    if (!opts.isCache) {
      const { CacheUtils } = await import('./cache.utils')
      await CacheUtils.addCache(container, { inMemory: true, redis: undefined })
    }

    const { QueryCachingPipeline } = await import('@/application')
    container.addSingleton(
      TOKENS.QUERY_CACHING_PIPELINE,
      (c) =>
        new QueryCachingPipeline(
          c.resolve(TOKENS.CACHE),
          c.resolve(TOKENS.CACHE_KEY_BUILDER),
          c.resolve(TOKENS.LOGGER),
        ),
    )
    pipelines.push(TOKENS.QUERY_CACHING_PIPELINE)
    return pipelines
  },
} as const)
