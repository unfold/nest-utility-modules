import { DynamicModule, ForwardReference, Type } from '@nestjs/common'

export type StyrerommetServiceName = 'styrerommet' | 'vibbo'

export interface StyrerommetConfigDataInterface {
  STYREROMMET_SITE_URL: string
  VIBBO_SITE_URL: string
}

export interface StyrerommetCoreModuleOptionsInterface {
  useFactory: (...args: any[]) => Promise<StyrerommetConfigDataInterface> | StyrerommetConfigDataInterface
  inject?: any[]
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference)[]
}
