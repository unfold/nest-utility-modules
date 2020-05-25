import { Injectable } from '@nestjs/common'
import { SentryConfigDataInterface } from '../types/interfaces'

@Injectable()
export class SentryConfig {
  constructor(private data: SentryConfigDataInterface) {}

  getSentryDsn(): string {
    return this.data.SENTRY_DSN
  }

  getSentryEnvironment(): string {
    return this.data.SENTRY_ENVIRONMENT
  }

  isRequired(): boolean {
    return this.data.SENTRY_REQUIRED
  }
}
