import { DynamicModule, ForwardReference, LoggerService, Type } from '@nestjs/common'

export interface UnfoldLoggerModuleOptionsInterface {
  logger?: LoggerService
}

export interface UnfoldLoggerModuleOptionsAsyncInterface {
  useFactory: (...args: any[]) => Promise<LoggerService> | LoggerService
  inject?: any[]
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference)[]
}
