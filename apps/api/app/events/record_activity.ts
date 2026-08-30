import { BaseEvent } from '@adonisjs/core/events'
import type { ActivityAction } from '@growthcoder/types'

export default class RecordActivityEvent extends BaseEvent {
  constructor(
    public data: {
      userId?: string | null
      action: ActivityAction
      entity: string
      entityId?: string | null
      payload?: Record<string, unknown> | null
      ipAddress?: string | null
      userAgent?: string | null
    }
  ) {
    super()
  }
}
