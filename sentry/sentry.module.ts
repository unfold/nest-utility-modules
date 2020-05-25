import { DynamicModule } from '@nestjs/common'
import { SentryService } from './service/sentry.service'
import { SentryConfig } from './config/sentry.config'
import { SentryConfigDataInterface, SentryCoreModuleOptionsInterface } from './types/interfaces'
import { SENTRY_MODULE_CONFIG, SentryCoreModule } from './sentry-core.module'

export class SentryModule {
  static forRoot(options: SentryCoreModuleOptionsInterface): DynamicModule {
    return {
      module: SentryModule,
      imports: [SentryCoreModule.forRootAsync(options)],
      providers: [
        {
          provide: SentryConfig,
          useFactory: (config: SentryConfigDataInterface) => new SentryConfig(config),
          inject: [SENTRY_MODULE_CONFIG],
        },
        SentryService,
      ],
      exports: [SentryService],
    }
  }
}
