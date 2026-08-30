import type RecordActivityEvent from '#events/record_activity'
import ActivityLog from '#models/activity_log'
import { QueueService } from '#services/queue_service'

export default class LogActivityListener {
  async handle(event: RecordActivityEvent) {
    try {
      const result = await QueueService.dispatchActivityLog({
        userId: event.data.userId || null,
        action: event.data.action,
        entity: event.data.entity,
        entityId: event.data.entityId || null,
        payload: event.data.payload || null,
        ipAddress: event.data.ipAddress || null,
        userAgent: event.data.userAgent || null,
      })

      // If queue is not running or failed to dispatch, fallback to direct insertion
      if (!result.success) {
        await ActivityLog.create({
          userId: event.data.userId || null,
          action: event.data.action,
          entity: event.data.entity,
          entityId: event.data.entityId || null,
          payload: event.data.payload || null,
          ipAddress: event.data.ipAddress || null,
          userAgent: event.data.userAgent || null,
        })
      }
    } catch (error) {
      console.error('[ActivityLogListener] Failed to log activity:', error)
    }
  }
}
