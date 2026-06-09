import * as Sentry from '@sentry/node'

import type { IFactory, ILoggerClient } from '@/domain'
import { SentryTransport } from '@/infrastructure'
import type { LoggerConfig } from '@/shared'
import { LOG_LEVEL } from '@/shared'

/**
 * @description Factory class responsible for creating instances of SentryTransport based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the SentryTransport, including the initialization of the underlying Sentry instance with the specified configuration options such as DSN and environment. This design promotes separation of concerns and allows for flexibility in managing SentryTransport instances across the application.
 */
export class SentryLoggerFactory implements IFactory<LoggerConfig, ILoggerClient> {
  public create(config: LoggerConfig): ILoggerClient {
    const level = config.level ?? LOG_LEVEL.WARN
    Sentry.init({
      dsn: config.dsn,
      environment: config.environment,
    })
    return new SentryTransport(Sentry, level)
  }
}
