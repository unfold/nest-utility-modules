import { Injectable } from '@nestjs/common'
import { FetchService } from '../../unfold-utils/service/fetch.service'
import { NotificationApiConfig } from '../config/notification-api.config'
import { ObosSsoGetTokenService } from '../../obos-sso/service/obos-sso-get-token.service'
import { SendOptionsInterface } from '../types/interfaces'
import * as uuid from 'uuid'
import { StatusCodes as HttpStatus } from 'http-status-codes'
import * as fetch from 'node-fetch'

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
  token: string
  error?: {
    message: string
    tokenNotActive?: boolean
  }
  info?: any
}

export interface PushNotificationInputInterface {
  type: DeviceType
  message: PushNotificationMessageInterface
  receiver: PushNotificationReceiverInterface
}

export interface PushNotificationBatchInputInterface {
  type: DeviceType
  message: PushNotificationMessageInterface
  receivers: PushNotificationReceiverInterface[]
}

export interface PushNotificationBatchSendResultInterface {
  successCount: number
  failureCount: number
  results: PushNotificationSendResultInterface[]
}

@Injectable()
export class PushNotificationService {
  constructor(private fetchService: FetchService, private config: NotificationApiConfig, private obosToken: ObosSsoGetTokenService) {}

  async sendBatch(input: PushNotificationBatchInputInterface, options: SendOptionsInterface = {}): Promise<PushNotificationBatchSendResultInterface> {
    const response = await this.fetchService.call({
      method: 'POST',
      url: `${this.config.getNotificationApiUrl()}/push-notification/send-batch`,
      data: {
        type: input.type,
        data: {
          message: input.message,
          receivers: input.receivers,
        },
      },
      headers: await this.getHeaders(options),
    })

    const result = await PushNotificationService.getResponseData<PushNotificationBatchSendResultInterface>(response, input)

    return {
      failureCount: result.failureCount,
      successCount: result.successCount,
      results: result.results,
    }
  }

  async send(input: PushNotificationInputInterface, options: SendOptionsInterface = {}): Promise<PushNotificationSendResultInterface> {
    const response = await this.fetchService.call({
      method: 'POST',
      url: `${this.config.getNotificationApiUrl()}/push-notification/send`,
      data: {
        type: input.type,
        data: {
          message: input.message,
          receiver: input.receiver,
        },
      },
      headers: await this.getHeaders(options),
    })

    const result = await PushNotificationService.getResponseData<PushNotificationSendResultInterface>(response, input)

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
      token: result.token,
      error: result.error,
      info: result.info,
    }
  }

  private async getHeaders(options: SendOptionsInterface) {
    return {
      'X-OBOS-APPTOKENID': await this.obosToken.getObosToken(),
      'Content-Type': 'application/json',
      requestId: options.requestId ?? `srv-${uuid.v4()}`,
      Accept: 'application/json',
      'X-JOB-ID': options.jobId ?? `n/a`,
    }
  }

  private static async getResponseData<T>(response: fetch.Response, input: any): Promise<T> {
    if (![HttpStatus.OK, HttpStatus.CREATED].includes(response.status)) {
      throw new Error(
        `[PushNotificationService] Sending push notification failed: [${response.status}] ${await response.text()}, input: ${JSON.stringify(input)}`,
      )
    }

    return (await response.json()) as T
  }
}
