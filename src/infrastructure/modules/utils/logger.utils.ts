import type { ILoggerClient, IServiceContainer, IServiceScope, LoggerConfig } from '@xeno-js/shared'
import type { KeysOfType, Optional } from '@xeno-js/shared'

import type { XenoRegistry } from '../../xeno-registry'
/**
 * @description LoggerUtils is a utility object that provides helper functions for the CoreModule. It includes the addLogger function, which is responsible for configuring and registering the logging services in the dependency injection container based on the provided LoggerConfig options. This function dynamically imports the necessary logger implementations (e.g., ConsoleLogger, SentryLogger, PinoLogger) and registers them with the container, allowing for flexible and modular logging configuration in the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/xeno-js
 */
export const LoggerUtils = Object.freeze({
  /**
   * @description Configures and registers the logging services in the dependency injection container based on the provided LoggerConfig options. It dynamically imports the necessary logger implementations (e.g., ConsoleLogger, SentryLogger, PinoLogger) and registers them with the container, allowing for flexible and modular logging configuration in the application.
   *
   * @param container - The service container to register logging services with.
   * @param opts - The LoggerConfig options to determine which loggers to enable and their configurations.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  async addLogger<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: Optional<LoggerConfig<XenoRegistry>>,
  ): Promise<void> {
    const loggerDependencies: KeysOfType<XenoRegistry, ILoggerClient>[] = []

    const { Guards, LOG_LEVEL, TOKENS } = await import('@xeno-js/shared')

    if (!Guards.isDefined(opts) || opts.console) {
      const { ConsoleLogger } = await import('../../loggers/console.logger')
      container.addSingleton(TOKENS.CONSOLE_LOGGER, () => new ConsoleLogger(opts?.level))
      loggerDependencies.push(TOKENS.CONSOLE_LOGGER)
    }

    const customLoggerFactories: ((c: IServiceScope<TRegistry>) => ILoggerClient)[] = []

    if (Guards.isDefined(opts)) {
      if (Guards.isDefined(opts.sentry.config)) {
        const { SentryLoggerFactory } = await import('../../factories/sentry-logger.factory')
        container.addSingleton(TOKENS.SENTRY_LOGGER, () => {
          const factory = new SentryLoggerFactory()
          return factory.create(opts)
        })
        loggerDependencies.push(TOKENS.SENTRY_LOGGER)
      }

      if (Guards.isDefined(opts.pino.config)) {
        const { PinoLoggerFactory } = await import('../../factories/pino-logger.factory')
        container.addSingleton(TOKENS.PINO_LOGGER, () => {
          const factory = new PinoLoggerFactory()
          return factory.create(opts)
        })
        loggerDependencies.push(TOKENS.PINO_LOGGER)
      }

      if (!Guards.isNullOrEmpty(opts.customLoggers)) {
        const customLoggers = opts.customLoggers
        customLoggers.forEach((f) => {
          if (Guards.isDefined(f)) {
            customLoggerFactories.push(f)
          }
        })
      }
    }

    const { BaseLogger } = await import('@xeno-js/shared')
    container.addSingleton(TOKENS.LOGGER, (c) => {
      const context = c.resolve(TOKENS.CONTEXT_ACCESSOR)
      const resolvedDependencies = [
        ...loggerDependencies.map((token) => c.resolve(token)),
        ...customLoggerFactories.map((factory) => factory(c)),
      ]
      return new BaseLogger(context, opts?.level ?? LOG_LEVEL.DEBUG, resolvedDependencies)
    })
  },
} as const)
