import emitter from '@adonisjs/core/services/emitter'
import RecordActivityEvent from '#events/record_activity'
import type { ActivityAction } from '@growthcoder/types'
import type { HttpContext } from '@adonisjs/core/http'

export class ActivityLogService {
  static log(
    ctx: HttpContext,
    action: ActivityAction,
    entity: string,
    entityId?: string | null,
    payload?: Record<string, unknown> | null
  ) {
    const user = ctx.auth?.user
    const ipAddress = ctx.request.ip()
    const userAgent = ctx.request.header('user-agent') || null

    emitter.emit(
      RecordActivityEvent,
      new RecordActivityEvent({
        userId: user?.id || null,
        action,
        entity,
        entityId: entityId || null,
        payload: payload || null,
        ipAddress,
        userAgent,
      })
    )
  }
}
