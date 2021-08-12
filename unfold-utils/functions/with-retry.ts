import { LoggerService } from '@nestjs/common'
import { delay } from './delay'

type DelayTimeProvider = (retryNumber: number) => Promise<number>

interface WithRetryOptions {
  maxRetries?: number
  logger?: LoggerService
  info?: string
  delayTimeProvider?: DelayTimeProvider
}

// @ts-ignore
export const withRetry = async <T>(fn: () => Promise<T>, options?: WithRetryOptions): Promise<T> => {
  let retryNumber = 0

  const maxRetries = options?.maxRetries || 3
  const info = options?.info ? `[${options.info}]` : ''
  const logger = options?.logger || {
    log: () => {
      /* nothing */
    },
  }

  while (retryNumber <= maxRetries) {
    retryNumber++

    try {
      const result = await fn()
      return result
    } catch (error) {
      const nextDelayTime = options?.delayTimeProvider ? await options.delayTimeProvider(retryNumber) : 300 * retryNumber
      logger.log(`[withRetry] ${info} Attempt ${retryNumber}/${maxRetries} failed - ${error} - (waiting ${nextDelayTime}ms before next retry)`)
      if (retryNumber === maxRetries) {
        throw error
      }
      await delay(nextDelayTime)
    }
  }
}
