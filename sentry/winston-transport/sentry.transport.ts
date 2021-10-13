import * as WinstonTransport from 'winston-transport'
import { SentryService } from '../service/sentry.service'

// @ts-ignore
export class SentryTransport extends WinstonTransport {
  constructor(private sentry: SentryService) {
    super()
  }

  log(info: any, callback: () => void) {
    // @todo configure level?
    if (info.level === 'error') {
      this.sentry.logMessage(info.message)
    }

    callback()
  }
}
