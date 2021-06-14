import { Injectable } from '@nestjs/common'
import { Strategy } from 'passport-custom'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ObosSsoValidateTokenService } from '../service/obos-sso-validate-token.service'
import { UnfoldLoggerService } from '../../unfold-logger/service/unfold-logger.service'

@Injectable()
export class ObosSsoTokenStrategy extends PassportStrategy(Strategy, 'obos-token') {
  constructor(private obosValidateToken: ObosSsoValidateTokenService, private logger: UnfoldLoggerService) {
    super()
  }

  async validate(request: Request) {
    const token = request.header('x-obos-apptokenid')

    if (!token) {
      this.logger.error(`[ObosSsoTokenStrategy] No 'x-obos-apptokenid' token in headers!`)
      return false
    }

    return this.obosValidateToken.validate(token)
  }
}
