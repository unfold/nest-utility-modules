import { Injectable } from '@nestjs/common'
import { ObosSsoConfigDataInterface } from '../types/interfaces'

@Injectable()
export class ObosSsoConfig {
  constructor(private ssoConfig: ObosSsoConfigDataInterface) {}

  getObosSsoUrl(): string {
    if (!this.ssoConfig.OBOS_SSO_URL) {
      throw new Error(`[ObosSsoConfig] Parameter 'OBOS_SSO_URL' is not defined!`)
    }
    return this.ssoConfig.OBOS_SSO_URL
  }

  getObosSsoAppId(): number {
    if (!this.ssoConfig.OBOS_SSO_APP_ID) {
      throw new Error(`[ObosSsoConfig] Parameter 'OBOS_SSO_APP_ID' is not defined!`)
    }
    return this.ssoConfig.OBOS_SSO_APP_ID
  }

  getObosSsoAppSecret(): string {
    if (!this.ssoConfig.OBOS_SSO_APP_SECRET) {
      throw new Error(`[ObosSsoConfig] Parameter 'OBOS_SSO_APP_SECRET' is not defined!`)
    }
    return this.ssoConfig.OBOS_SSO_APP_SECRET
  }

  getObosSsoStaticAuthenticationApiKey(): string | null {
    return this.ssoConfig.OBOS_STATIC_AUTHENTICATION_API_KEY ?? null
  }
}
