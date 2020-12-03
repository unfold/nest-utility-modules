import { DynamicModule, ForwardReference, Type } from '@nestjs/common'

export const OBOS_API_CORE_MODULE_API_URL = 'OBOS_CORE_MODULE_API_URL'

export interface ObosApiCoreModuleOptionsInterface {
  useFactory: (...args: any[]) => Promise<string> | string
  inject?: any[]
  imports?: (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference)[]
}

export class ObosApiCoreModule {
  static forRootAsync(options: ObosApiCoreModuleOptionsInterface): DynamicModule {
    return {
      module: ObosApiCoreModule,
      providers: [
        {
          provide: OBOS_API_CORE_MODULE_API_URL,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [OBOS_API_CORE_MODULE_API_URL],
      imports: options.imports,
    }
  }
}
