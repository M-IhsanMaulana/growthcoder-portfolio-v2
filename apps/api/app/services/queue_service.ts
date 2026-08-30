import { Queue, type ConnectionOptions } from 'bullmq'
import redisConfig from '#config/redis'
import { QUEUE_NAMES, defaultJobOptions } from '#config/queue'
import type {
  TelegramLeadNotificationPayload,
  ActivityLogJobPayload,
  QueueHealthStatus,
} from '@growthcoder/types'
import { Redis } from 'ioredis'

let redisClient: Redis | null = null

export function getRedisConnection(): Redis {
  if (!redisClient) {
    redisClient = new Redis(redisConfig)
    redisClient.on('error', (err: Error) => {
      console.warn('[QueueService] Redis connection warning:', err.message)
    })
  }
  return redisClient
}

// Queue Singletons
let telegramQueue: Queue<TelegramLeadNotificationPayload> | null = null
let scheduledArticlesQueue: Queue<Record<string, unknown>> | null = null
let activityLogsQueue: Queue<ActivityLogJobPayload> | null = null

function getTelegramQueue(): Queue<TelegramLeadNotificationPayload> {
  if (!telegramQueue) {
    telegramQueue = new Queue<TelegramLeadNotificationPayload>(QUEUE_NAMES.TELEGRAM_NOTIFICATIONS, {
      connection: redisConfig as ConnectionOptions,
      defaultJobOptions,
    })
  }
  return telegramQueue
}

function getScheduledArticlesQueue(): Queue<Record<string, unknown>> {
  if (!scheduledArticlesQueue) {
    scheduledArticlesQueue = new Queue(QUEUE_NAMES.SCHEDULED_ARTICLES, {
      connection: redisConfig as ConnectionOptions,
      defaultJobOptions,
    })
  }
  return scheduledArticlesQueue
}

function getActivityLogsQueue(): Queue<ActivityLogJobPayload> {
  if (!activityLogsQueue) {
    activityLogsQueue = new Queue<ActivityLogJobPayload>(QUEUE_NAMES.ACTIVITY_LOGS, {
      connection: redisConfig as ConnectionOptions,
      defaultJobOptions,
    })
  }
  return activityLogsQueue
}

export class QueueService {
  /**
   * Dispatch a contact lead alert to Telegram queue
   */
  static async dispatchTelegramNotification(payload: TelegramLeadNotificationPayload) {
    try {
      const queue = getTelegramQueue()
      const job = await queue.add('send_telegram_lead_alert', payload, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      })
      return { success: true, jobId: job.id }
    } catch (err: any) {
      console.error('[QueueService] Failed to dispatch Telegram notification to queue:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Dispatch an activity log to background queue
   */
  static async dispatchActivityLog(payload: ActivityLogJobPayload) {
    try {
      const queue = getActivityLogsQueue()
      const job = await queue.add('record_activity_log', payload, {
        attempts: 2,
        removeOnComplete: true,
      })
      return { success: true, jobId: job.id }
    } catch (err: any) {
      console.warn('[QueueService] Failed to dispatch Activity Log to queue:', err.message)
      return { success: false, error: err.message }
    }
  }

  /**
   * Dispatch manual check for scheduled articles
   */
  static async triggerScheduledArticlesCheck() {
    try {
      const queue = getScheduledArticlesQueue()
      const job = await queue.add('publish_scheduled_articles_manual', {
        triggeredAt: new Date().toISOString(),
      })
      return { success: true, jobId: job.id }
    } catch (err: any) {
      console.error('[QueueService] Failed to trigger scheduled articles job:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Register repeatable job (cron) using BullMQ v5 Job Scheduler to run every minute
   */
  static async registerRepeatableJobs() {
    try {
      const queue = getScheduledArticlesQueue()

      await queue.upsertJobScheduler(
        'publish_scheduled_articles_cron',
        {
          pattern: '* * * * *', // every minute
        },
        {
          name: 'publish_scheduled_articles_cron',
          data: { type: 'scheduled_cron' },
          opts: {
            removeOnComplete: true,
          },
        }
      )

      console.log(
        '[QueueService] Repeatable job registered: publish_scheduled_articles_cron (every 1 min)'
      )
    } catch (err: any) {
      console.warn('[QueueService] Failed to register repeatable scheduler job:', err.message)
    }
  }

  /**
   * Get queue health & metrics
   */
  static async getHealth(): Promise<QueueHealthStatus> {
    let redisConnected = false

    try {
      const redis = getRedisConnection()
      const ping = await redis.ping()
      redisConnected = ping === 'PONG'
    } catch {
      redisConnected = false
    }

    const tQueue = getTelegramQueue()
    const sQueue = getScheduledArticlesQueue()
    const aQueue = getActivityLogsQueue()

    const [tCounts, sCounts, aCounts] = await Promise.all([
      tQueue.getJobCounts('waiting', 'active', 'completed', 'failed'),
      sQueue.getJobCounts('waiting', 'active', 'completed', 'failed'),
      aQueue.getJobCounts('waiting', 'active', 'completed', 'failed'),
    ])

    return {
      redisConnected,
      queues: {
        telegram: {
          waiting: tCounts.waiting || 0,
          active: tCounts.active || 0,
          completed: tCounts.completed || 0,
          failed: tCounts.failed || 0,
        },
        scheduledArticles: {
          waiting: sCounts.waiting || 0,
          active: sCounts.active || 0,
          completed: sCounts.completed || 0,
          failed: sCounts.failed || 0,
        },
        activityLogs: {
          waiting: aCounts.waiting || 0,
          active: aCounts.active || 0,
          completed: aCounts.completed || 0,
          failed: aCounts.failed || 0,
        },
      },
    }
  }

  /**
   * Graceful close
   */
  static async closeAll() {
    if (telegramQueue) await telegramQueue.close()
    if (scheduledArticlesQueue) await scheduledArticlesQueue.close()
    if (activityLogsQueue) await activityLogsQueue.close()
    if (redisClient) await redisClient.quit()
  }
}
