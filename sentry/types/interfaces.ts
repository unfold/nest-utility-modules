import { DynamicModule, ForwardReference, Type } from '@nestjs/common'

export interface SentryConfigDataInterface {
  SENTRY_DSN: string
  SENTRY_ENVIRONMENT: string
  SENTRY_REQUIRED: boolean
}

export interface SentryCoreModuleOptionsInterface {
  useFactory: (...args: any[]) => Promise<SentryConfigDataInterface> | SentryConfigDataInterface
  inject?: any[]
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference)[]
}
