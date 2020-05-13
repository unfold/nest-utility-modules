import { Injectable } from '@nestjs/common'
import { StyrerommetApiRequest } from '../utils/request/styrerommet-api-request'
import { ObosSsoGetTokenService } from '../../obos-sso'
import { FetchService } from '../../unfold-utils'
import { Service, StyrerommetConfig, StyrerommetGraphqlClient } from '..'

@Injectable()
export class StyrerommetGraphqlClientFactory {
  private readonly clients: { [service in Service]: StyrerommetGraphqlClient }

  constructor(private styrerommetConfig: StyrerommetConfig, private obosSsoGetToken: ObosSsoGetTokenService, private fetch: FetchService) {
    this.clients = {
      styrerommet: new StyrerommetGraphqlClient(
        new StyrerommetApiRequest(this.styrerommetConfig.getStyrerommetSiteUrl(), this.obosSsoGetToken, this.fetch),
      ),
      vibbo: new StyrerommetGraphqlClient(new StyrerommetApiRequest(this.styrerommetConfig.getVibboSiteUrl(), this.obosSsoGetToken, this.fetch)),
    }
  }

  getClient(service: Service = 'styrerommet'): StyrerommetGraphqlClient {
    if (this.clients[service]) {
      return this.clients[service]
    }

    throw new Error(`No client for service '${service}'`)
  }
}
