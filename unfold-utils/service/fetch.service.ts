import { Injectable } from '@nestjs/common'
import * as fetch from 'node-fetch'

export type FetchMethod = 'GET' | 'POST' | 'PUT'

interface RequestOptionsInterface {
  readonly method: FetchMethod
  readonly url: string
  readonly data?: object | string
  readonly rawData?: fetch.BodyInit
  readonly headers?: { [name: string]: string }
}

@Injectable()
export class FetchService {
  call(options: RequestOptionsInterface): Promise<fetch.Response> {
    return fetch.default(options.url, {
      body: options.rawData ? options.rawData : options.data ? JSON.stringify(options.data) : undefined,
      headers: options.headers,
      method: options.method,
    })
  }
}
