import type { HttpContext } from '@adonisjs/core/http'
import ActivityLog from '#models/activity_log'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class ActivityLogsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 20)
    const userId = request.input('userId')
    const action = request.input('action')
    const entity = request.input('entity')
    const entityId = request.input('entityId')
    const search = request.input('search')
    const dateFrom = request.input('dateFrom')
    const dateTo = request.input('dateTo')

    const query = ActivityLog.query().preload('user').orderBy('created_at', 'desc')

    if (userId && userId !== 'all') {
      query.where('user_id', userId)
    }

    if (action && action !== 'all') {
      query.where('action', action)
    }

    if (entity && entity !== 'all') {
      query.where('entity', entity)
    }

    if (entityId) {
      query.where('entity_id', entityId)
    }

    if (search) {
      query.where((q) => {
        q.whereILike('entity', `%${search}%`)
          .orWhereILike('action', `%${search}%`)
          .orWhereILike('entity_id', `%${search}%`)
          .orWhereILike('ip_address', `%${search}%`)
      })
    }

    if (dateFrom) {
      query.where('created_at', '>=', DateTime.fromISO(dateFrom).startOf('day').toSQL()!)
    }

    if (dateTo) {
      query.where('created_at', '<=', DateTime.fromISO(dateTo).endOf('day').toSQL()!)
    }

    const logs = await query.paginate(page, perPage)

    return response.ok({
      success: true,
      data: logs.all(),
      meta: {
        total: logs.total,
        page: logs.currentPage,
        perPage: logs.perPage,
        lastPage: logs.lastPage,
      },
    })
  }

  async stats({ response }: HttpContext) {
    const [totalCount] = await db.from('activity_logs').count('* as count')

    const todayStart = DateTime.now().startOf('day').toSQL()!
    const [todayCount] = await db
      .from('activity_logs')
      .where('created_at', '>=', todayStart)
      .count('* as count')

    const actionCounts = await db
      .from('activity_logs')
      .select('action')
      .count('* as count')
      .groupBy('action')

    const entityCounts = await db
      .from('activity_logs')
      .select('entity')
      .count('* as count')
      .groupBy('entity')
      .orderBy('count', 'desc')
      .limit(5)

    return response.ok({
      success: true,
      data: {
        total: Number(totalCount?.count || 0),
        today: Number(todayCount?.count || 0),
        byAction: actionCounts.reduce(
          (acc, curr) => {
            acc[curr.action] = Number(curr.count)
            return acc
          },
          {} as Record<string, number>
        ),
        topEntities: entityCounts.map((e) => ({
          entity: e.entity,
          count: Number(e.count),
        })),
      },
    })
  }

  async exportLogs({ request, response }: HttpContext) {
    const action = request.input('action')
    const entity = request.input('entity')
    const search = request.input('search')
    const dateFrom = request.input('dateFrom')
    const dateTo = request.input('dateTo')

    const query = ActivityLog.query().preload('user').orderBy('created_at', 'desc').limit(1000)

    if (action && action !== 'all') {
      query.where('action', action)
    }

    if (entity && entity !== 'all') {
      query.where('entity', entity)
    }

    if (search) {
      query.where((q) => {
        q.whereILike('entity', `%${search}%`)
          .orWhereILike('action', `%${search}%`)
          .orWhereILike('entity_id', `%${search}%`)
      })
    }

    if (dateFrom) {
      query.where('created_at', '>=', DateTime.fromISO(dateFrom).startOf('day').toSQL()!)
    }

    if (dateTo) {
      query.where('created_at', '<=', DateTime.fromISO(dateTo).endOf('day').toSQL()!)
    }

    const logs = await query

    return response.ok({
      success: true,
      data: logs,
    })
  }
}
