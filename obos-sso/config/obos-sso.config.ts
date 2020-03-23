import { Injectable } from '@nestjs/common'
import { ObosSsoConfigDataInterface } from '../types/interfaces'

@Injectable()
export class ObosSsoConfig {
  constructor(private ssoConfig: ObosSsoConfigDataInterface) {}

  get OBOS_SSO_URL(): string {
    return this.ssoConfig.OBOS_SSO_URL
  }

  get OBOS_SSO_APP_ID(): number {
    return this.ssoConfig.OBOS_SSO_APP_ID
  }

  get OBOS_SSO_APP_SECRET(): string {
    return this.ssoConfig.OBOS_SSO_APP_SECRET
  }

  get OBOS_STATIC_AUTHENTICATION_API_KEY(): string | null {
    return this.ssoConfig.OBOS_STATIC_AUTHENTICATION_API_KEY ?? null
  }
}
