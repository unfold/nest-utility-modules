import { DynamicModule } from '@nestjs/common'
import { StyrerommetConfigDataInterface, StyrerommetCoreModuleOptionsInterface } from './types/interfaces'
import { STYREROMMET_CONFIG_SERVICE, StyrerommetApiCoreModule } from './styrerommet-api-core.module'
import { StyrerommetConfig } from './config/styrerommet.config'
import { StyrerommetGraphqlClientFactory } from './service/styrerommet-graphql-client.factory'
import { UnfoldUtilsModule } from '../unfold-utils'

export class StyrerommetApiModule {
  static async forAsyncRoot(options: StyrerommetCoreModuleOptionsInterface): Promise<DynamicModule> {
    return {
      module: StyrerommetApiModule,
      imports: [StyrerommetApiCoreModule.forRootAsync(options), UnfoldUtilsModule],
      providers: [
        {
          provide: StyrerommetConfig,
          useFactory: (config: StyrerommetConfigDataInterface) => new StyrerommetConfig(config),
          inject: [STYREROMMET_CONFIG_SERVICE],
        },
        StyrerommetGraphqlClientFactory,
      ],
      exports: [StyrerommetGraphqlClientFactory],
    }
  }
}
