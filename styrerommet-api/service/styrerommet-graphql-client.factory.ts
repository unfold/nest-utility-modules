import { Injectable } from '@nestjs/common'
import { StyrerommetServiceName } from '../types/interfaces'
import { StyrerommetGraphqlClient } from '../utils/graphql-client/styrerommet-graphql-client'
import { StyrerommetApiRequestFactory } from './styrerommet-api-request.factory'

@Injectable()
export class StyrerommetGraphqlClientFactory {
  private readonly clients: { [service in StyrerommetServiceName]: StyrerommetGraphqlClient }

  constructor(private apiRequestFactory: StyrerommetApiRequestFactory) {
    this.clients = {
      styrerommet: new StyrerommetGraphqlClient(this.apiRequestFactory.getApiRequest('styrerommet')),
      vibbo: new StyrerommetGraphqlClient(this.apiRequestFactory.getApiRequest('vibbo')),
    }
  }

  getClient(service: StyrerommetServiceName = 'styrerommet'): StyrerommetGraphqlClient {
    if (this.clients[service]) {
      return this.clients[service]
    }

    throw new Error(`No client for service '${service}'`)
  }
}
