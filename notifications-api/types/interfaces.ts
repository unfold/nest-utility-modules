import { DynamicModule, ForwardReference, Type } from '@nestjs/common'

export interface NotificationsApiConfigDataInterface {
  NOTIFICATION_API_URL: string
}

export interface NotificationsApiCoreModuleOptionsInterface {
  useFactory: (...args: any[]) => Promise<NotificationsApiConfigDataInterface> | NotificationsApiConfigDataInterface
  inject?: any[]
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference)[]
}
