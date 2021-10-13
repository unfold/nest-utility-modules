import { Injectable } from '@nestjs/common'
import { StatusCodes as HttpStatus } from 'http-status-codes'
import { get, isUndefined } from 'lodash'
import ms = require('ms')
import { stringify } from 'querystring'
import * as xml2js from 'xml2js'
import { ObosSsoConfig } from '../config/obos-sso.config'
import { FetchService } from '../../unfold-utils/service/fetch.service'
import { TimedCacheService } from '../../unfold-utils/service/timed-cache.service'
import { UnfoldLoggerService } from '../../unfold-logger/service/unfold-logger.service'

@Injectable()
export class ObosSsoGetTokenService {
  constructor(
    private ssoConfig: ObosSsoConfig,
    private fetchService: FetchService,
    private timeCache: TimedCacheService,
    private logger: UnfoldLoggerService,
  ) {}

  async getObosToken(): Promise<string> {
    return this.timeCache.resolve<string>('obos_token', () => this.fetchObosToken(), ms('1 hour'), ms('4 hours'))
  }

  private async fetchObosToken(): Promise<string> {
    const staticToken = this.ssoConfig.getObosSsoStaticAuthenticationApiKey()
    if (staticToken) {
      this.logger.debug(`[fetchObosToken] Using static token: ${staticToken}`)

      return staticToken
    }

    const response = await this.fetchService.call({
      rawData: stringify({
        applicationcredential: `
            <applicationcredential>
              <params>
                <applicationID>${this.ssoConfig.getObosSsoAppId()}</applicationID>
                <applicationSecret>${this.ssoConfig.getObosSsoAppSecret()}</applicationSecret>
              </params>
            </applicationcredential>
            `,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      url: `${this.ssoConfig.getObosSsoUrl()}/tokenservice/logon`,
    })

    if (response.status !== HttpStatus.OK) {
      throw new Error(`[ObosAuthorizeService] Invalid status code: ${response.status} ${response.statusText}`)
    }

    return this.parseTokenFromResponse(await response.text())
  }

  private async parseTokenFromResponse(body: string): Promise<string> {
    return new Promise<string>((resolve, reject) =>
      xml2js.parseString(body, { explicitArray: false }, (error, result) => {
        if (error) {
          reject(error)
        } else {
          const token = get(result, 'token.params.applicationtoken')

          if (isUndefined(token)) {
            reject(new Error('[ObosAuthorizeService] Could not parse Obos Authorization data - XML contains invalid structure'))
          } else {
            resolve(token)
          }
        }
      }),
    )
  }
}
