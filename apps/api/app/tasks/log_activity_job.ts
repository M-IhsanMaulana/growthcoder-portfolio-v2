import { type Job } from 'bullmq'
import ActivityLog from '#models/activity_log'
import type { ActivityLogJobPayload } from '@growthcoder/types'

export async function processLogActivityJob(job: Job<ActivityLogJobPayload>) {
  const data = job.data

  try {
    const log = await ActivityLog.create({
      userId: data.userId || null,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId || null,
      payload: data.payload || null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
    })

    return { success: true, logId: log.id }
  } catch (error: any) {
    console.error('[LogActivityJob] Failed to persist activity log:', error)
    throw error
  }
}
