import { DynamicModule } from '@nestjs/common'
import { StyrerommetCoreModuleOptionsInterface } from './types/interfaces'

export const STYREROMMET_CONFIG_SERVICE = 'STYREROMMET_CONFIG_SERVICE'

export class StyrerommetApiCoreModule {
  static forRootAsync(options: StyrerommetCoreModuleOptionsInterface): DynamicModule {
    return {
      module: StyrerommetApiCoreModule,
      providers: [
        {
          provide: STYREROMMET_CONFIG_SERVICE,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [STYREROMMET_CONFIG_SERVICE],
      imports: options.imports,
    }
  }
}
