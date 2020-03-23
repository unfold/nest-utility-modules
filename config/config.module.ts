import { DynamicModule } from '@nestjs/common'
import { ConfigService } from './service/config.service'
import { ConfigModuleOptionsInterface } from './types/interfaces'

export class ConfigModule {
  static forRoot(options: ConfigModuleOptionsInterface): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
      providers: [
        {
          provide: ConfigService,
          useValue: new ConfigService(options),
        },
      ],
      exports: [ConfigService],
    }
  }
}
