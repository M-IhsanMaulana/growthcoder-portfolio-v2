import type { DefaultJobOptions } from 'bullmq'

export const QUEUE_NAMES = {
  TELEGRAM_NOTIFICATIONS: 'telegram-notifications',
  SCHEDULED_ARTICLES: 'scheduled-articles',
  ACTIVITY_LOGS: 'activity-logs',
} as const

export const defaultJobOptions: DefaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
  removeOnComplete: {
    count: 200,
    age: 24 * 3600, // 24 hours
  },
  removeOnFail: {
    count: 500,
    age: 7 * 24 * 3600, // 7 days
  },
}
