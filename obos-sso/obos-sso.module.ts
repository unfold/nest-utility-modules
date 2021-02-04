import { DynamicModule } from '@nestjs/common'
import { ObosSsoGetTokenService } from './service/obos-sso-get-token.service'
import { ObosSsoValidateTokenService } from './service/obos-sso-validate-token.service'
import { OBOS_SSO_MODULE_CONFIG, ObosSsoCoreModule } from './obos-sso-core.module'
import { ObosSsoConfigDataInterface, ObosSsoCoreModuleOptionsInterface } from './types/interfaces'
import { PassportModule } from '@nestjs/passport'
import { ObosSsoConfig } from './config/obos-sso.config'
import { ObosSsoTokenStrategy } from './strategy/obos-sso-token.strategy'
import { UnfoldUtilsModule } from '../unfold-utils/unfold-utils.module'
import { isUrl } from '../unfold-utils'

export class ObosSsoModule {
  static forRoot(options: ObosSsoCoreModuleOptionsInterface): DynamicModule {
    return {
      module: ObosSsoModule,
      global: true,
      imports: [PassportModule.register({ defaultStrategy: 'obos-token' }), UnfoldUtilsModule, ObosSsoCoreModule.forRootAsync(options)],
      providers: [
        {
          provide: ObosSsoConfig,
          useFactory: (config: ObosSsoConfigDataInterface) => {
            if (!config.OBOS_STATIC_AUTHENTICATION_API_KEY) {
              if (!config.OBOS_SSO_URL) {
                throw new Error(`[ObosSsoModule] Parameter 'OBOS_SSO_URL' is required if 'OBOS_STATIC_AUTHENTICATION_API_KEY' is not provided!`)
              }
              if (!isUrl(config.OBOS_SSO_URL)) {
                throw new Error(`[ObosSsoModule] Parameter 'OBOS_SSO_URL' should be valid url (provided value: '${config.OBOS_SSO_URL}')`)
              }
              if (!config.OBOS_SSO_APP_ID) {
                throw new Error(`[ObosSsoModule] Parameter 'OBOS_SSO_APP_ID' is required if 'OBOS_STATIC_AUTHENTICATION_API_KEY' is not provided!`)
              }
              if (!config.OBOS_SSO_APP_SECRET) {
                throw new Error(
                  `[ObosSsoModule] Parameter 'OBOS_SSO_APP_SECRET' is required if 'OBOS_STATIC_AUTHENTICATION_API_KEY' is not provided!`,
                )
              }
            }
            return new ObosSsoConfig(config)
          },
          inject: [OBOS_SSO_MODULE_CONFIG],
        },
        ObosSsoGetTokenService,
        ObosSsoValidateTokenService,
        ObosSsoTokenStrategy,
      ],
      exports: [ObosSsoGetTokenService, ObosSsoValidateTokenService, ObosSsoTokenStrategy],
    }
  }
}
