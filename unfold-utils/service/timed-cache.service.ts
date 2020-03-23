import { Injectable } from '@nestjs/common'
import { UnfoldLoggerService } from '../../unfold-logger/service/unfold-logger.service'

interface CacheItem<T> {
  expireTimestampMs: number
  absoluteTimestampMs: number
  isExpired: boolean
  value: T
}

@Injectable()
export class TimedCacheService {
  private cache: { [name: string]: CacheItem<any> } = {}

  constructor(private logger: UnfoldLoggerService) {}

  async resolve<T>(name: string, valueResolver: () => Promise<T>, cacheTimeMs: number, absoluteTimeMs: number): Promise<T> {
    const cachedItem = await this.getCacheItem<T>(name)
    if (!cachedItem || cachedItem.isExpired) {
      try {
        const value = await valueResolver()
        this.cache[name] = {
          expireTimestampMs: Date.now() + cacheTimeMs,
          absoluteTimestampMs: Date.now() + absoluteTimeMs,
          isExpired: false,
          value,
        }

        return value
      } catch (error) {
        if (this.cache[name]) {
          this.logger.warn(`Unable to refresh data, using stale value. Error is ${error.message}`)
          return this.cache[name].value
        }
        throw error
      }
    }

    return cachedItem.value
  }

  private async getCacheItem<T>(name: string): Promise<CacheItem<T> | null> {
    if (this.cache[name] && this.cache[name].expireTimestampMs <= Date.now()) {
      this.cache[name].isExpired = true
    }
    if (this.cache[name] && this.cache[name].absoluteTimestampMs <= Date.now()) {
      this.logger.debug(`Cache for "${name}" time out absolutelty, removing from cache.`)
      delete this.cache[name]
    }

    return this.cache[name] || null
  }
}
