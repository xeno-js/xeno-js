import type { ILoggerClient, IServiceContainer, LoggerConfig } from '@/domain'
import type { InjectionToken, Optional } from '@/shared'
import { Guards, LOG_LEVEL } from '@/shared'

/**
 * @description LoggerUtils is a utility object that provides helper functions for the CoreModule. It includes the addLogger function, which is responsible for configuring and registering the logging services in the dependency injection container based on the provided LoggerConfig options. This function dynamically imports the necessary logger implementations (e.g., ConsoleLogger, SentryLogger, PinoLogger) and registers them with the container, allowing for flexible and modular logging configuration in the application.
 */
export const LoggerUtils = Object.freeze({
  /**
   * @description Configures and registers the logging services in the dependency injection container based on the provided LoggerConfig options. It dynamically imports the necessary logger implementations (e.g., ConsoleLogger, SentryLogger, PinoLogger) and registers them with the container, allowing for flexible and modular logging configuration in the application.
   *
   * @param container - The service container to register logging services with.
   * @param opts - The LoggerConfig options to determine which loggers to enable and their configurations.
   */
  addLogger: async (container: IServiceContainer, opts: Optional<LoggerConfig>): Promise<void> => {
    const { INJECTION_TOKENS } = await import('@/infrastructure/di/injection-tokens.constants')

    const minLevel = opts?.level ?? LOG_LEVEL.DEBUG
    class RuntimeLoggerConfig implements LoggerConfig {
      public readonly level = minLevel
      public readonly console = opts?.console ?? true
    }
    // 3. Registriamo questa classe nel container
    container.addSingleton(INJECTION_TOKENS.LOGGER_CONFIG, RuntimeLoggerConfig, [])

    const loggerDependencies: InjectionToken<ILoggerClient>[] = []

    if (opts?.console ?? true) {
      const { ConsoleLogger } = await import('@/infrastructure/loggers/')
      container.addSingleton(INJECTION_TOKENS.CONSOLE_LOGGER, ConsoleLogger, [
        INJECTION_TOKENS.LOGGER_CONFIG,
      ])
      loggerDependencies.push(INJECTION_TOKENS.CONSOLE_LOGGER)
    }

    if (Guards.isDefined(opts?.sentry) && opts.sentry.isEnabled) {
      const { SentryLoggerFactory } = await import('@/infrastructure/factories/')
      container.addSingletonFactory(INJECTION_TOKENS.SENTRY_LOGGER, (resolver) => {
        const config = resolver.resolve<LoggerConfig>(INJECTION_TOKENS.LOGGER_CONFIG)
        const factory = new SentryLoggerFactory()
        return factory.create(config)
      })
      loggerDependencies.push(INJECTION_TOKENS.SENTRY_LOGGER)
    }

    if (Guards.isDefined(opts?.pino) && opts.pino.isEnabled) {
      const { PinoLoggerFactory } = await import('@/infrastructure/factories/')
      container.addSingletonFactory(INJECTION_TOKENS.PINO_LOGGER, (resolver) => {
        const config = resolver.resolve<LoggerConfig>(INJECTION_TOKENS.LOGGER_CONFIG)
        const factory = new PinoLoggerFactory()
        return factory.create(config)
      })
      loggerDependencies.push(INJECTION_TOKENS.PINO_LOGGER)
    }

    if (!Guards.isNullOrEmpty(opts?.customLoggers)) {
      const customLoggers = opts.customLoggers
      customLoggers.forEach((logger) => {
        loggerDependencies.push(logger)
      })
    }

    const { BaseLogger } = await import('@/application/loggers')
    container.addSingletonFactory(INJECTION_TOKENS.LOGGER, (resolver) => {
      const context = resolver.resolve(INJECTION_TOKENS.REQUEST_CONTEXT)
      const resolvedDependencies = loggerDependencies.map((token) => resolver.resolve(token))
      return new BaseLogger(context, minLevel, ...resolvedDependencies)
    })
  },
} as const)
