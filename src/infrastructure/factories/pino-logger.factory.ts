import type { DestinationStream, LoggerOptions } from 'pino'
import pino from 'pino'

import type { IFactory, ILoggerClient } from '@/domain'
import { Guards, LOG_LEVEL } from '@/shared'

import { PinoLogger } from '../loggers/pino.logger'
import type { LoggerConfig } from '../modules/config/logger.config'

/**
 * @description Factory class responsible for creating instances of PinoLogger based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the PinoLogger, including the initialization of the underlying Pino instance with the specified configuration options such as log level. This design promotes separation of concerns and allows for flexibility in managing PinoLogger instances across the application.

   * 
   * @author Graviton5
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/Graviton5 
   */
export class PinoLoggerFactory implements IFactory<LoggerConfig, ILoggerClient> {
  public create(config: LoggerConfig): ILoggerClient {
    const level = config.level ?? LOG_LEVEL.DEBUG

    const env = config.pino.config?.env ?? process.env.NODE_ENV ?? 'development'
    const destinationType = config.pino.config?.destination ?? 'stdout'
    const filePath = config.pino.config?.filePath ?? 'logs/app.log'
    const prettyPrint = config.pino.config?.prettyPrint ?? env === 'development'

    const options: LoggerOptions = {
      level: 'trace',

      serializers: {
        err: pino.stdSerializers.err,
      },

      timestamp: pino.stdTimeFunctions.isoTime,

      redact: {
        paths: ['password', 'token', 'secret', 'authorization', 'headers.authorization'],
        censor: '***',
      },
    }

    if (Guards.isDefined(prettyPrint)) {
      return new PinoLogger(
        pino({
          ...options,
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              ignore: 'pid,hostname',
              translateTime: 'SYS:standard',
            },
          },
        }),
        level,
      )
    }

    if (destinationType === 'file') {
      const destination: DestinationStream = pino.destination({ dest: filePath, sync: false })
      return new PinoLogger(pino(options, destination), level)
    } else {
      const stream = pino.destination({ dest: 1, sync: false })
      return new PinoLogger(pino(options, stream), level)
    }
  }
}
