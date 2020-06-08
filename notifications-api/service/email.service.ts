import { Injectable } from '@nestjs/common'
import { NotificationApiConfig } from '../config/notification-api.config'
import * as HttpStatus from 'http-status-codes'
import { FetchService } from '../../unfold-utils/service/fetch.service'
import { ObosSsoGetTokenService } from '../../obos-sso/service/obos-sso-get-token.service'
import * as uuid from 'uuid'
import { SendOptionsInterface } from '../types/interfaces'

interface EmailInputInterface {
  type: string
  data: object
}

interface EmailSendResultInterface {
  success: boolean
  response: {
    status: number
    text: string
  }
}

@Injectable()
export class EmailService {
  constructor(private fetch: FetchService, private config: NotificationApiConfig, private obosToken: ObosSsoGetTokenService) {}

  async send(input: EmailInputInterface, options: SendOptionsInterface = {}): Promise<EmailSendResultInterface> {
    const response = await this.fetch.call({
      method: 'POST',
      url: `${this.config.getNotificationApiUrl()}/email/send`,
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
      throw new Error(`[EmailService] Sending email failed: [${response.status}] ${await response.text()}, input: ${JSON.stringify(input)}`)
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
