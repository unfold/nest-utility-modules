import { DynamicModule } from '@nestjs/common'
import { ObosApiCoreModuleOptionsInterface } from './types/interfaces'

export const OBOS_API_CORE_MODULE_CONFIG = 'OBOS_API_CORE_MODULE_CONFIG'

export class ObosApiCoreModule {
  static forRootAsync(options: ObosApiCoreModuleOptionsInterface): DynamicModule {
    return {
      module: ObosApiCoreModule,
      providers: [
        {
          provide: OBOS_API_CORE_MODULE_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [OBOS_API_CORE_MODULE_CONFIG],
      imports: options.imports,
    }
  }
}
