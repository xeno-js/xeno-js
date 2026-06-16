import * as Sentry from '@sentry/node'

import type { IFactory, ILoggerClient, LoggerConfig } from '@/domain'
import { SentryLogger } from '@/infrastructure'
import { Guards, LOG_LEVEL } from '@/shared'

/**
 * @description Factory class responsible for creating instances of SentryLogger based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the SentryLogger, including the initialization of the underlying Sentry instance with the specified configuration options such as DSN and environment. This design promotes separation of concerns and allows for flexibility in managing SentryLogger instances across the application.
 */
export class SentryLoggerFactory implements IFactory<LoggerConfig, ILoggerClient> {
  public create(config: LoggerConfig): ILoggerClient {
    const level = config.level ?? LOG_LEVEL.WARN
    const sentryConfig = config.sentry?.config
    if (!Guards.isDefined(sentryConfig))
      throw new Error('Sentry configuration is required when Sentry logging is enabled.')
    Sentry.init({
      dsn: sentryConfig.dsn,
      environment: sentryConfig.environment,
    })
    return new SentryLogger(Sentry, level)
  }
}
