import { DynamicModule } from '@nestjs/common'
import { ObosSsoGetTokenService } from './service/obos-sso-get-token.service'
import { ObosSsoValidateTokenService } from './service/obos-sso-validate-token.service'
import { OBOS_SSO_MODULE_CONFIG, ObosSsoCoreModule } from './obos-sso-core.module'
import { ObosSsoConfigDataInterface, ObosSsoCoreModuleOptionsInterface } from './types/interfaces'
import { PassportModule } from '@nestjs/passport'
import { ObosSsoConfig } from './config/obos-sso.config'
import { ObosSsoTokenStrategy } from './strategy/obos-sso-token.strategy'
import { UnfoldUtilsModule } from '../unfold-utils/unfold-utils.module'

export class ObosSsoModule {
  static forRoot(options: ObosSsoCoreModuleOptionsInterface): DynamicModule {
    return {
      module: ObosSsoModule,
      global: true,
      imports: [PassportModule.register({ defaultStrategy: 'obos-token' }), UnfoldUtilsModule, ObosSsoCoreModule.forRootAsync(options)],
      providers: [
        {
          provide: ObosSsoConfig,
          useFactory: (config: ObosSsoConfigDataInterface) => new ObosSsoConfig(config),
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
