import { DynamicModule, Logger, LoggerService } from '@nestjs/common'
import { UnfoldLoggerService } from './service/unfold-logger.service'
import { UNFOLD_CORE_LOGGER, UnfoldLoggerCoreModule } from './unfold-logger-core.module'
import { UnfoldLoggerModuleOptionsAsyncInterface, UnfoldLoggerModuleOptionsInterface } from './types/interfaces'

export class UnfoldLoggerModule {
  static forRoot(options?: UnfoldLoggerModuleOptionsInterface): DynamicModule {
    return {
      global: true,
      module: UnfoldLoggerModule,
      providers: [
        {
          provide: UnfoldLoggerService,
          useValue: new UnfoldLoggerService(options?.logger ?? new Logger('UnfoldLogger')),
        },
      ],
      exports: [UnfoldLoggerService],
    }
  }

  static async forAsyncRoot(options: UnfoldLoggerModuleOptionsAsyncInterface): Promise<DynamicModule> {
    return {
      global: true,
      module: UnfoldLoggerModule,
      providers: [
        {
          provide: UnfoldLoggerService,
          useFactory: (logger: LoggerService) => new UnfoldLoggerService(logger),
          inject: [UNFOLD_CORE_LOGGER],
        },
      ],
      exports: [UnfoldLoggerService],
      imports: [UnfoldLoggerCoreModule.forRootAsync(options)],
    }
  }
}
