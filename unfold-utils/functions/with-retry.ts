import { LoggerService } from '@nestjs/common'
import { delay } from './delay'

interface WithRetryOptions {
  maxRetries?: number
  logger?: LoggerService
}

// @ts-ignore
export const withRetry = async <T>(fn: () => Promise<T>, options: WithRetryOptions): Promise<T> => {
  const maxRetries = options.maxRetries || 3
  const logger = options.logger || {
    log: () => {
      /* nothing */
    },
  }

  let retryNumber = 1
  while (retryNumber <= maxRetries) {
    try {
      const result = await fn()
      return result
    } catch (error) {
      const delayTime = 300 * retryNumber
      logger.log(`[RetryService.withRetry] Attempt ${retryNumber}/${maxRetries} failed - ${error} - (waiting ${delayTime}ms before next retry)`)
      if (retryNumber === maxRetries) {
        throw error
      }
      await delay(delayTime)
      retryNumber++
    }
  }
}
