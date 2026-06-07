import * as Sentry from '@sentry/node'

import type { ILoggerClient } from '@/domain'
import type { Dictionary, LogLevel, Optional } from '@/shared'
import { Guards, LOG_LEVEL } from '@/shared'

export interface LoggerConfig {
  dsn: string
  environment: string
}

/**
 * @description Concrete implementation of ILoggerClient that uses Sentry as the error tracking system. This class acts as an adapter between the ILoggerClient interface and the Sentry library, allowing the use of Sentry as a logging provider within the application's architecture without directly coupling the code to the specific tracking framework.
 */
export class SentryTransport implements ILoggerClient {
  constructor(
    public readonly _minLevel = LOG_LEVEL.WARN,
    config: LoggerConfig,
  ) {
    const { dsn, environment } = config
    Sentry.init({
      dsn,
      environment,
      tracesSampleRate: 1.0,
    })
  }

  public track(
    level: LogLevel,
    message: string,
    context: Optional<Dictionary<unknown>> = undefined,
    error: Optional<Error> = undefined,
  ): void {
    if (level < this._minLevel) return

    if (level === LOG_LEVEL.ERROR || level === LOG_LEVEL.WARN) {
      Sentry.withScope((scope) => {
        if (Guards.isDefined(context)) scope.setExtras(context)

        if (Guards.isDefined(error)) {
          Sentry.captureException(error)
        } else {
          Sentry.captureMessage(message, 'warning')
        }
      })
    }
  }
}
