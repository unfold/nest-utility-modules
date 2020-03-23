import { Module } from '@nestjs/common'
import { TimedCacheService } from './service/timed-cache.service'
import { FetchService } from './service/fetch.service'

@Module({
  providers: [FetchService, TimedCacheService],
  exports: [FetchService, TimedCacheService],
})
export class UnfoldUtilsModule {}
