import { pino } from 'pino'

import type { IFactory, ILoggerClient } from '@/domain'
import { PinoLogger } from '@/infrastructure'
import type { LoggerConfig } from '@/shared'
import { LOG_LEVEL } from '@/shared'

/**
 * @description Factory class responsible for creating instances of PinoLogger based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the PinoLogger, including the initialization of the underlying Pino instance with the specified configuration options such as log level. This design promotes separation of concerns and allows for flexibility in managing PinoLogger instances across the application.
 */
export class PinoLoggerFactory implements IFactory<LoggerConfig, ILoggerClient> {
  public create(config: LoggerConfig): ILoggerClient {
    const level = config.level ?? LOG_LEVEL.DEBUG
    return new PinoLogger(pino(), level)
  }
}
