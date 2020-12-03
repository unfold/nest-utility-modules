import { Injectable } from '@nestjs/common'
import { FetchService } from '../../unfold-utils/service/fetch.service'
import { NotificationApiConfig } from '../config/notification-api.config'
import { ObosSsoGetTokenService } from '../../obos-sso/service/obos-sso-get-token.service'
import { SendOptionsInterface } from '../types/interfaces'
import * as uuid from 'uuid'
import * as HttpStatus from 'http-status-codes'

interface SmsSendResultInterface {
  success: boolean
  response: {
    status: number
    text: string
  }
}

@Injectable()
export class SmsService {
  constructor(private fetch: FetchService, private config: NotificationApiConfig, private obosToken: ObosSsoGetTokenService) {}

  async send(input: any, options: SendOptionsInterface = {}): Promise<SmsSendResultInterface> {
    const response = await this.fetch.call({
      method: 'POST',
      url: `${this.config.getNotificationApiUrl()}/sms/send`,
      data: input,
      headers: {
        'X-OBOS-APPTOKENID': await this.obosToken.getObosToken(),
        'Content-Type': 'application/json',
        'X-OBOS-REQUEST-ID': options.requestId ?? `srv-${uuid.v4()}`,
        Accept: 'application/json',
      },
    })

    const success = [HttpStatus.OK, HttpStatus.CREATED].includes(response.status)

    if (options.throwOnFailure && !success) {
      throw new Error(`[SmsService] Sending sms failed: [${response.status}] ${await response.text()}, input: ${JSON.stringify(input)}`)
    }

    return {
      success,
      response: {
        status: response.status,
        text: await response.text(),
      },
    }
  }
}
