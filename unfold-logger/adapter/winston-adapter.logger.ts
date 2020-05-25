import * as winston from 'winston'
import * as WinstonTransport from 'winston-transport'
import { Logger } from '@nestjs/common'

class WinstonAdapterLogger extends Logger {
  constructor(private readonly logger: winston.Logger) {
    super()
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context })
  }

  error(message: any, trace?: string, context?: string): any {
    this.logger.error(message, { trace, context })
  }

  log(message: any, context?: string): any {
    this.logger.debug(message, { context })
  }

  warn(message: any, context?: string): any {
    this.logger.warn(message, { context })
  }
}

const defaultFormats = [
  winston.format.timestamp({
    format: 'YYYY-MM-DDTHH:mm:ss.SSS',
  }),
  winston.format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`
  }),
]

interface WinstonLoggerOptionsInterface {
  level: string
  silent: boolean
  transports: WinstonTransport[]
}

export const createLogger = (config: WinstonLoggerOptionsInterface): WinstonAdapterLogger => {
  return new WinstonAdapterLogger(
    winston.createLogger({
      silent: config.silent,
      level: config.level,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(...defaultFormats),
        }),
        ...config.transports,
      ],
    }),
  )
}
