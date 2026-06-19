import type { IPipelineBehavior, IRequest, IServiceContainer } from '@/domain'
import type { InjectionToken } from '@/shared'

import type { PipelineConfig } from '../config'

export const CommandUtils = Object.freeze({
  /**
   * @description Checks if the provided command configuration requires any command strategies.
   * @param commandConfig The command configuration to check.
   * @returns True if any command strategies are required, false otherwise.
   */
  addCommand: async (
    container: IServiceContainer,
    opts: PipelineConfig['commandBus'],
    pipelines: InjectionToken<IPipelineBehavior<IRequest, unknown>>[],
  ): Promise<InjectionToken<IPipelineBehavior<IRequest, unknown>>[]> => {
    if (!opts.isEnabled) return [...pipelines]

    const { INJECTION_TOKENS } = await import('../../di/injection-tokens.constants')

    if (opts.idempotency.isEnabled) {
      const { CacheUtils } = await import('./cache.utils')
      await CacheUtils.addCache(container, {
        isEnabled: true,
        redis: { isEnabled: false, config: undefined },
      })
      const { IdempotencyStore } = await import('../../idempotency/idempotency-store')
      container.addSingleton(INJECTION_TOKENS.IDEMPOTENCY_STORE, IdempotencyStore, [
        INJECTION_TOKENS.CACHE,
        INJECTION_TOKENS.REQUEST_CONTEXT,
      ])
      const { IdempotencyPipeline } = await import('@/application/cqrs')
      container.addSingletonFactory(INJECTION_TOKENS.IDEMPOTENCY_PIPELINE, (c) => {
        const requestContext = c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT)
        const idempotencyStore = c.resolve(INJECTION_TOKENS.IDEMPOTENCY_STORE)
        const config = opts.idempotency.config
        return new IdempotencyPipeline(
          requestContext,
          idempotencyStore,
          config?.lockTtlSeconds,
          config?.processedTtlSeconds,
        )
      })
      pipelines.push(INJECTION_TOKENS.IDEMPOTENCY_PIPELINE)
    }

    if (opts.concurrency.isEnabled) {
      const { ConcurrencyRetryPipeline } = await import('@/application/cqrs')
      container.addSingletonFactory(INJECTION_TOKENS.CONCURRENCY_RETRY_PIPELINE, () => {
        const config = opts.concurrency.config
        return new ConcurrencyRetryPipeline(config?.maxRetries, config?.delayConfig)
      })
      pipelines.push(INJECTION_TOKENS.CONCURRENCY_RETRY_PIPELINE)
    }
    return pipelines
  },
  /**
   * @description Checks if the provided query configuration requires any query strategies.
   * @param queryConfig The query configuration to check.
   * @returns True if any query strategies are required, false otherwise.
   */
  addQuery: async (
    container: IServiceContainer,
    opts: PipelineConfig['queryBus'],
    pipelines: InjectionToken<IPipelineBehavior<IRequest, unknown>>[],
  ): Promise<InjectionToken<IPipelineBehavior<IRequest, unknown>>[]> => {
    if (!opts.isEnabled) return [...pipelines]

    const { INJECTION_TOKENS } = await import('../../di/injection-tokens.constants')
    const { QueryCachingPipeline } = await import('@/application/cqrs/pipelines')
    container.addSingleton(INJECTION_TOKENS.QUERY_CACHING_PIPELINE, QueryCachingPipeline, [
      INJECTION_TOKENS.CACHE,
      INJECTION_TOKENS.LOGGER,
    ])
    pipelines.push(INJECTION_TOKENS.QUERY_CACHING_PIPELINE)
    return pipelines
  },
} as const)
