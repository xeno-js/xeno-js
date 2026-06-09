import type { LogLevel, Optional } from '@/shared'

/**
 * @description Interface defining the structure of the configuration object required to initialize a logger. This includes properties such as the Data Source Name (DSN) for connecting to the logging service, the environment in which the application is running (e.g., development, production), and the minimum log level that should be captured by the logger.
 */
export interface LoggerConfig {
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
  /**
   * @description
   * The level property specifies the minimum log level that should be captured by the logger. Log levels typically include DEBUG, INFO, WARN, and ERROR, with each level representing a different severity of log messages. By setting the log level, developers can control the verbosity of the logs and ensure that only relevant information is captured based on the needs of the application and its operational context.
   */
  level: Optional<LogLevel>
}
