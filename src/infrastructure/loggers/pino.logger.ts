import { type Logger, pino } from 'pino'

import type { ILoggerClient } from '@/domain'
import type { Dictionary, LogLevel, Optional } from '@/shared'
import { Guards, LOG_LEVEL } from '@/shared'

/**
 * @description Class that implements the ILoggerClient interface using the Pino logging library. This class serves as an adapter between the ILoggerClient interface and the Pino logging library, allowing the use of Pino as a logging provider within the application's architecture without directly coupling the code to the specific logging framework.
 */
export class PinoTransport implements ILoggerClient {
  /**
   * @description The Pino logger instance used for logging messages.
   */
  private readonly _logger: Logger

  /**
   * Constructs a new instance of the PinoTransport class, which takes an optional minimum log level and an optional instance of the Pino logger. If no logger instance is provided, it initializes a new Pino logger with default settings. The minimum log level determines the threshold for logging messages, where messages with a log level below the specified minimum will be ignored.
   * @param _minLevel The minimum log level for logging messages. Messages with a log level below this threshold will not be logged. Default is LOG_LEVEL.DEBUG.
   * @param loggerInstance An optional instance of the Pino logger to be used for logging. If not provided, a new Pino logger will be initialized with default settings.
   */
  constructor(
    private readonly _minLevel: LogLevel = LOG_LEVEL.DEBUG,
    loggerInstance: Optional<Logger> = undefined,
  ) {
    this._logger = loggerInstance ?? pino()
  }

  public track(
    level: LogLevel,
    message: string,
    context: Optional<Dictionary<unknown>> = undefined,
    error: Optional<Error> = undefined,
  ): void {
    if (level < this._minLevel) return

    const payload = Guards.isDefined(error)
      ? { ...context, err: error.message, stack: error.stack }
      : context

    switch (level) {
      case LOG_LEVEL.ERROR:
        this._logger.error(payload ?? {}, message)
        break
      case LOG_LEVEL.WARN:
        this._logger.warn(payload ?? {}, message)
        break
      case LOG_LEVEL.DEBUG:
        this._logger.debug(payload ?? {}, message)
        break
      default:
        this._logger.info(payload ?? {}, message)
        break
    }
  }
}
