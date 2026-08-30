import { type Job } from 'bullmq'
import { TelegramService } from '#services/telegram_service'
import type { TelegramLeadNotificationPayload } from '@growthcoder/types'

export async function processSendTelegramNotificationJob(
  job: Job<TelegramLeadNotificationPayload>
) {
  const payload = job.data

  console.log(`[SendTelegramNotificationJob] Processing job ${job.id} for lead: ${payload.email}`)

  const result = await TelegramService.sendLeadNotification(payload)

  if (!result.success) {
    console.error(`[SendTelegramNotificationJob] Failed to send telegram alert:`, result.error)
    // If it was a credential missing / disabled issue, we don't necessarily want to infinitely crash the job
    if (result.error?.includes('not configured') || result.error?.includes('disabled')) {
      return { success: false, reason: result.error }
    }
    throw new Error(result.error || 'Failed to send Telegram message')
  }

  console.log(
    `[SendTelegramNotificationJob] Successfully sent messageId ${result.messageId} for lead ${payload.email}`
  )
  return { success: true, messageId: result.messageId }
}
