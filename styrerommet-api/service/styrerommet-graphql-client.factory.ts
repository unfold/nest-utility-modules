import { Injectable } from '@nestjs/common'
import { StyrerommetApiRequest } from '../utils/request/styrerommet-api-request'
import { StyrerommetServiceName } from '../types/interfaces'
import { StyrerommetGraphqlClient } from '../utils/graphql-client/styrerommet-graphql-client'
import { StyrerommetConfig } from '../config/styrerommet.config'
import { ObosSsoGetTokenService } from '../../obos-sso/service/obos-sso-get-token.service'
import { FetchService } from '../../unfold-utils/service/fetch.service'

@Injectable()
export class StyrerommetGraphqlClientFactory {
  private readonly clients: { [service in StyrerommetServiceName]: StyrerommetGraphqlClient }

  constructor(private styrerommetConfig: StyrerommetConfig, private obosSsoGetToken: ObosSsoGetTokenService, private fetch: FetchService) {
    this.clients = {
      styrerommet: new StyrerommetGraphqlClient(
        new StyrerommetApiRequest(this.styrerommetConfig.getStyrerommetSiteUrl(), this.obosSsoGetToken, this.fetch),
      ),
      vibbo: new StyrerommetGraphqlClient(new StyrerommetApiRequest(this.styrerommetConfig.getVibboSiteUrl(), this.obosSsoGetToken, this.fetch)),
    }
  }

  getClient(service: StyrerommetServiceName = 'styrerommet'): StyrerommetGraphqlClient {
    if (this.clients[service]) {
      return this.clients[service]
    }

    throw new Error(`No client for service '${service}'`)
  }
}
