import * as fetch from 'node-fetch'
import { ObosSsoGetTokenService } from '../../../obos-sso/service/obos-sso-get-token.service'
import { FetchService } from '../../../unfold-utils/service/fetch.service'
import * as uuid from 'uuid'

interface StyrerommetApiRequestServiceOptionsInterface {
  readonly method: 'GET' | 'POST'
  readonly endpoint: string
  readonly data?: object | string
  readonly expectedResponseStatus?: number
  readonly requestId?: string
}

export class StyrerommetApiRequest {
  constructor(private apiUrl: string, private obosAuthorize: ObosSsoGetTokenService, private fetchService: FetchService) {}

  async call(options: StyrerommetApiRequestServiceOptionsInterface): Promise<fetch.Response> {
    const url = `${this.apiUrl}${options.endpoint}`

    const response = await this.fetchService.call({
      method: options.method,
      url,
      data: options.data,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-OBOS-APPTOKENID': await this.obosAuthorize.getObosToken(),
        'X-OBOS-REQUEST-ID': options.requestId ?? `srv-${uuid.v4()}`,
      },
    })

    if (options.expectedResponseStatus && response.status !== options.expectedResponseStatus) {
      throw new Error(`[${url}] [${options.method}] Invalid status code: ${response.status} (${response.statusText}), text: ${await response.text()}`)
    }

    return response
  }
}
