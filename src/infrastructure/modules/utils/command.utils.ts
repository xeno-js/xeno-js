import type { IPipelineBehavior, IRequest, IServiceContainer } from '@/domain'
import type { InjectionToken } from '@/shared'
import { Guards } from '@/shared'

import type { PipelineConfig } from '../config'

export const CommandUtils = Object.freeze({
  /**
   * @description Checks if the provided command configuration requires any command strategies.
   * @param commandConfig The command configuration to check.
   * @returns True if any command strategies are required, false otherwise.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  addCommand: async (
    container: IServiceContainer,
    opts: PipelineConfig['commandBus'],
  ): Promise<InjectionToken<IPipelineBehavior<IRequest, unknown>>[]> => {
    const { INJECTION_TOKENS } = await import('../../di/injection-tokens.constants')

    const pipelines: InjectionToken<IPipelineBehavior<IRequest, unknown>>[] = []

    if (Guards.isDefined(opts.idempotency)) {
      const { CacheUtils } = await import('./cache.utils')
      await CacheUtils.addCache(container, { inMemory: true, redis: undefined })
      const { IdempotencyStore } = await import('../../idempotency/idempotency-store')
      container.addSingleton(INJECTION_TOKENS.IDEMPOTENCY_STORE, IdempotencyStore, [
        INJECTION_TOKENS.CACHE,
        INJECTION_TOKENS.REQUEST_CONTEXT,
      ])
      const { IdempotencyPipeline } = await import('@/application')
      container.addSingletonFactory(INJECTION_TOKENS.IDEMPOTENCY_PIPELINE, (c) => {
        const requestContext = c.resolve(INJECTION_TOKENS.REQUEST_CONTEXT)
        const idempotencyStore = c.resolve(INJECTION_TOKENS.IDEMPOTENCY_STORE)
        const config = opts.idempotency
        return new IdempotencyPipeline(
          requestContext,
          idempotencyStore,
          config?.lockTtlSeconds,
          config?.processedTtlSeconds,
        )
      })
      pipelines.push(INJECTION_TOKENS.IDEMPOTENCY_PIPELINE)
    }

    if (Guards.isDefined(opts.concurrency)) {
      const { ConcurrencyRetryPipeline } = await import('@/application')
      container.addSingletonFactory(INJECTION_TOKENS.CONCURRENCY_RETRY_PIPELINE, () => {
        const config = opts.concurrency
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
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  addQuery: async (
    container: IServiceContainer,
  ): Promise<InjectionToken<IPipelineBehavior<IRequest, unknown>>[]> => {
    const pipelines: InjectionToken<IPipelineBehavior<IRequest, unknown>>[] = []
    const { INJECTION_TOKENS } = await import('../../di/injection-tokens.constants')
    const { QueryCachingPipeline } = await import('@/application')
    container.addSingleton(INJECTION_TOKENS.QUERY_CACHING_PIPELINE, QueryCachingPipeline, [
      INJECTION_TOKENS.CACHE,
      INJECTION_TOKENS.LOGGER,
    ])
    pipelines.push(INJECTION_TOKENS.QUERY_CACHING_PIPELINE)
    return pipelines
  },
} as const)
