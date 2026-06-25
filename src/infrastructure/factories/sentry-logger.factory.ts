import * as Sentry from '@sentry/node'

import type { IFactory, ILoggerClient } from '@/domain'
import { Guards, LOG_LEVEL } from '@/shared'

import { SentryLogger } from '../loggers/sentry.logger'
import type { LoggerConfig } from '../modules/config/logger.config'

/**
 * @description Factory class responsible for creating instances of SentryLogger based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the SentryLogger, including the initialization of the underlying Sentry instance with the specified configuration options such as DSN and environment. This design promotes separation of concerns and allows for flexibility in managing SentryLogger instances across the application.

   * 
   * @author Mattia Carcione
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export class SentryLoggerFactory implements IFactory<LoggerConfig, ILoggerClient> {
  public create(config: LoggerConfig): ILoggerClient {
    const level = config.level ?? LOG_LEVEL.WARN
    const sentryConfig = config.sentry?.config

    const env = sentryConfig?.environment ?? process.env.NODE_ENV ?? 'development'

    if (!Guards.isDefined(sentryConfig))
      throw new Error('Sentry configuration is required when Sentry logging is enabled.')

    if (!Guards.isDefined(sentryConfig.dsn))
      throw new Error('Sentry DSN is required when Sentry logging is enabled.')

    Sentry.init({
      dsn: sentryConfig.dsn,
      environment: env,
      tracesSampleRate: env === 'production' ? 0.1 : 1.0,
      sendDefaultPii: false,
      integrations: [new Sentry.Integrations.Http({ tracing: true })],
      beforeSend(event, hint) {
        const error = hint.originalException

        if (error instanceof Error && error.name === 'ZodError') {
          return null
        }

        return event
      },
    })

    return new SentryLogger(Sentry, level)
  }
}
