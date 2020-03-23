import { DynamicModule, ForwardReference, Type } from '@nestjs/common'

export interface ObosSsoConfigDataInterface {
  OBOS_SSO_URL: string
  OBOS_SSO_APP_ID: number
  OBOS_SSO_APP_SECRET: string
  OBOS_STATIC_AUTHENTICATION_API_KEY?: string
}

export interface ObosSsoCoreModuleOptionsInterface {
  useFactory: (...args: any[]) => Promise<ObosSsoConfigDataInterface> | ObosSsoConfigDataInterface
  inject?: any[]
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference)[]
}
