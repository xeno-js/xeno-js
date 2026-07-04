import type { Optional } from '@/shared'

/**
 * @description Interface for a logger that provides methods for logging messages at different levels (info, warn, error, debug) and tracking exceptions. Each logging method accepts a message and an optional context, while the error method also accepts an optional Error object.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export interface ILogger {
  /**
   * Log a message at the info level with an optional context.
   * @param message The message to log.
   * @param context An optional dictionary containing additional context for the log message.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  info(message: string): void
  /**
   * Log a message at the warning level with an optional context.
   * @param message The message to log.
   * @param context An optional dictionary containing additional context for the log message.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  warn(message: string): void
  /**
   * Log a message at the error level with an optional error object and context.
   * @param message The message to log.
   * @param error An optional unknown object associated with the log message.
   * @param context An optional dictionary containing additional context for the log message.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  error(message: string, error: Optional<unknown>): void
  /**
   * Log a message at the debug level with an optional context.
   * @param message The message to log.
   * @param context An optional dictionary containing additional context for the log message.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  debug(message: string): void
}
