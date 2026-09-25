import type { ILoggerClient } from '@xeno-js/shared'
import type { Optional } from '@xeno-js/shared'

import type { IServiceContainer, LoggerConfig } from '@/domain'

import type { XenoRegistry } from '../../xeno-registry'
/**
 * @description LoggerUtils is a utility object that provides helper functions for the CoreModule. It includes the addLogger function, which is responsible for configuring and registering the logging services in the dependency injection container based on the provided LoggerConfig options. This function dynamically imports the necessary logger implementations (e.g., ConsoleLogger, SentryLogger, PinoLogger) and registers them with the container, allowing for flexible and modular logging configuration in the application.
 *
 * @author Xeno
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
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
   * @link https://github.com/xeno-js/xeno-js 
   */
  async addLogger<TRegistry extends XenoRegistry = XenoRegistry>(
    container: IServiceContainer<TRegistry>,
    opts: Optional<LoggerConfig<XenoRegistry>>,
  ): Promise<void> {
    const loggerDependencies: ILoggerClient[] = []

    const { Guards, LOG_LEVEL, TOKENS } = await import('@xeno-js/shared')

    if (!Guards.isDefined(opts) || opts.console) {
      const { ConsoleLogger } = await import('../../loggers/console.logger')
      loggerDependencies.push(new ConsoleLogger(opts?.level))
    }

    if (Guards.isDefined(opts)) {
      if (Guards.isDefined(opts.sentry.config)) {
        const { SentryLoggerFactory } = await import('../../factories/sentry-logger.factory')
        loggerDependencies.push(new SentryLoggerFactory().create(opts))
      }

      if (Guards.isDefined(opts.pino.config)) {
        const { PinoLoggerFactory } = await import('../../factories/pino-logger.factory')
        loggerDependencies.push(new PinoLoggerFactory().create(opts))
      }

      if (!Guards.isNullOrEmpty(opts.customLoggers)) {
        const customLoggers = opts.customLoggers
        customLoggers.forEach((fn) => {
          if (Guards.isDefined(fn)) loggerDependencies.push(fn(container))
        })
      }
    }

    const { BaseLogger } = await import('@xeno-js/shared')
    container.addSingleton(TOKENS.LOGGER, (c) => {
      const context = c.resolve(TOKENS.CONTEXT_ACCESSOR)
      return new BaseLogger(context, opts?.level ?? LOG_LEVEL.DEBUG, loggerDependencies)
    })
  },
} as const)
