import { Injectable } from '@nestjs/common'
import { ObosSsoConfigDataInterface } from '..'

@Injectable()
export class ObosSsoConfig {
  constructor(private ssoConfig: ObosSsoConfigDataInterface) {}

  getObosSsoUrl(): string {
    return this.ssoConfig.OBOS_SSO_URL
  }

  getObosSsoAppId(): number {
    return this.ssoConfig.OBOS_SSO_APP_ID
  }

  getObosSsoAppSecret(): string {
    return this.ssoConfig.OBOS_SSO_APP_SECRET
  }

  getObosSsoStaticAuthenticationApiKey(): string | null {
    return this.ssoConfig.OBOS_STATIC_AUTHENTICATION_API_KEY ?? null
  }
}
