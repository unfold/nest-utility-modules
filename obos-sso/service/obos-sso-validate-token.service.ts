import { Injectable } from '@nestjs/common'
import { StatusCodes as HttpStatus } from 'http-status-codes'
import { ObosSsoConfig } from '../config/obos-sso.config'
import { FetchService } from '../../unfold-utils/service/fetch.service'
import { UnfoldLoggerService } from '../../unfold-logger/service/unfold-logger.service'
import { withRetry } from '../../unfold-utils'

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

    return withRetry(
      async () => {
        const response = await this.fetch.call({
          method: 'POST',
          url: `${this.ssoConfig.getObosSsoUrl()}/tokenservice/${token}/validate`,
        })

        if (response.status === HttpStatus.OK) {
          return true
        }

        if (response.status === HttpStatus.CONFLICT) {
          this.logger.log(`[ObosSsoValidateTokenService] Invalid or expired token '${token}', response status 409`)
          return false
        }

        const message = `[ObosSsoValidateTokenService] Invalid token validation, token: '${token}' response status: '${
          response.status
        }', body: ${await response.text()}`
        this.logger.error(message)
        throw new Error(message)
      },
      {
        logger: this.logger,
      },
    )
  }
}
