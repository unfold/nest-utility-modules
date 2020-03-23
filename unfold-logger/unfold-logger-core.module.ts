import { DynamicModule } from '@nestjs/common'
import { UnfoldLoggerModuleOptionsAsyncInterface } from './types/interfaces'

export const UNFOLD_CORE_LOGGER = 'UNFOLD_CORE_LOGGER'

export class UnfoldLoggerCoreModule {
  static forRootAsync(options: UnfoldLoggerModuleOptionsAsyncInterface): DynamicModule {
    return {
      module: UnfoldLoggerCoreModule,
      providers: [
        {
          provide: UNFOLD_CORE_LOGGER,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [UNFOLD_CORE_LOGGER],
      imports: options.imports,
    }
  }
}
