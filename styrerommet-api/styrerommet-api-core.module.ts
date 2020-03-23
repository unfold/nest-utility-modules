import { DynamicModule } from '@nestjs/common'
import { StyrerommetCoreModuleOptionsInterface } from './types/interfaces'

export const STYREROMMET_MODULE_CONFIG = 'STYREROMMET_MODULE_CONFIG'

export class StyrerommetApiCoreModule {
  static forRootAsync(options: StyrerommetCoreModuleOptionsInterface): DynamicModule {
    return {
      module: StyrerommetApiCoreModule,
      providers: [
        {
          provide: STYREROMMET_MODULE_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [STYREROMMET_MODULE_CONFIG],
      imports: options.imports,
    }
  }
}
