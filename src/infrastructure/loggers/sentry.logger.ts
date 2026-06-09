import type * as Sentry from '@sentry/node'

import type { ILoggerClient } from '@/domain'
import type { Dictionary, LogLevel, Optional } from '@/shared'
import { Guards, LOG_LEVEL } from '@/shared'

/**
 * @description Concrete implementation of ILoggerClient that uses Sentry as the error tracking system. This class acts as an adapter between the ILoggerClient interface and the Sentry library, allowing the use of Sentry as a logging provider within the application's architecture without directly coupling the code to the specific tracking framework.
 */
export class SentryTransport implements ILoggerClient {
  constructor(
    private readonly _client: typeof Sentry,
    public readonly _minLevel: LogLevel,
  ) {}

  public track(
    level: LogLevel,
    message: string,
    context: Optional<Dictionary<unknown>> = undefined,
    error: Optional<Error> = undefined,
  ): void {
    if (level < this._minLevel) return

    if (level === LOG_LEVEL.ERROR || level === LOG_LEVEL.WARN) {
      this._client.withScope((scope) => {
        if (Guards.isDefined(context)) scope.setExtras(context)

        if (Guards.isDefined(error)) {
          this._client.captureException(error)
        } else {
          this._client.captureMessage(message, 'warning')
        }
      })
    }
  }
}
