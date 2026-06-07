import type { ILoggerClient } from '@/domain'
import type { Dictionary, LogLevel, Optional } from '@/shared'
import { Guards, LOG_LEVEL } from '@/shared'

/**
 * @description Concrete implementation of ILoggerClient that uses the built-in console for logging. This class serves as a simple logging provider that can be used for development and debugging purposes, allowing log messages to be output to the console with different log levels (e.g., error, warning, info, debug) and optional context and error information.
 */
export class ConsoleLogger implements ILoggerClient {
  /**
   * Constructs a new instance of the ConsoleLogger class, which takes an optional minimum log level. The minimum log level determines the threshold for logging messages, where messages with a log level below the specified minimum will be ignored.
   * @param _minLevel The minimum log level for logging messages. Messages with a log level below this threshold will not be logged. Default is LOG_LEVEL.DEBUG.
   */
  constructor(private readonly _minLevel: LogLevel = LOG_LEVEL.DEBUG) {}

  public track(
    level: LogLevel,
    message: string,
    context: Optional<Dictionary<unknown>> = undefined,
    error: Optional<Error> = undefined,
  ): void {
    if (level < this._minLevel) return

    const logMessage = `[${level}] ${message}`
    const payload = Guards.isDefined(error)
      ? { ...context, err: error.message, stack: error.stack }
      : context
    switch (level) {
      case LOG_LEVEL.ERROR:
        console.error(payload ?? {}, logMessage)
        break
      case LOG_LEVEL.WARN:
        console.warn(payload ?? {}, logMessage)
        break
      case LOG_LEVEL.DEBUG:
        console.debug(payload ?? {}, logMessage)
        break
      default:
        console.info(payload ?? {}, logMessage)
        break
    }
  }
}
