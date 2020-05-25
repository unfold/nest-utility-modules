import { DynamicModule } from '@nestjs/common'
import { SentryCoreModuleOptionsInterface } from './types/interfaces'

export const SENTRY_MODULE_CONFIG = 'SENTRY_MODULE_CONFIG'

export class SentryCoreModule {
  static forRootAsync(options: SentryCoreModuleOptionsInterface): DynamicModule {
    return {
      module: SentryCoreModule,
      providers: [
        {
          provide: SENTRY_MODULE_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [SENTRY_MODULE_CONFIG],
      imports: options.imports,
    }
  }
}
