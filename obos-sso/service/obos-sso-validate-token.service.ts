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
    if (staticApiKeyToken) {
      this.logger.debug(`[ObosSsoValidateTokenService] Authentication using static token '${staticApiKeyToken}': ${token === staticApiKeyToken}`)

      return token === staticApiKeyToken
    }

    const response = await this.fetch.call({
      method: 'POST',
      url: `${this.ssoConfig.getObosSsoUrl()}/tokenservice/${token}/validate`,
    })

    if (response.status !== HttpStatus.OK) {
      this.logger.error(
        `[ObosSsoValidateTokenService] Invalid token validation, token: '${token}' response status: '${
          response.status
        }', body: ${await response.text()}`,
      )
      return false
    }

    return true
  }
}
