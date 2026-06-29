import type { ILoggerClient, IServiceContainer } from '@/domain'
import type { InjectionToken, Optional } from '@/shared'
import { Guards, LOG_LEVEL } from '@/shared'

import type { LoggerConfig } from '../config'

/**
 * @description LoggerUtils is a utility object that provides helper functions for the CoreModule. It includes the addLogger function, which is responsible for configuring and registering the logging services in the dependency injection container based on the provided LoggerConfig options. This function dynamically imports the necessary logger implementations (e.g., ConsoleLogger, SentryLogger, PinoLogger) and registers them with the container, allowing for flexible and modular logging configuration in the application.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export const LoggerUtils = Object.freeze({
  /**
   * @description Configures and registers the logging services in the dependency injection container based on the provided LoggerConfig options. It dynamically imports the necessary logger implementations (e.g., ConsoleLogger, SentryLogger, PinoLogger) and registers them with the container, allowing for flexible and modular logging configuration in the application.
   *
   * @param container - The service container to register logging services with.
   * @param opts - The LoggerConfig options to determine which loggers to enable and their configurations.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  addLogger: async (container: IServiceContainer, opts: Optional<LoggerConfig>): Promise<void> => {
    const { INJECTION_TOKENS } = await import('../../di/injection-tokens.constants')

    const loggerDependencies: InjectionToken<ILoggerClient>[] = []

    if (!Guards.isDefined(opts) || opts.console) {
      const { ConsoleLogger } = await import('../../loggers/console.logger')
      container.addSingletonFactory(
        INJECTION_TOKENS.CONSOLE_LOGGER,
        () => new ConsoleLogger(opts?.level),
      )
      loggerDependencies.push(INJECTION_TOKENS.CONSOLE_LOGGER)
    }

    if (Guards.isDefined(opts)) {
      if (Guards.isDefined(opts.sentry.config)) {
        const { SentryLoggerFactory } = await import('../../factories/sentry-logger.factory')
        container.addSingletonFactory(INJECTION_TOKENS.SENTRY_LOGGER, () => {
          const factory = new SentryLoggerFactory()
          return factory.create(opts)
        })
        loggerDependencies.push(INJECTION_TOKENS.SENTRY_LOGGER)
      }

      if (Guards.isDefined(opts.pino.config)) {
        const { PinoLoggerFactory } = await import('../../factories/pino-logger.factory')
        container.addSingletonFactory(INJECTION_TOKENS.PINO_LOGGER, () => {
          const factory = new PinoLoggerFactory()
          return factory.create(opts)
        })
        loggerDependencies.push(INJECTION_TOKENS.PINO_LOGGER)
      }

      if (!Guards.isNullOrEmpty(opts.customLoggers)) {
        const customLoggers = opts.customLoggers
        customLoggers.forEach((logger) => {
          loggerDependencies.push(logger)
        })
      }
    }

    const { BaseLogger } = await import('@/application')
    container.addSingletonFactory(INJECTION_TOKENS.LOGGER, (resolver) => {
      const context = resolver.resolve(INJECTION_TOKENS.REQUEST_CONTEXT)
      const resolvedDependencies = loggerDependencies.map((token) => resolver.resolve(token))
      return new BaseLogger(context, opts?.level ?? LOG_LEVEL.DEBUG, resolvedDependencies)
    })
  },
} as const)
