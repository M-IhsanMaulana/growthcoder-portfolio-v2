import type { HttpContext } from '@adonisjs/core/http'
import ContactInbox from '#models/contact_inbox'
import ActivityLog from '#models/activity_log'
import SiteSetting from '#models/site_setting'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DashboardController {
  async index({ response }: HttpContext) {
    // 1. Basic Counter Metrics
    const [totalProjects] = await db.from('projects').count('* as count')
    const [totalArticles] = await db.from('posts').count('* as count')
    const [totalInboxes] = await db.from('contact_inboxes').count('* as count')
    const [unreadInboxes] = await db
      .from('contact_inboxes')
      .where('status', 'unread')
      .count('* as count')
    const [totalViewsResult] = await db.from('posts').sum('view_count as sum')

    // 2. Inbox Distribution by status
    const inboxStatusCounts = await db
      .from('contact_inboxes')
      .select('status')
      .count('* as count')
      .groupBy('status')

    const inboxDistribution = {
      unread: 0,
      read: 0,
      replied: 0,
      archived: 0,
    }
    for (const item of inboxStatusCounts) {
      if (item.status in inboxDistribution) {
        inboxDistribution[item.status as keyof typeof inboxDistribution] = Number(item.count)
      }
    }

    // 3. Category Distribution (Project categories)
    const categoryCounts = await db
      .from('project_categories')
      .leftJoin('projects', 'project_categories.id', 'projects.category_id')
      .select('project_categories.name')
      .count('projects.id as count')
      .groupBy('project_categories.id', 'project_categories.name')
      .orderBy('count', 'desc')

    const totalCategoryProjects = categoryCounts.reduce((acc, curr) => acc + Number(curr.count), 0)
    const categoryPalette = ['#2bb673', '#2d2a6f', '#38bdf8', '#a855f7', '#f59e0b', '#ec4899']

    const categoryDistribution = categoryCounts.map((cat, idx) => {
      const count = Number(cat.count)
      const percentage =
        totalCategoryProjects > 0 ? Math.round((count / totalCategoryProjects) * 100) : 0
      return {
        name: String(cat.name),
        count,
        percentage,
        color: categoryPalette[idx % categoryPalette.length],
      }
    })

    // 4. Traffic & Views Time-series (Last 6 Months)
    const now = DateTime.now()
    const trafficSeries = []

    for (let i = 5; i >= 0; i--) {
      const targetMonth = now.minus({ months: i })
      const monthStart = targetMonth.startOf('month').toSQL()
      const monthEnd = targetMonth.endOf('month').toSQL()
      const periodLabel = targetMonth.toFormat('LLL yyyy')

      const [postCountResult] = await db
        .from('posts')
        .whereBetween('created_at', [monthStart!, monthEnd!])
        .count('* as count')

      const [viewsResult] = await db
        .from('posts')
        .whereBetween('created_at', [monthStart!, monthEnd!])
        .sum('view_count as sum')

      trafficSeries.push({
        period: periodLabel,
        articles: Number(postCountResult?.count || 0),
        views: Number(viewsResult?.sum || 0),
      })
    }

    // 5. Recent Activities with preloaded user
    const recentActivities = await ActivityLog.query()
      .preload('user')
      .orderBy('created_at', 'desc')
      .limit(10)

    // 6. Recent Unread / Latest Inboxes
    const recentInboxes = await ContactInbox.query().orderBy('created_at', 'desc').limit(5)

    // 7. Maintenance Mode Status
    const maintenanceSetting = await SiteSetting.findBy('key', 'maintenance')
    let isMaintenanceActive = false
    if (maintenanceSetting?.value) {
      if (typeof maintenanceSetting.value === 'object' && maintenanceSetting.value !== null) {
        isMaintenanceActive = Boolean((maintenanceSetting.value as { isActive?: boolean }).isActive)
      } else if (typeof maintenanceSetting.value === 'boolean') {
        isMaintenanceActive = maintenanceSetting.value
      }
    }

    return response.ok({
      success: true,
      data: {
        totalProjects: Number(totalProjects?.count || 0),
        totalArticles: Number(totalArticles?.count || 0),
        totalInboxes: Number(totalInboxes?.count || 0),
        unreadInboxes: Number(unreadInboxes?.count || 0),
        totalArticleViews: Number(totalViewsResult?.sum || 0),
        trafficSeries,
        categoryDistribution,
        inboxDistribution,
        recentActivities,
        recentInboxes,
        isMaintenanceActive,
      },
    })
  }
}
