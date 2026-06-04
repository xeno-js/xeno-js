/**
 *  Log levels for the logger.
 */
export const LOG_LEVEL = Object.freeze({
  /** * Debug level for detailed debugging information. This level is typically used during development and should be turned off in production to avoid verbose logging.
   */
  DEBUG: 0,
  /** * Info level for general informational messages that highlight the progress of the application at a coarse-grained level. This level is suitable for production environments to track the normal operation of the application.
   */
  INFO: 1,
  /** * Warn level for potentially harmful situations that are not necessarily errors but may require attention. This level is useful for identifying issues that could lead to errors if not addressed.
   */
  WARN: 2,
  /** * Error level for serious issues that have caused or are likely to cause the application to fail. This level is critical for identifying and addressing problems that need immediate attention.
   */
  ERROR: 3,
} as const)

/** @description Inferred union of valid log level values. */
export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL]
