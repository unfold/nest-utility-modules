import { Injectable, LoggerService } from '@nestjs/common'

@Injectable()
export class UnfoldLoggerService implements LoggerService {
  constructor(private logger: LoggerService) {}

  error(message: any, trace?: string, context?: string): any {
    this.logger.error(message, trace, context)
  }

  log(message: any, context?: string): any {
    this.logger.log(message, context)
  }

  warn(message: any, context?: string): any {
    this.logger.warn(message, context)
  }

  debug(message: any, context?: string): any {
    if (this.logger.debug) {
      this.logger.debug(message, context)
    }
  }
}
