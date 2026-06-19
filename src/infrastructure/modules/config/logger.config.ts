import type { ILoggerClient } from '@/domain'
import type { InjectionToken, LogLevel, Optional } from '@/shared'

/**
 * @description Interface defining the structure of a logger configuration object. This includes properties such as the minimum log level that should be captured by the logger. The log level determines the severity of log messages that will be processed and forwarded to the logging clients, allowing developers to control the verbosity of logs based on the needs of the application and its operational context.
 */
export interface LoggerConfig {
  /**
   * @description
   * The level property specifies the minimum log level that should be captured by the logger. Log levels typically include DEBUG, INFO, WARN, and ERROR, with each level representing a different severity of log messages. By setting the log level, developers can control the verbosity of the logs and ensure that only relevant information is captured based on the needs of the application and its operational context.
   */
  level: Optional<LogLevel>
  /** @description Flag to enable or disable console logging. If set to true, log messages will be output to the console. If set to false or not defined, console logging will be disabled, and log messages will not be output to the console. */
  console: boolean
  /** @description Optional configuration for Sentry logger integration. If provided and enabled, the application will use Sentry as a logging client to capture and report log messages to the Sentry service. The configuration includes specific details for Sentry integration, such as the Data Source Name (DSN) and environment, allowing for flexible and modular logging configuration in the application. */
  sentry: {
    /** @description Optional configuration for Sentry logger integration, including details such as the Data Source Name (DSN) and environment. If provided, this configuration will be used to initialize the Sentry logger client for capturing and reporting log messages to the Sentry service. If not defined, default Sentry configuration settings will be used. */
    config: Optional<SentryLoggerConfig>
  }
  /** @description Optional configuration for Pino logger integration. If provided and enabled, the application will use Pino as a logging client to capture and manage log messages. The configuration includes specific details for Pino integration, such as the destination for log output, allowing for flexible and modular logging configuration in the application. */
  pino: {
    /** @description Optional configuration for Pino logger integration, including details such as the destination for log output. If provided, this configuration will be used to initialize the Pino logger client for capturing and managing log messages. If not defined, default Pino configuration settings will be used. */
    config: Optional<PinoLoggerConfig>
  }
  /** @description Optional array of custom logger clients to be used in addition to the built-in console, Sentry, and Pino loggers. If provided, these custom loggers will be registered and used for capturing and managing log messages based on their respective configurations. If not defined or empty, only the enabled built-in loggers will be used. */
  customLoggers: Optional<InjectionToken<ILoggerClient>[]>
}

/**
 * @description Interface defining the structure of the configuration object required to initialize a logger. This includes properties such as the Data Source Name (DSN) for connecting to the logging service, the environment in which the application is running (e.g., development, production), and the minimum log level that should be captured by the logger.
 */
export interface SentryLoggerConfig {
  /**
   * @description
   * The Data Source Name (DSN) is a string that provides the necessary information for the logger to connect to the logging service. It typically includes the protocol, public key, secret key, host, and project ID. The DSN is essential for authenticating and routing log data to the correct destination in the logging infrastructure.
   */
  dsn: Optional<string>
  /**
   * @description
   * The environment property indicates the context in which the application is running, such as 'development', 'staging', or 'production'. This information can be used by the logging service to categorize and filter logs based on the environment, allowing for better organization and analysis of log data.
   */
  environment: Optional<string>
}

/**
 * @description Interface defining the structure of the configuration object required to initialize a Pino logger. This includes properties such as the destination for log output, which can be a file path, a stream, or a logging service endpoint. By configuring the destination, developers can control where the log data is stored or sent, enabling integration with various logging infrastructures and facilitating log management and analysis.
 */
export interface PinoLoggerConfig {
  /**
   * @description
   * The destination property specifies the output destination for the logs generated by the Pino logger. This can be a file path, a stream, or a logging service endpoint. By configuring the destination, developers can control where the log data is stored or sent, enabling integration with various logging infrastructures and facilitating log management and analysis.
   */
  destination: Optional<string>
}
