import type { ICommand, IPipelineBehavior, IQuery } from '@xeno-js/shared'

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
    opts: PipelineConfig<TRegistry>['commandBus'],
  ): Promise<IPipelineBehavior<ICommand<unknown>, unknown>[]> {
    const { Guards, TOKENS } = await import('@xeno-js/shared')
    const pipelines: IPipelineBehavior<ICommand<unknown>, unknown>[] = []
    if (Guards.isDefined(opts.idempotency)) {
      const { IdempotencyStore } = await import('../../idempotency')
      const imdStore = new IdempotencyStore(
        container.resolve(TOKENS.CACHE),
        container.resolve(TOKENS.CACHE_KEY_BUILDER),
      )

      const { IdempotencyPipeline } = await import('@/application')
      const requestContext = container.resolve(TOKENS.NETWORK_CONTEXT_ACCESSOR)
      const config = opts.idempotency
      pipelines.push(
        new IdempotencyPipeline(
          requestContext,
          imdStore,
          config?.lockTtlSeconds,
          config?.processedTtlSeconds,
        ),
      )
    }

    if (Guards.isDefined(opts.concurrency)) {
      const { ConcurrencyRetryPipeline } = await import('@/application')
      const config = opts.concurrency
      pipelines.push(new ConcurrencyRetryPipeline(config?.maxRetries, config?.delayConfig))
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
  ): Promise<IPipelineBehavior<IQuery<unknown>, unknown>> {
    const { TOKENS } = await import('@xeno-js/shared')
    const { QueryCachingPipeline } = await import('@/application')
    return new QueryCachingPipeline(
      container.resolve(TOKENS.CACHE),
      container.resolve(TOKENS.CACHE_KEY_BUILDER),
      container.resolve(TOKENS.LOGGER),
    )
  },
} as const)
