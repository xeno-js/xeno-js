import type { IModule, IServiceContainer } from '@/domain'
import { Guards } from '@/shared'

import type { PipelineConfig } from './config/pipeline.config'
import { LoggerUtils } from './utils/logger.utils'

/**
 * @description CqrsModule is responsible for configuring and registering the necessary services and dependencies related to the Command Query Responsibility Segregation (CQRS) pattern in the application. It sets up the Mediator service, which acts as a central hub for handling commands and queries, allowing for a clean separation of concerns between the command and query sides of the application. By registering the Mediator in the dependency injection container, it enables other parts of the application to easily resolve and utilize its functionality for processing commands and queries.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class CqrsModule implements IModule<PipelineConfig> {
  async configure(container: IServiceContainer, opts: PipelineConfig): Promise<void> {
    const { INJECTION_TOKENS } = await import('../di')

    const { Mediator } = await import('@/application')
    container.addSingleton(INJECTION_TOKENS.MEDIATOR, Mediator, [INJECTION_TOKENS.REQUEST_CONTEXT])

    const { ExceptionPipeline } = await import('@/application')
    container.addSingleton(INJECTION_TOKENS.EXCEPTION_PIPELINE, ExceptionPipeline, [])

    await LoggerUtils.addLogger(container, undefined)

    const { LoggingPipeline } = await import('@/application')
    container.addSingleton(INJECTION_TOKENS.LOGGING_PIPELINE, LoggingPipeline, [
      INJECTION_TOKENS.LOGGER,
    ])

    const pipelines = [INJECTION_TOKENS.EXCEPTION_PIPELINE, INJECTION_TOKENS.LOGGING_PIPELINE]

    if (Guards.isDefined(opts.performance.thresholdMs)) {
      const { PerformancePipeline } = await import('@/application')
      container.addSingletonFactory(INJECTION_TOKENS.PERFORMANCE_PIPELINE, (c) => {
        const logger = c.resolve(INJECTION_TOKENS.LOGGER)
        const thresholdMs = opts.performance?.thresholdMs
        return new PerformancePipeline(logger, thresholdMs)
      })
      pipelines.push(INJECTION_TOKENS.PERFORMANCE_PIPELINE)
    }

    const { AuthUtils } = await import('./utils/auth.utils')
    const authPipelines = await AuthUtils.addAuthZ(container, opts.authorization)
    pipelines.push(...authPipelines)

    const { ValidationUtils } = await import('./utils/validation.utils')
    const validationPipelines = await ValidationUtils.addValidation(container, opts.validation)
    pipelines.push(...validationPipelines)

    const commandPipelines = [...pipelines]
    const queryPipelines = [...pipelines]

    const { CommandUtils } = await import('./utils/command.utils')
    const newCommandPipelines = await CommandUtils.addCommand(container, opts.commandBus)
    commandPipelines.push(...newCommandPipelines)

    if (opts.queryBus.isEnabled) {
      const newQueryPipelines = await CommandUtils.addQuery(container)
      queryPipelines.push(...newQueryPipelines)
    }

    const { CompositePipeline } = await import('@/application')
    container.addSingletonFactory(INJECTION_TOKENS.COMMAND_PIPELINES_BEHAVIOR, (resolver) => {
      const resolvedCommandPipelines = commandPipelines.map((token) => resolver.resolve(token))
      return new CompositePipeline(resolvedCommandPipelines)
    })

    container.addSingletonFactory(INJECTION_TOKENS.QUERY_PIPELINES_BEHAVIOR, (resolver) => {
      const resolvedQueryPipelines = queryPipelines.map((token) => resolver.resolve(token))
      return new CompositePipeline(resolvedQueryPipelines)
    })
  }
}
