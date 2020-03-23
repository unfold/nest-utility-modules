import { DynamicModule } from '@nestjs/common'
import { ObosSsoCoreModuleOptionsInterface } from './types/interfaces'

export const OBOS_SSO_MODULE_CONFIG = 'OBOS_SSO_MODULE_CONFIG'

export class ObosSsoCoreModule {
  static forRootAsync(options: ObosSsoCoreModuleOptionsInterface): DynamicModule {
    return {
      module: ObosSsoCoreModule,
      providers: [
        {
          provide: OBOS_SSO_MODULE_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [OBOS_SSO_MODULE_CONFIG],
      imports: options.imports,
    }
  }
}
