import { DynamicModule } from '@nestjs/common'
import { NotificationsApiConfigDataInterface, NotificationsApiCoreModuleOptionsInterface } from './types/interfaces'
import { NOTIFICATIONS_API_CONFIG_SERVICE, NotificationsApiCoreModule } from './notifications-api-core.module'
import { NotificationApiConfig } from './config/notification-api.config'
import { UnfoldUtilsModule } from '../unfold-utils/unfold-utils.module'
import { EmailService } from './service/email.service'
import { PushNotificationService } from './service/push-notification.service'

export class NotificationsApiModule {
  static async forAsyncRoot(options: NotificationsApiCoreModuleOptionsInterface): Promise<DynamicModule> {
    return {
      module: NotificationsApiModule,
      imports: [NotificationsApiCoreModule.forRootAsync(options), UnfoldUtilsModule],
      providers: [
        {
          provide: NotificationApiConfig,
          useFactory: (config: NotificationsApiConfigDataInterface) => new NotificationApiConfig(config),
          inject: [NOTIFICATIONS_API_CONFIG_SERVICE],
        },
        EmailService,
        PushNotificationService,
      ],
      exports: [EmailService, PushNotificationService],
    }
  }
}
