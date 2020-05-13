import { Injectable } from '@nestjs/common'
import { NotificationsApiConfigDataInterface } from '..'

@Injectable()
export class NotificationApiConfig {
  constructor(private data: NotificationsApiConfigDataInterface) {}

  getNotificationApiUrl(): string {
    return this.data.NOTIFICATION_API_URL
  }
}
