import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { Worker, type ConnectionOptions } from 'bullmq'
import redisConfig from '#config/redis'
import { QUEUE_NAMES } from '#config/queue'
import { processSendTelegramNotificationJob } from '#tasks/send_telegram_notification_job'
import { processPublishScheduledArticlesJob } from '#tasks/publish_scheduled_articles_job'
import { processLogActivityJob } from '#tasks/log_activity_job'
import { QueueService } from '#services/queue_service'

export default class QueueWork extends BaseCommand {
  static commandName = 'queue:work'
  static description = 'Start the BullMQ background queue workers and scheduler'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🚀 Initializing BullMQ Workers...')

    const connection = redisConfig as ConnectionOptions

    // 1. Register repeatable jobs (e.g. scheduled articles cron)
    await QueueService.registerRepeatableJobs()

    // 2. Telegram Worker
    const telegramWorker = new Worker(
      QUEUE_NAMES.TELEGRAM_NOTIFICATIONS,
      async (job) => {
        return processSendTelegramNotificationJob(job)
      },
      {
        connection,
        concurrency: 5,
      }
    )

    telegramWorker.on('completed', (job) => {
      this.logger.success(`[TelegramWorker] Job ${job.id} completed successfully.`)
    })

    telegramWorker.on('failed', (job, err) => {
      this.logger.error(`[TelegramWorker] Job ${job?.id} failed: ${err.message}`)
    })

    // 3. Scheduled Articles Worker
    const scheduledArticlesWorker = new Worker(
      QUEUE_NAMES.SCHEDULED_ARTICLES,
      async () => {
        return processPublishScheduledArticlesJob()
      },
      {
        connection,
        concurrency: 1,
      }
    )

    scheduledArticlesWorker.on('completed', (_job, result) => {
      if (result && result.processedCount > 0) {
        this.logger.success(
          `[ScheduledArticlesWorker] Auto-published ${result.processedCount} article(s) at ${result.timestamp}.`
        )
      }
    })

    scheduledArticlesWorker.on('failed', (job, err) => {
      this.logger.error(`[ScheduledArticlesWorker] Job ${job?.id} failed: ${err.message}`)
    })

    // 4. Activity Logs Worker
    const activityLogsWorker = new Worker(
      QUEUE_NAMES.ACTIVITY_LOGS,
      async (job) => {
        return processLogActivityJob(job)
      },
      {
        connection,
        concurrency: 10,
      }
    )

    activityLogsWorker.on('failed', (job, err) => {
      this.logger.error(`[ActivityLogsWorker] Job ${job?.id} failed: ${err.message}`)
    })

    this.logger.success('✅ All BullMQ Workers are active and listening for jobs!')

    // Graceful shutdown handling
    const shutdown = async () => {
      this.logger.info('🛑 Shutting down workers gracefully...')
      await Promise.all([
        telegramWorker.close(),
        scheduledArticlesWorker.close(),
        activityLogsWorker.close(),
        QueueService.closeAll(),
      ])
      this.logger.info('Workers stopped.')
      process.exit(0)
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)

    // Keep command alive
    await new Promise(() => {})
  }
}
