import type { LogLevel, Optional } from '@/shared'

/**
 * @description Interface for a logger client that provides a method for tracking log messages with a specified log level, message, optional context, and optional error.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface ILoggerClient {
  /**
   * Track a log message with a specified log level, message, optional context, and optional error.
   * @param level The log level (e.g., info, warn, error, debug) for the log message.
   * @param message The message to be logged.
   * @param context An optional dictionary containing additional context for the log message.
   * @param error An optional unknown object associated with the log message.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  track<T>(level: LogLevel, message: string, context: Optional<T>, error: Optional<unknown>): void
}
