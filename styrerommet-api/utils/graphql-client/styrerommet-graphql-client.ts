import { isArray } from 'lodash'
import * as HttpStatus from 'http-status-codes'
import { StyrerommetApiRequest } from '../request/styrerommet-api-request'
import { StyrerommetGraphqlResponseStatusError } from './styrerommet-graphql-response-status-error'

export class StyrerommetGraphqlClient {
  constructor(private styrerommetApiRequest: StyrerommetApiRequest) {}

  async call<T>(options: { query: string; variables: object }): Promise<T> {
    const response = await this.styrerommetApiRequest.call({
      endpoint: '/graphql',
      method: 'POST',
      data: {
        query: options.query,
        variables: options.variables,
      },
    })

    if (response.status !== HttpStatus.OK) {
      throw new StyrerommetGraphqlResponseStatusError(response.status, await response.text())
    }

    const data = await response.json()

    if (isArray(data.errors) && data.errors.length > 0) {
      const errorMessages = data.errors.map((error: { message: string; code: string }) => `${error.message} [code: ${error.code}]`)

      throw new Error(`Graphql errors: ${errorMessages.join(', ')}`)
    }

    return data as T
  }

  async encodeNodeId(nodeId: string, isProduction: boolean): Promise<string> {
    const encoding = isProduction ? 'base64' : 'utf8'

    return Buffer.from(nodeId, 'utf8').toString(encoding)
  }
}
