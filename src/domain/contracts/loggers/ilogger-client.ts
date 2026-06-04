import type { Dictionary, Optional } from '@/shared'

import type { LogLevel } from './index'

/**
 * @description Interface for a logger client that provides a method for tracking log messages with a specified log level, message, optional context, and optional error.
 */
export interface ILoggerClient {
  /**
   * Track a log message with a specified log level, message, optional context, and optional error.
   * @param level The log level (e.g., info, warn, error, debug) for the log message.
   * @param message The message to be logged.
   * @param context An optional dictionary containing additional context for the log message.
   * @param error An optional Error object associated with the log message.
   */
  track(
    level: LogLevel,
    message: string,
    context: Optional<Dictionary<unknown>>,
    error: Optional<Error>,
  ): void
}
