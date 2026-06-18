import type { IModule, IServiceContainer } from '@/domain'
import { Guards } from '@/shared'

import type { PipelineConfig } from './config'
import { LoggerUtils } from './utils/logger.utils'

/**
 * @description CqrsModule is responsible for configuring and registering the necessary services and dependencies related to the Command Query Responsibility Segregation (CQRS) pattern in the application. It sets up the Mediator service, which acts as a central hub for handling commands and queries, allowing for a clean separation of concerns between the command and query sides of the application. By registering the Mediator in the dependency injection container, it enables other parts of the application to easily resolve and utilize its functionality for processing commands and queries.
 */
export class CqrsModule implements IModule<PipelineConfig> {
  async configure(container: IServiceContainer, opts: PipelineConfig): Promise<void> {
    const { INJECTION_TOKENS } = await import('@/infrastructure/di')

    const { Mediator } = await import('@/application/cqrs')
    container.addSingleton(INJECTION_TOKENS.MEDIATOR, Mediator, [
      INJECTION_TOKENS.SERVICE_CONTAINER,
    ])

    const { ExceptionPipeline } = await import('@/application/cqrs/pipelines')
    container.addSingleton(INJECTION_TOKENS.EXCEPTION_PIPELINE, ExceptionPipeline, [])

    await LoggerUtils.addLogger(container, undefined)

    const { LoggingPipeline } = await import('@/application/cqrs/pipelines')
    container.addSingleton(INJECTION_TOKENS.LOGGING_PIPELINE, LoggingPipeline, [
      INJECTION_TOKENS.LOGGER,
    ])

    const pipelines = [INJECTION_TOKENS.EXCEPTION_PIPELINE, INJECTION_TOKENS.LOGGING_PIPELINE]

    if (Guards.isDefined(opts.performance) && opts.performance.isEnabled) {
      const { PerformancePipeline } = await import('@/application/cqrs/pipelines')
      container.addSingletonFactory(INJECTION_TOKENS.PERFORMANCE_PIPELINE, (c) => {
        const logger = c.resolve(INJECTION_TOKENS.LOGGER)
        const thresholdMs = opts.performance?.thresholdMs
        return new PerformancePipeline(logger, thresholdMs)
      })
      pipelines.push(INJECTION_TOKENS.PERFORMANCE_PIPELINE)
    }

    if (Guards.isDefined(opts.authorization) && opts.authorization.isEnabled) {
      const { AuthUtils } = await import('./utils/auth.utils')
      const authPipelines = await AuthUtils.addAuthZ(container, opts.authorization, pipelines)
      pipelines.push(...authPipelines)
    }

    if (Guards.isDefined(opts.validation)) {
      const { ValidationUtils } = await import('./utils/validation.utils')
      const validationPipelines = await ValidationUtils.addValidation(
        container,
        opts.validation,
        pipelines,
      )
      pipelines.push(...validationPipelines)
    }

    const commandPipelines = [...pipelines]
    const queryPipelines = [...pipelines]

    if (
      Guards.isDefined(opts.commandBus) &&
      Guards.isDefined(opts.commandBus.idempotency) &&
      opts.commandBus.idempotency.isEnabled
    ) {
      const { CommandUtils } = await import('./utils/command.utils')
      const newCommandPipelines = await CommandUtils.addCommand(
        container,
        opts.commandBus,
        pipelines,
      )
      commandPipelines.push(...newCommandPipelines)
    }

    if (Guards.isDefined(opts.queryBus) && opts.queryBus.isEnabled) {
      const { CommandUtils } = await import('./utils/command.utils')
      const newQueryPipelines = await CommandUtils.addQuery(container, opts.queryBus, pipelines)
      queryPipelines.push(...newQueryPipelines)
    }

    const { CompositePipeline } = await import('@/application/cqrs/pipelines')
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
