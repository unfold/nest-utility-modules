import { DynamicModule, ForwardReference, Type } from '@nestjs/common'

export interface ObosApiConfigDataInterface {
  OBOS_API_URL?: string
  OBOS_API_REQUIRED?: boolean
}

export interface ObosApiCoreModuleOptionsInterface {
  useFactory: (...args: any[]) => Promise<ObosApiConfigDataInterface> | Promise<string> | ObosApiConfigDataInterface | string
  inject?: any[]
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference)[]
}
