import { Injectable } from '@nestjs/common'
import * as HttpStatus from 'http-status-codes'
import { UnfoldLoggerService } from '../../unfold-logger'
import { ObosSsoConfig } from '../config/obos-sso.config'
import { FetchService } from '../../unfold-utils'

@Injectable()
export class ObosSsoValidateTokenService {
  constructor(private fetch: FetchService, private ssoConfig: ObosSsoConfig, private logger: UnfoldLoggerService) {}

  async validate(token: string): Promise<boolean> {
    const apiKeyToken = this.ssoConfig.OBOS_STATIC_AUTHENTICATION_API_KEY

    // match against api key token for easier testing
    if (apiKeyToken && token === apiKeyToken) {
      this.logger.debug(`Authentication using static token`)
      return true
    }

    const response = await this.fetch.call({
      method: 'POST',
      url: `${this.ssoConfig.OBOS_SSO_URL}/tokenservice/${token}/validate`,
    })

    return response.status === HttpStatus.OK
  }
}
