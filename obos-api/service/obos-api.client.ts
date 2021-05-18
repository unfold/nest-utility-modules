import { isString } from 'lodash'
import * as fetch from 'node-fetch'
import { FetchMethod, FetchService } from '../../unfold-utils/service/fetch.service'
import { ObosSsoGetTokenService } from '../../obos-sso/service/obos-sso-get-token.service'
import { UnfoldLoggerService } from '../../unfold-logger/service/unfold-logger.service'
import { isUrl } from '../../unfold-utils'

interface CallObosApiInterface {
  endpoint: string
  method: FetchMethod
  data?: { [name: string]: any } | string
  textResponse?: boolean
  plainTextContent?: boolean
  successStatus?: number
}

export class ObosApiClient {
  constructor(
    private obosToken: ObosSsoGetTokenService,
    private fetchService: FetchService,
    private logger: UnfoldLoggerService,
    private obosApiUrl?: string,
  ) {}

  private getObosApiUrl(): string {
    if (this.obosApiUrl && isUrl(this.obosApiUrl)) {
      return this.obosApiUrl
    }

    throw new Error(`[ObosApiClient] $obosApiUrl should be a valid url address, given value: ${JSON.stringify(this.obosApiUrl)}`)
  }

  async callApi(options: CallObosApiInterface): Promise<fetch.Response> {
    const response = await this.fetchService.call({
      rawData: options.plainTextContent && isString(options.data) ? options.data : JSON.stringify(options.data),
      headers: {
        Accept: 'application/json',
        'Content-Type': options.plainTextContent ? 'text/plain' : 'application/json',
        'X-OBOS-APPTOKENID': await this.obosToken.getObosToken(),
      },
      method: options.method,
      url: `${this.getObosApiUrl()}${options.endpoint}`,
    })

    if (options.successStatus && response.status !== options.successStatus) {
      throw new Error(
        `[Obos.callApi] [${options.method}] [${options.endpoint}] Invalid status code: ${response.status} (${
          response.statusText
        }), text: ${await response.text()}`,
      )
    } else if (response.status >= 400) {
      this.logger.warn(
        `[Obos.callApi] [${options.method}] [${options.endpoint}] Invalid status code: ${response.status} (${
          response.statusText
        }), text: ${await response.clone().text()}`,
      )
    }

    return response
  }
}
