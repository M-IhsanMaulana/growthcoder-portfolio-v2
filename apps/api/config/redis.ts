import env from '#start/env'
import type { RedisOptions } from 'ioredis'

const redisConfig: RedisOptions = {
  host: env.get('REDIS_HOST', '127.0.0.1'),
  port: env.get('REDIS_PORT', 6379),
  password: env.get('REDIS_PASSWORD') || undefined,
  db: env.get('REDIS_DB', 0),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy(times) {
    // Exponential backoff with max 3s delay
    const delay = Math.min(times * 100, 3000)
    return delay
  },
}

export default redisConfig
