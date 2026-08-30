import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import ProjectGallery from '#models/project_gallery'
import { createProjectValidator, updateProjectValidator } from '#validators/project_validator'
import { ActivityLogService } from '#services/activity_log_service'
import stringHelpers from '@adonisjs/core/helpers/string'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class ProjectsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search')
    const categoryId = request.input('categoryId')

    const query = Project.query()
      .preload('category')
      .preload('techStacks')
      .preload('galleries')
      .orderBy('order', 'asc')
      .orderBy('created_at', 'desc')

    if (search) {
      query.where((q) => {
        q.whereILike('title', `%${search}%`)
          .orWhereILike('excerpt', `%${search}%`)
          .orWhereILike('client_name', `%${search}%`)
      })
    }

    if (categoryId) {
      query.where('category_id', categoryId)
    }

    const projects = await query.paginate(page, perPage)

    return response.ok({
      success: true,
      data: projects.all(),
      meta: {
        total: projects.total,
        page: projects.currentPage,
        perPage: projects.perPage,
        lastPage: projects.lastPage,
      },
    })
  }

  async show({ params, response }: HttpContext) {
    const project = await Project.query()
      .where('id', params.id)
      .preload('category')
      .preload('techStacks')
      .preload('galleries', (g) => g.orderBy('sort_order', 'asc'))
      .firstOrFail()

    return response.ok({
      success: true,
      data: project,
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(createProjectValidator)

    const slug = payload.slug || stringHelpers.slug(payload.title, { lower: true })

    const project = await Project.create({
      title: payload.title,
      slug,
      excerpt: payload.excerpt,
      content: payload.content,
      clientName: payload.clientName || null,
      role: payload.role || null,
      projectYear: payload.projectYear || new Date().getFullYear(),
      coverImage: payload.coverImage,
      demoUrl: payload.demoUrl || null,
      repositoryUrl: payload.repositoryUrl || null,
      isFeatured: payload.isFeatured ?? false,
      order: payload.order ?? 0,
      categoryId: payload.categoryId || null,
    })

    if (payload.techStackIds && payload.techStackIds.length > 0) {
      await project.related('techStacks').attach(payload.techStackIds)
    }

    if (payload.galleries && payload.galleries.length > 0) {
      await ProjectGallery.createMany(
        payload.galleries.map((g, index) => ({
          projectId: project.id,
          imageUrl: g.imageUrl,
          caption: g.caption || null,
          sortOrder: g.sortOrder ?? index,
        }))
      )
    }

    await project.load('category')
    await project.load('techStacks')
    await project.load('galleries')

    ActivityLogService.log(ctx, 'create', 'project', project.id, { title: project.title })

    return response.created({
      success: true,
      message: 'Project created successfully',
      data: project,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const project = await Project.findOrFail(params.id)
    const payload = await request.validateUsing(updateProjectValidator)

    if (payload.title && !payload.slug) {
      project.slug = stringHelpers.slug(payload.title, { lower: true })
    } else if (payload.slug) {
      project.slug = payload.slug
    }

    project.merge({
      ...(payload.title && { title: payload.title }),
      ...(payload.excerpt && { excerpt: payload.excerpt }),
      ...(payload.content && { content: payload.content }),
      ...(payload.clientName !== undefined && { clientName: payload.clientName }),
      ...(payload.role !== undefined && { role: payload.role }),
      ...(payload.projectYear !== undefined && { projectYear: payload.projectYear }),
      ...(payload.coverImage && { coverImage: payload.coverImage }),
      ...(payload.demoUrl !== undefined && { demoUrl: payload.demoUrl }),
      ...(payload.repositoryUrl !== undefined && { repositoryUrl: payload.repositoryUrl }),
      ...(payload.isFeatured !== undefined && { isFeatured: payload.isFeatured }),
      ...(payload.order !== undefined && { order: payload.order }),
      ...(payload.categoryId !== undefined && { categoryId: payload.categoryId }),
    })

    await project.save()

    if (payload.techStackIds) {
      await project.related('techStacks').sync(payload.techStackIds)
    }

    if (payload.galleries) {
      await ProjectGallery.query().where('project_id', project.id).delete()
      await ProjectGallery.createMany(
        payload.galleries.map((g, index) => ({
          projectId: project.id,
          imageUrl: g.imageUrl,
          caption: g.caption || null,
          sortOrder: g.sortOrder ?? index,
        }))
      )
    }

    await project.load('category')
    await project.load('techStacks')
    await project.load('galleries')

    ActivityLogService.log(ctx, 'update', 'project', project.id, { title: project.title })

    return response.ok({
      success: true,
      message: 'Project updated successfully',
      data: project,
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const project = await Project.findOrFail(params.id)
    const title = project.title
    const id = project.id

    await project.delete()

    ActivityLogService.log(ctx, 'delete', 'project', id, { title })

    return response.ok({
      success: true,
      message: 'Project deleted successfully',
    })
  }

  async reorder({ request, response }: HttpContext) {
    const items: Array<{ id: string; order: number }> = request.input('items', [])

    for (const item of items) {
      await Project.query().where('id', item.id).update({ order: item.order })
    }

    return response.ok({
      success: true,
      message: 'Projects reordered successfully',
    })
  }

  async analytics({ params, request, response }: HttpContext) {
    const project = await Project.query()
      .where('id', params.id)
      .preload('category')
      .preload('techStacks')
      .firstOrFail()

    const period = request.input('period', '30d')
    const customFrom = request.input('from')
    const customTo = request.input('to')

    let startDate = DateTime.now().minus({ days: 30 }).startOf('day')
    let endDate = DateTime.now().endOf('day')

    if (period === '7d') {
      startDate = DateTime.now().minus({ days: 7 }).startOf('day')
    } else if (period === '30d') {
      startDate = DateTime.now().minus({ days: 30 }).startOf('day')
    } else if (period === '90d') {
      startDate = DateTime.now().minus({ days: 90 }).startOf('day')
    } else if (period === 'year') {
      startDate = DateTime.now().minus({ days: 365 }).startOf('day')
    } else if (period === 'custom' && customFrom) {
      const parsedFrom = DateTime.fromISO(customFrom)
      if (parsedFrom.isValid) {
        startDate = parsedFrom.startOf('day')
      }
      if (customTo) {
        const parsedTo = DateTime.fromISO(customTo)
        if (parsedTo.isValid) {
          endDate = parsedTo.endOf('day')
        }
      }
    }

    const startSql = startDate.toSQL()!
    const endSql = endDate.toSQL()!

    // 1. Total views, unique visitors, demo clicks, repo clicks in period
    const [statsResult] = await db
      .from('project_views')
      .where('project_id', project.id)
      .where('created_at', '>=', startSql)
      .where('created_at', '<=', endSql)
      .select(
        db.raw("count(case when event_type = 'view' then 1 end) as total_views"),
        db.raw(
          "count(distinct case when event_type = 'view' then visitor_hash end) as unique_visitors"
        ),
        db.raw("count(case when event_type = 'demo_click' then 1 end) as demo_clicks"),
        db.raw("count(case when event_type = 'repo_click' then 1 end) as repo_clicks")
      )

    const totalViews = Number(statsResult?.total_views || 0)
    const uniqueVisitors = Number(statsResult?.unique_visitors || 0)
    const demoClicks = Number(statsResult?.demo_clicks || 0)
    const repoClicks = Number(statsResult?.repo_clicks || 0)
    const totalClicks = demoClicks + repoClicks
    const conversionRate =
      totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0

    // 2. Previous Period Growth calculation
    const durationDays = Math.max(1, Math.round(endDate.diff(startDate, 'days').days))
    const prevStartDate = startDate.minus({ days: durationDays }).toSQL()!
    const [prevStats] = await db
      .from('project_views')
      .where('project_id', project.id)
      .where('event_type', 'view')
      .where('created_at', '>=', prevStartDate)
      .where('created_at', '<', startSql)
      .select(db.raw('count(*) as total_views'))

    const prevViews = Number(prevStats?.total_views || 0)
    let periodGrowth = 0
    if (prevViews > 0) {
      periodGrowth = Math.round(((totalViews - prevViews) / prevViews) * 100)
    } else if (totalViews > 0) {
      periodGrowth = 100
    }

    // 3. Time Series Data (Daily Breakdown)
    const dailyEventsQuery = await db
      .from('project_views')
      .where('project_id', project.id)
      .where('created_at', '>=', startSql)
      .where('created_at', '<=', endSql)
      .select(
        db.raw('DATE(created_at) as event_date'),
        db.raw("count(case when event_type = 'view' then 1 end) as views"),
        db.raw("count(case when event_type = 'demo_click' then 1 end) as demo_clicks"),
        db.raw("count(case when event_type = 'repo_click' then 1 end) as repo_clicks")
      )
      .groupByRaw('DATE(created_at)')
      .orderByRaw('event_date ASC')

    const dailyMap = new Map<
      string,
      { views: number; demoClicks: number; repoClicks: number; totalClicks: number }
    >()
    dailyEventsQuery.forEach((row: any) => {
      const dateStr =
        typeof row.event_date === 'string'
          ? row.event_date.split('T')[0]
          : DateTime.fromJSDate(new Date(row.event_date)).toFormat('yyyy-MM-dd')
      const v = Number(row.views || 0)
      const d = Number(row.demo_clicks || 0)
      const r = Number(row.repo_clicks || 0)
      dailyMap.set(dateStr, {
        views: v,
        demoClicks: d,
        repoClicks: r,
        totalClicks: d + r,
      })
    })

    // Fill all days in date range
    const timeSeries: Array<{
      date: string
      formattedDate: string
      views: number
      demoClicks: number
      repoClicks: number
      totalClicks: number
    }> = []

    let curr = startDate
    while (curr <= endDate) {
      const dateKey = curr.toFormat('yyyy-MM-dd')
      const formatted = curr.toFormat('dd LLL')
      const existing = dailyMap.get(dateKey) || {
        views: 0,
        demoClicks: 0,
        repoClicks: 0,
        totalClicks: 0,
      }
      timeSeries.push({
        date: dateKey,
        formattedDate: formatted,
        views: existing.views,
        demoClicks: existing.demoClicks,
        repoClicks: existing.repoClicks,
        totalClicks: existing.totalClicks,
      })
      curr = curr.plus({ days: 1 })
    }

    // 4. Referrer Sources breakdown (All events in period)
    const totalEventsInPeriod = totalViews + totalClicks
    const sourcesQuery = await db
      .from('project_views')
      .where('project_id', project.id)
      .where('created_at', '>=', startSql)
      .where('created_at', '<=', endSql)
      .select('referrer_source as name')
      .count('* as count')
      .groupBy('referrer_source')
      .orderBy('count', 'desc')

    const sources = sourcesQuery.map((r: any) => ({
      name: r.name || 'Direct',
      count: Number(r.count || 0),
      percentage:
        totalEventsInPeriod > 0
          ? Math.round((Number(r.count || 0) / totalEventsInPeriod) * 100)
          : 0,
    }))

    // 5. Device Type Breakdown
    const devicesQuery = await db
      .from('project_views')
      .where('project_id', project.id)
      .where('created_at', '>=', startSql)
      .where('created_at', '<=', endSql)
      .select('device_type as name')
      .count('* as count')
      .groupBy('device_type')
      .orderBy('count', 'desc')

    const devices = devicesQuery.map((r: any) => ({
      name: r.name ? r.name.charAt(0).toUpperCase() + r.name.slice(1) : 'Desktop',
      count: Number(r.count || 0),
      percentage:
        totalEventsInPeriod > 0
          ? Math.round((Number(r.count || 0) / totalEventsInPeriod) * 100)
          : 0,
    }))

    // 6. Browser Breakdown
    const browsersQuery = await db
      .from('project_views')
      .where('project_id', project.id)
      .where('created_at', '>=', startSql)
      .where('created_at', '<=', endSql)
      .select('browser as name')
      .count('* as count')
      .groupBy('browser')
      .orderBy('count', 'desc')

    const browsers = browsersQuery.map((r: any) => ({
      name: r.name || 'Other',
      count: Number(r.count || 0),
      percentage:
        totalEventsInPeriod > 0
          ? Math.round((Number(r.count || 0) / totalEventsInPeriod) * 100)
          : 0,
    }))

    // 7. Operating Systems Breakdown
    const osQuery = await db
      .from('project_views')
      .where('project_id', project.id)
      .where('created_at', '>=', startSql)
      .where('created_at', '<=', endSql)
      .select('os as name')
      .count('* as count')
      .groupBy('os')
      .orderBy('count', 'desc')

    const operatingSystems = osQuery.map((r: any) => ({
      name: r.name || 'Other',
      count: Number(r.count || 0),
      percentage:
        totalEventsInPeriod > 0
          ? Math.round((Number(r.count || 0) / totalEventsInPeriod) * 100)
          : 0,
    }))

    return response.ok({
      success: true,
      data: {
        period,
        dateFrom: startDate.toISO(),
        dateTo: endDate.toISO(),
        summary: {
          totalViews,
          uniqueVisitors,
          demoClicks,
          repoClicks,
          totalClicks,
          conversionRate,
          periodGrowth,
        },
        timeSeries,
        sources,
        devices,
        browsers,
        operatingSystems,
      },
    })
  }
}
