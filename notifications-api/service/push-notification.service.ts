import { Injectable } from '@nestjs/common'
import { FetchService } from '../../unfold-utils/service/fetch.service'
import { NotificationApiConfig } from '../config/notification-api.config'
import { ObosSsoGetTokenService } from '../../obos-sso/service/obos-sso-get-token.service'
import { SendOptionsInterface } from '../types/interfaces'
import * as uuid from 'uuid'
import * as HttpStatus from 'http-status-codes'

export type DeviceType = 'ios' | 'android'

export interface PushNotificationReceiverInterface {
  token: string
  attributes?: {
    [name: string]: any
  }
}

export interface PushNotificationMessageInterface {
  notification: {
    title: string
    body: string
  }
  data: {
    [name: string]: any
  }
}

export interface PushNotificationSendResultInterface {
  success: boolean
  error?: {
    message: string
    tokenNotActive?: boolean
  }
}

export interface PushNotificationInputInterface {
  type: DeviceType
  message: PushNotificationMessageInterface
  receiver: PushNotificationReceiverInterface
}

@Injectable()
export class PushNotificationService {
  constructor(private fetch: FetchService, private config: NotificationApiConfig, private obosToken: ObosSsoGetTokenService) {}

  async send(input: PushNotificationInputInterface, options: SendOptionsInterface = {}): Promise<PushNotificationSendResultInterface> {
    const response = await this.fetch.call({
      method: 'POST',
      url: `${this.config.getNotificationApiUrl()}/push-notification/send`,
      data: {
        type: input.type,
        data: {
          message: input.message,
          receiver: input.receiver,
        },
      },
      headers: {
        'X-OBOS-APPTOKENID': await this.obosToken.getObosToken(),
        'Content-Type': 'application/json',
        'X-OBOS-REQUEST-ID': options.requestId ?? `srv-${uuid.v4()}`,
        Accept: 'application/json',
      },
    })

    if (![HttpStatus.OK, HttpStatus.CREATED].includes(response.status)) {
      throw new Error(
        `[PushNotificationService] Sending push notification failed: [${response.status}] ${await response.text()}, input: ${JSON.stringify(input)}`,
      )
    }

    const result = (await response.json()) as PushNotificationSendResultInterface

    if (!Object.keys(result).includes('success')) {
      throw new Error(
        `[PushNotificationService] Invalid response - missing 'success' field, result: ${JSON.stringify(result)}, input: ${JSON.stringify(input)}`,
      )
    }

    if (options.throwOnFailure && !result.success) {
      throw new Error(
        `[PushNotificationService] Sending push notification failed: [${response.status}] ${JSON.stringify(result)}, input: ${JSON.stringify(input)}`,
      )
    }

    return {
      success: result.success,
      error: result.error,
    }
  }
}
