import { DynamicModule } from '@nestjs/common'
import { NotificationsApiCoreModuleOptionsInterface } from './types/interfaces'

export const NOTIFICATIONS_API_CONFIG_SERVICE = 'NOTIFICATIONS_API_CONFIG_SERVICE'

export class NotificationsApiCoreModule {
  static forRootAsync(options: NotificationsApiCoreModuleOptionsInterface): DynamicModule {
    return {
      module: NotificationsApiCoreModule,
      providers: [
        {
          provide: NOTIFICATIONS_API_CONFIG_SERVICE,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [NOTIFICATIONS_API_CONFIG_SERVICE],
      imports: options.imports,
    }
  }
}
