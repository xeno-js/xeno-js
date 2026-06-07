import type { ILogger, ILoggerClient } from '@/domain'
import type { Dictionary, LogLevel, Optional } from '@/shared'
import { LOG_LEVEL } from '@/shared'

/**
 * @description Logger composito che riceve una lista di provider tramite Dependency Injection e smista i log a tutti i provider registrati.
 * Permette di avere più destinazioni di log (console, file, servizi esterni) senza accoppiare il codice al singolo provider.
 */
export class BaseLogger implements ILogger {
  /**
   * @description Riceve i provider tramite Dependency Injection.
   */
  constructor(
    private readonly _loggers: ILoggerClient[],
    private readonly _minLevel: LogLevel = LOG_LEVEL.DEBUG,
  ) {}

  public info(message: string, context: Optional<Dictionary<unknown>> = undefined): void {
    this.broadcast(LOG_LEVEL.INFO, message, context)
  }

  public warn(message: string, context: Optional<Dictionary<unknown>> = undefined): void {
    this.broadcast(LOG_LEVEL.WARN, message, context)
  }

  public debug(message: string, context: Optional<Dictionary<unknown>> = undefined): void {
    this.broadcast(LOG_LEVEL.DEBUG, message, context)
  }

  public error(message: string, error?: Error, context?: Optional<Dictionary<unknown>>): void {
    this.broadcast(LOG_LEVEL.ERROR, message, context, error)
  }

  public trackException(error: Error, context?: Optional<Dictionary<unknown>>): void {
    this.broadcast(LOG_LEVEL.ERROR, error.message, context, error)
  }

  private broadcast(
    level: LogLevel,
    message: string,
    context: Optional<Dictionary<unknown>> = undefined,
    error: Optional<Error> = undefined,
  ): void {
    if (level < this._minLevel) return

    for (const logger of this._loggers) {
      logger.track(level, message, context, error)
    }
  }
}
