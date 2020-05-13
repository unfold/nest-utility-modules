import { Injectable } from '@nestjs/common'
import { StyrerommetConfigDataInterface } from '..'

@Injectable()
export class StyrerommetConfig {
  constructor(private config: StyrerommetConfigDataInterface) {}

  getStyrerommetSiteUrl(): string {
    return this.config.STYREROMMET_SITE_URL
  }

  getVibboSiteUrl(): string {
    return this.config.VIBBO_SITE_URL
  }
}
