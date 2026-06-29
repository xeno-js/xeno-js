/**
 *  Log levels for the logger.

   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
export const LOG_LEVEL = Object.freeze({
  /** * Debug level for detailed debugging information. This level is typically used during development and should be turned off in production to avoid verbose logging.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  DEBUG: 0,
  /** * Info level for general informational messages that highlight the progress of the application at a coarse-grained level. This level is suitable for production environments to track the normal operation of the application.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  INFO: 1,
  /** * Warn level for potentially harmful situations that are not necessarily errors but may require attention. This level is useful for identifying issues that could lead to errors if not addressed.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  WARN: 2,
  /** * Error level for serious issues that have caused or are likely to cause the application to fail. This level is critical for identifying and addressing problems that need immediate attention.
  
   * 
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5 
   */
  ERROR: 3,
} as const)

/** @description Inferred union of valid log level values.
 *
 * @author Gear5
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/gear5
 */
export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL]

/** @description Mapping of log level values to their corresponding string representations for easier readability in log outputs.
 *
 * @author Gear5
 * @version 1.0.0
 * @since 2025-09-30
 * @link https://github.com/Mattia-Carcione/gear5
 */
export const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  /** Debug level for detailed debugging information. This level is typically used during development and should be turned off in production to avoid verbose logging.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  [LOG_LEVEL.DEBUG]: 'DEBUG',
  /** Info level for general informational messages that highlight the progress of the application at a coarse-grained level. This level is suitable for production environments to track the normal operation of the application.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  [LOG_LEVEL.INFO]: 'INFO',
  /** Warn level for potentially harmful situations that are not necessarily errors but may require attention. This level is useful for identifying issues that could lead to errors if not addressed.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  [LOG_LEVEL.WARN]: 'WARN',
  /** Error level for serious issues that have caused or are likely to cause the application to fail. This level is critical for identifying and addressing problems that need immediate attention.
   *
   * @author Gear5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/gear5
   */
  [LOG_LEVEL.ERROR]: 'ERROR',
}
