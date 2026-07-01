import type { ILoggerClient } from '@/domain'
import type { InjectionToken, LogLevel, Optional } from '@/shared'

/**
 * @description Interface defining the structure of a logger configuration object. This includes properties such as the minimum log level that should be captured by the logger. The log level determines the severity of log messages that will be processed and forwarded to the logging clients, allowing developers to control the verbosity of logs based on the needs of the application and its operational context.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export interface LoggerConfig {
  /**
   * @description
   * The level property specifies the minimum log level that should be captured by the logger. Log levels typically include DEBUG, INFO, WARN, and ERROR, with each level representing a different severity of log messages. By setting the log level, developers can control the verbosity of the logs and ensure that only relevant information is captured based on the needs of the application and its operational context.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  level: Optional<LogLevel>
  /** @description Flag to enable or disable console logging. If set to true, log messages will be output to the console. If set to false or not defined, console logging will be disabled, and log messages will not be output to the console.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  console: boolean
  /** @description Optional configuration for Sentry logger integration. If provided and enabled, the application will use Sentry as a logging client to capture and report log messages to the Sentry service. The configuration includes specific details for Sentry integration, such as the Data Source Name (DSN) and environment, allowing for flexible and modular logging configuration in the application.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  sentry: {
    /** @description Optional configuration for Sentry logger integration, including details such as the Data Source Name (DSN) and environment. If provided, this configuration will be used to initialize the Sentry logger client for capturing and reporting log messages to the Sentry service. If not defined, default Sentry configuration settings will be used.
     *
     * @author XenoJS
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/XenoJS
     */
    config: Optional<SentryLoggerConfig>
  }
  /** @description Optional configuration for Pino logger integration. If provided and enabled, the application will use Pino as a logging client to capture and manage log messages. The configuration includes specific details for Pino integration, such as the destination for log output, allowing for flexible and modular logging configuration in the application.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  pino: {
    /** @description Optional configuration for Pino logger integration, including details such as the destination for log output. If provided, this configuration will be used to initialize the Pino logger client for capturing and managing log messages. If not defined, default Pino configuration settings will be used.
     *
     * @author XenoJS
     * @version 1.0.0
     * @since 2025-09-30
     * @link https://github.com/Mattia-Carcione/XenoJS
     */
    config: Optional<PinoLoggerConfig>
  }
  /** @description Optional array of custom logger clients to be used in addition to the built-in console, Sentry, and Pino loggers. If provided, these custom loggers will be registered and used for capturing and managing log messages based on their respective configurations. If not defined or empty, only the enabled built-in loggers will be used.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  customLoggers: Optional<InjectionToken<ILoggerClient>[]>
}

/**
 * @description Interface defining the structure of the configuration object required to initialize a logger. This includes properties such as the Data Source Name (DSN) for connecting to the logging service, the environment in which the application is running (e.g., development, production), and the minimum log level that should be captured by the logger.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export interface SentryLoggerConfig {
  /**
   * @description
   * The Data Source Name (DSN) is a string that provides the necessary information for the logger to connect to the logging service. It typically includes the protocol, public key, secret key, host, and project ID. The DSN is essential for authenticating and routing log data to the correct destination in the logging infrastructure.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  dsn: Optional<string>
  /**
   * @description
   * The environment property indicates the context in which the application is running, such as 'development', 'staging', or 'production'. This information can be used by the logging service to categorize and filter logs based on the environment, allowing for better organization and analysis of log data.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  environment: Optional<string>
}

/**
 * @description Interface defining the structure of the configuration object required to initialize a Pino logger. This includes properties such as the destination for log output, which can be a file path, a stream, or a logging service endpoint. By configuring the destination, developers can control where the log data is stored or sent, enabling integration with various logging infrastructures and facilitating log management and analysis.

   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
export interface PinoLoggerConfig {
  /**
   * @description
   * The destination property specifies the output destination for the logs generated by the Pino logger. This can be a file path, a stream, or a logging service endpoint. By configuring the destination, developers can control where the log data is stored or sent, enabling integration with various logging infrastructures and facilitating log management and analysis.
  
   * 
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS 
   */
  destination?: Optional<Destination>
  /** @description Optional environment name for the Pino logger configuration. This can be used to specify the context in which the application is running (e.g., development, production) and can help with categorizing and filtering log messages based on the environment.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  env?: Optional<string>
  /** @description Optional file path for the Pino logger configuration. If specified, log messages will be written to the specified file instead of the default output destination. This allows for flexible log management and storage based on application requirements.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  filePath?: Optional<string>
  /** @description Optional flag to enable pretty printing of log messages. When set to true, log messages will be formatted in a more human-readable way, which can be useful for development and debugging purposes.
   *
   * @author XenoJS
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/XenoJS
   */
  prettyPrint?: Optional<boolean>
}

type Destination = 'stdout' | 'file'
