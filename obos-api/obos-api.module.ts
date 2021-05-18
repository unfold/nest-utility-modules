import { DynamicModule } from '@nestjs/common'
import { ObosApiClient } from './service/obos-api.client'
import { OBOS_API_CORE_MODULE_CONFIG, ObosApiCoreModule } from './obos-api-core.module'
import { UnfoldUtilsModule } from '../unfold-utils/unfold-utils.module'
import { ObosSsoGetTokenService } from '../obos-sso/service/obos-sso-get-token.service'
import { FetchService } from '../unfold-utils/service/fetch.service'
import { UnfoldLoggerService } from '../unfold-logger/service/unfold-logger.service'
import { ObosApiConfigDataInterface, ObosApiCoreModuleOptionsInterface } from './types/interfaces'
import { isUrl } from '../unfold-utils'
import { isObject } from 'lodash'

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
            config: ObosApiConfigDataInterface | string,
            obosToken: ObosSsoGetTokenService,
            fetchService: FetchService,
            logger: UnfoldLoggerService,
          ): ObosApiClient => {
            const obosApiUrl = isObject(config) ? config.OBOS_API_URL : config
            const obosApiRequired = isObject(config) ? config.OBOS_API_REQUIRED ?? true : true

            if (obosApiUrl && isUrl(obosApiUrl)) {
              logger.debug(`Initialize 'ObosApiClient' with API url: ${obosApiUrl}`)

              return new ObosApiClient(obosToken, fetchService, logger, obosApiUrl)
            } else if (!obosApiRequired) {
              logger.warn(`Initialize 'ObosApiClient' without API!`)

              return new ObosApiClient(obosToken, fetchService, logger)
            } else {
              throw new Error(`[ObosApiModule] OBOS API URL is required!`)
            }
          },
          inject: [OBOS_API_CORE_MODULE_CONFIG, ObosSsoGetTokenService, FetchService, UnfoldLoggerService],
        },
      ],
      exports: [ObosApiClient],
    }
  }
}
