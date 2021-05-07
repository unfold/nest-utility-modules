import * as winston from 'winston'
import * as WinstonTransport from 'winston-transport'
import { Logger } from '@nestjs/common'
import { TransformableInfo } from 'logform'

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
    this.logger.info(message, { context })
  }

  warn(message: any, context?: string): any {
    this.logger.warn(message, { context })
  }
}

interface WinstonLoggerOptionsInterface {
  level: string
  silent: boolean
  transports: WinstonTransport[]
  templateFunction?: (info: TransformableInfo) => string
  timestampFormat?: string
}

const defaultTemplateFunction = (info: TransformableInfo) => {
  return `${info.timestamp} ${info.level}: ${info.message}`
}

export const createLogger = (config: WinstonLoggerOptionsInterface): WinstonAdapterLogger => {
  const timestampFormat = config.timestampFormat ?? 'YYYY-MM-DDTHH:mm:ss.SSS'
  const templateFunction = config.templateFunction ?? defaultTemplateFunction

  return new WinstonAdapterLogger(
    winston.createLogger({
      silent: config.silent,
      level: config.level,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: timestampFormat,
            }),
            winston.format.printf(templateFunction),
          ),
        }),
        ...config.transports,
      ],
    }),
  )
}
