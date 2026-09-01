import type { ZodType } from 'zod'

import type {
  ICommand,
  IModule,
  IPipelineBehavior,
  IQuery,
  IServiceContainer,
  IServiceScopeAccessor,
  PipelineConfig,
} from '@/domain'

import type { XenoRegistry } from '../xeno-registry'

/**
 * @description CqrsModule is responsible for configuring and registering the necessary services and dependencies related to the Command Query Responsibility Segregation (CQRS) pattern in the application. It sets up the Mediator service, which acts as a central hub for handling commands and queries, allowing for a clean separation of concerns between the command and query sides of the application. By registering the Mediator in the dependency injection container, it enables other parts of the application to easily resolve and utilize its functionality for processing commands and queries.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export class CqrsModule<TRegistry extends XenoRegistry = XenoRegistry> implements IModule<
  TRegistry,
  PipelineConfig<TRegistry, ZodType>
> {
  async configure(
    container: IServiceContainer<TRegistry>,
    opts: PipelineConfig<TRegistry, ZodType> & { isLogger: boolean; isCache: boolean },
  ): Promise<void> {
    const { TOKENS } = await import('@/shared')
    let isCache = opts.isCache

    const { Mediator } = await import('@/application')
    container.addSingleton(TOKENS.MEDIATOR, (c) => {
      const serviceScopeAccessor = c.resolve(TOKENS.SERVICE_SCOPE_ACCESSOR)
      return new Mediator<TRegistry>(serviceScopeAccessor as IServiceScopeAccessor<TRegistry>)
    })

    const { ExceptionPipeline } = await import('@/application')
    container.addSingleton(TOKENS.EXCEPTION_PIPELINE, () => new ExceptionPipeline())
    if (!opts.isLogger) {
      const { LoggerUtils } = await import('./utils/logger.utils')
      await LoggerUtils.addLogger(container, undefined)
    }

    const { LoggingPipeline } = await import('@/application')
    container.addSingleton(
      TOKENS.LOGGING_PIPELINE,
      (c) => new LoggingPipeline(c.resolve(TOKENS.LOGGER)),
    )
    const pipelines: (keyof TRegistry)[] = [TOKENS.EXCEPTION_PIPELINE, TOKENS.LOGGING_PIPELINE]

    const { PerformancePipeline } = await import('@/application')
    container.addSingleton(TOKENS.PERFORMANCE_PIPELINE, (c) => {
      const logger = c.resolve(TOKENS.LOGGER)
      const thresholdMs = opts.performance?.thresholdMs
      return new PerformancePipeline(logger, thresholdMs)
    })
    pipelines.push(TOKENS.PERFORMANCE_PIPELINE)

    const { Guards } = await import('@/shared')
    if (
      Guards.isDefined(opts.authorization.userId) ||
      Guards.isDefined(opts.authorization.tenantId) ||
      Guards.isDefined(opts.authorization.policies) ||
      Guards.isDefined(opts.authorization.customAuthorizationStrategy)
    ) {
      const { AuthUtils } = await import('./utils/auth.utils')
      const authPipelines = await AuthUtils.addAuthZ(container, opts.authorization)
      pipelines.push(...authPipelines)
    }

    if (
      Guards.isDefined(opts.validation.zod) ||
      Guards.isDefined(opts.validation.customValidationStrategy)
    ) {
      const { ValidationUtils } = await import('./utils/validation.utils')
      const validationPipelines = await ValidationUtils.addValidation(container, opts.validation)
      pipelines.push(...validationPipelines)
    }

    const commandPipelines = pipelines
    const queryPipelines = pipelines

    if (
      Guards.isDefined(opts.commandBus.idempotency) ||
      Guards.isDefined(opts.commandBus.concurrency)
    ) {
      const { PipelineUtils } = await import('./utils/pipeline.utils')
      const newCommandPipelines = await PipelineUtils.addCommand(container, {
        ...opts.commandBus,
        isCache,
      })
      isCache = true
      commandPipelines.push(...newCommandPipelines)
    }

    if (opts.queryBus.isEnabled) {
      const { PipelineUtils } = await import('./utils/pipeline.utils')
      const newQueryPipelines = await PipelineUtils.addQuery(container, { isCache })
      queryPipelines.push(...newQueryPipelines)
    }

    const { CompositePipeline } = await import('@/application')
    container.addSingleton(TOKENS.COMMAND_PIPELINES_BEHAVIOR, (c) => {
      const resolvedCommandPipelines = commandPipelines.map((token) => {
        return c.resolve(token) as IPipelineBehavior<ICommand<unknown>, unknown>
      })
      return new CompositePipeline<ICommand<unknown>, unknown>(resolvedCommandPipelines)
    })

    container.addSingleton(TOKENS.QUERY_PIPELINES_BEHAVIOR, (c) => {
      const resolvedQueryPipelines = queryPipelines.map(
        (token) => c.resolve(token) as IPipelineBehavior<IQuery<unknown>, unknown>,
      )
      return new CompositePipeline<IQuery<unknown>, unknown>(resolvedQueryPipelines)
    })
  }
}
