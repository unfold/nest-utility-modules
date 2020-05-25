import { Injectable } from '@nestjs/common'
import { StyrerommetServiceName } from '../types/interfaces'
import { StyrerommetApiRequest } from '../utils/request/styrerommet-api-request'
import { StyrerommetConfig } from '../config/styrerommet.config'
import { ObosSsoGetTokenService } from '../../obos-sso/service/obos-sso-get-token.service'
import { FetchService } from '../../unfold-utils/service/fetch.service'

@Injectable()
export class StyrerommetApiRequestFactory {
  constructor(private styrerommetConfig: StyrerommetConfig, private obosSsoGetToken: ObosSsoGetTokenService, private fetch: FetchService) {}

  getApiRequest(service: StyrerommetServiceName = 'styrerommet'): StyrerommetApiRequest {
    return new StyrerommetApiRequest(this.getApiUrl(service), this.obosSsoGetToken, this.fetch)
  }

  private getApiUrl(service: StyrerommetServiceName): string {
    if (service === 'styrerommet') {
      return this.styrerommetConfig.getStyrerommetSiteUrl()
    }
    if (service === 'vibbo') {
      return this.styrerommetConfig.getVibboSiteUrl()
    }

    throw new Error(`Unknown service name: '${service}'`)
  }
}
