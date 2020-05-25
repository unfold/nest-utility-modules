import { Injectable } from '@nestjs/common'
import * as Sentry from '@sentry/node'
import { SentryConfig } from '../config/sentry.config'

@Injectable()
export class SentryService {
  readonly isInitialized: boolean = false

  constructor(config: SentryConfig) {
    const sentryDsn = config.getSentryDsn()
    const sentryEnvironment = config.getSentryEnvironment()

    if (sentryDsn && sentryEnvironment) {
      Sentry.init({
        dsn: sentryDsn,
        environment: sentryEnvironment,
      })
      this.isInitialized = true
    } else if (config.isRequired()) {
      throw new Error(`Missing config variables: SENTRY_DSN or SENTRY_ENVIRONMENT`)
    }
  }

  logMessage(message: string) {
    if (this.isInitialized) {
      Sentry.captureEvent({
        message: `${message}`,
      })
    }
  }
}
