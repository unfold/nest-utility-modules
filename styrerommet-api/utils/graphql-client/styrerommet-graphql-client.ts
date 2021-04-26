import { isArray } from 'lodash'
import * as HttpStatus from 'http-status-codes'
import { StyrerommetApiRequest } from '../request/styrerommet-api-request'
import { StyrerommetGraphqlResponseStatusError } from './styrerommet-graphql-response-status-error'

interface GraphqlCallInputInterface {
  query: string
  variables: object
}

interface GraphqlCallOptionsInterface {
  requestId?: string
}

export class StyrerommetGraphqlClient {
  constructor(private styrerommetApiRequest: StyrerommetApiRequest) {}

  async call<T>(input: GraphqlCallInputInterface, options?: GraphqlCallOptionsInterface): Promise<T> {
    const response = await this.styrerommetApiRequest.call({
      endpoint: '/graphql',
      method: 'POST',
      data: {
        query: input.query,
        variables: input.variables,
      },
      requestId: options?.requestId,
    })

    if (response.status !== HttpStatus.OK) {
      throw new StyrerommetGraphqlResponseStatusError(response.status, await response.text())
    }

    const data = await response.json()

    if (isArray(data.errors) && data.errors.length > 0) {
      const errorMessages = data.errors.map((error: { message: string; code: string }) => `${error.message} [code: ${error.code}]`)
      const message = errorMessages.join(', ')
      if (message.match(/bad gateway/gi)) {
        throw new StyrerommetGraphqlResponseStatusError(HttpStatus.BAD_GATEWAY, `Graphql error: ${message}`)
      }

      if (message.match(/ESOCKETTIMEDOUT/gi)) {
        throw new StyrerommetGraphqlResponseStatusError(HttpStatus.GATEWAY_TIMEOUT, `Graphql error: ${message}`)
      }

      throw new Error(`Graphql errors: ${message}`)
    }

    return data as T
  }
}
