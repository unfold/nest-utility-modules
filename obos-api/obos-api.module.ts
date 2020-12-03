import { DynamicModule } from '@nestjs/common'
import { ObosApiClient } from './service/obos-api.client'
import { ObosApiCoreModuleOptionsInterface, OBOS_API_CORE_MODULE_API_URL, ObosApiCoreModule } from './obos-api-core.module'
import { UnfoldUtilsModule } from '../unfold-utils/unfold-utils.module'
import { ObosSsoGetTokenService } from '../obos-sso/service/obos-sso-get-token.service'
import { FetchService } from '../unfold-utils/service/fetch.service'
import { UnfoldLoggerService } from '../unfold-logger/service/unfold-logger.service'

export class ObosApiModule {
  static forRoot(options: ObosApiCoreModuleOptionsInterface): DynamicModule {
    return {
      module: ObosApiModule,
      global: true,
      imports: [UnfoldUtilsModule, ObosApiCoreModule.forRootAsync(options)],
      providers: [
        {
          provide: ObosApiClient,
          useFactory: (
            obosApiUrl: string,
            obosToken: ObosSsoGetTokenService,
            fetchService: FetchService,
            logger: UnfoldLoggerService,
          ): ObosApiClient => {
            logger.log(`Initialize 'ObosApiClient' with API url: ${obosApiUrl}`)

            return new ObosApiClient(obosApiUrl, obosToken, fetchService, logger)
          },
          inject: [OBOS_API_CORE_MODULE_API_URL, ObosSsoGetTokenService, FetchService, UnfoldLoggerService],
        },
      ],
      exports: [ObosApiClient],
    }
  }
}
