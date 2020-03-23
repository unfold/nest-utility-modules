import * as HttpStatus from 'http-status-codes'

export class StyrerommetGraphqlResponseStatusError extends Error {
  constructor(private httpStatus: number, private responseBody: string) {
    super()
  }

  get message(): string {
    return `Invalid status code: ${this.httpStatus} ${HttpStatus.getStatusText(this.httpStatus)}, body: ${this.responseBody}`
  }

  get responseStatus(): number {
    return this.httpStatus
  }
}
