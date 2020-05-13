import { Injectable } from '@nestjs/common'
import * as HttpStatus from 'http-status-codes'
import { ObosSsoConfig } from '../config/obos-sso.config'
import { FetchService } from '../../unfold-utils/service/fetch.service'
import { UnfoldLoggerService } from '../../unfold-logger/service/unfold-logger.service'

@Injectable()
export class ObosSsoValidateTokenService {
  constructor(private fetch: FetchService, private ssoConfig: ObosSsoConfig, private logger: UnfoldLoggerService) {}

  async validate(token: string): Promise<boolean> {
    const staticApiKeyToken = this.ssoConfig.getObosSsoStaticAuthenticationApiKey()

    // match against api key token for easier testing
    if (staticApiKeyToken && token === staticApiKeyToken) {
      this.logger.debug(`Authentication using static token '${staticApiKeyToken}'`)
      return true
    }

    const response = await this.fetch.call({
      method: 'POST',
      url: `${this.ssoConfig.getObosSsoUrl()}/tokenservice/${token}/validate`,
    })

    return response.status === HttpStatus.OK
  }
}
