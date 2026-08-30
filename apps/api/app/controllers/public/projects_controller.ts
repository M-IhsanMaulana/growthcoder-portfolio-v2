import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import ProjectView from '#models/project_view'
import { createHash } from 'node:crypto'
import { DateTime } from 'luxon'

function parseUserAgent(ua: string | null) {
  if (!ua) {
    return {
      deviceType: 'desktop' as const,
      browser: 'Unknown',
      os: 'Unknown',
    }
  }

  // Device
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop'
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'tablet'
  } else if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    )
  ) {
    deviceType = 'mobile'
  }

  // Browser
  let browser = 'Other'
  if (/Edg/i.test(ua)) browser = 'Edge'
  else if (/Chrome/i.test(ua) && !/Chromium|Edg|OPR/i.test(ua)) browser = 'Chrome'
  else if (/Safari/i.test(ua) && !/Chrome|Edg|OPR/i.test(ua)) browser = 'Safari'
  else if (/Firefox/i.test(ua)) browser = 'Firefox'
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera'

  // OS
  let os = 'Other'
  if (/Windows/i.test(ua)) os = 'Windows'
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS'
  else if (/Linux/i.test(ua)) os = 'Linux'

  return { deviceType, browser, os }
}

function parseReferrerSource(referrer: string | null): string {
  if (!referrer || referrer.trim() === '') return 'Direct'
  try {
    const url = new URL(referrer)
    const host = url.hostname.toLowerCase()
    if (host.includes('google')) return 'Google'
    if (host.includes('t.co') || host.includes('twitter') || host.includes('x.com'))
      return 'Twitter / X'
    if (host.includes('linkedin')) return 'LinkedIn'
    if (host.includes('facebook') || host.includes('fb.com')) return 'Facebook'
    if (host.includes('github')) return 'GitHub'
    if (host.includes('instagram')) return 'Instagram'
    if (host.includes('medium')) return 'Medium'
    if (host.includes('reddit')) return 'Reddit'
    if (host.includes('localhost') || host.includes('growthcoder')) return 'Internal'
    return url.hostname
  } catch {
    return 'Other'
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isUuid(val?: string | null): boolean {
  return Boolean(val && UUID_REGEX.test(val))
}

export default class ProjectsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 12)
    const category = request.input('category')
    const techStack = request.input('techStack')
    const search = request.input('search')
    const isFeatured = request.input('isFeatured')

    const query = Project.query()
      .preload('category')
      .preload('techStacks')
      .preload('galleries', (g) => g.orderBy('sort_order', 'asc'))
      .orderBy('order', 'asc')
      .orderBy('created_at', 'desc')

    if (isFeatured !== undefined) {
      query.where('is_featured', isFeatured === 'true' || isFeatured === true)
    }

    if (category) {
      query.whereHas('category', (q) => {
        if (isUuid(category)) {
          q.where('id', category).orWhere('slug', category)
        } else {
          q.where('slug', category)
        }
      })
    }

    if (techStack) {
      query.whereHas('techStacks', (q) => {
        if (isUuid(techStack)) {
          q.where('id', techStack).orWhere('slug', techStack)
        } else {
          q.where('slug', techStack)
        }
      })
    }

    if (search) {
      query.where((q) => {
        q.whereILike('title', `%${search}%`)
          .orWhereILike('excerpt', `%${search}%`)
          .orWhereILike('client_name', `%${search}%`)
      })
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

  async show({ params, request, response }: HttpContext) {
    const isParamUuid = isUuid(params.slug)
    const project = await Project.query()
      .where((q) => {
        if (isParamUuid) {
          q.where('id', params.slug).orWhere('slug', params.slug)
        } else {
          q.where('slug', params.slug)
        }
      })
      .preload('category')
      .preload('techStacks')
      .preload('galleries', (g) => g.orderBy('sort_order', 'asc'))
      .firstOrFail()

    // Smart Server-side View Tracking with Anti-Spam (30 min window)
    try {
      const ip = request.ip() || request.header('x-forwarded-for') || null
      const ua = request.header('user-agent') || null
      const referrer = request.header('referer') || null

      const visitorHash = createHash('sha256')
        .update(`${ip || 'unknown'}-${ua || 'unknown'}`)
        .digest('hex')

      const thirtyMinutesAgo = DateTime.now().minus({ minutes: 30 }).toSQL()!

      const recentView = await ProjectView.query()
        .where('project_id', project.id)
        .where('event_type', 'view')
        .where('visitor_hash', visitorHash)
        .where('created_at', '>=', thirtyMinutesAgo)
        .first()

      if (!recentView) {
        const { deviceType, browser, os } = parseUserAgent(ua)
        const referrerSource = parseReferrerSource(referrer)

        await ProjectView.create({
          projectId: project.id,
          visitorHash,
          eventType: 'view',
          ipAddress: ip ? String(ip).slice(0, 45) : null,
          userAgent: ua,
          deviceType,
          browser,
          os,
          referrer,
          referrerSource,
        })

        // Increment view count
        project.viewCount = Number(project.viewCount || 0) + 1
        await project.save()
      }
    } catch (err) {
      console.error('Failed to log project view:', err)
    }

    return response.ok({
      success: true,
      data: project,
    })
  }

  async trackEvent({ params, request, response }: HttpContext) {
    const isParamUuid = isUuid(params.slug)
    const project = await Project.query()
      .where((q) => {
        if (isParamUuid) {
          q.where('id', params.slug).orWhere('slug', params.slug)
        } else {
          q.where('slug', params.slug)
        }
      })
      .firstOrFail()

    const eventType = request.input('eventType') // 'demo_click' | 'repo_click'
    if (!['demo_click', 'repo_click'].includes(eventType)) {
      return response.badRequest({
        success: false,
        message: 'Invalid eventType. Must be demo_click or repo_click',
      })
    }

    try {
      const ip = request.ip() || request.header('x-forwarded-for') || null
      const ua = request.header('user-agent') || null
      const referrer = request.header('referer') || null

      const visitorHash = createHash('sha256')
        .update(`${ip || 'unknown'}-${ua || 'unknown'}`)
        .digest('hex')

      const { deviceType, browser, os } = parseUserAgent(ua)
      const referrerSource = parseReferrerSource(referrer)

      await ProjectView.create({
        projectId: project.id,
        eventType: eventType as 'demo_click' | 'repo_click',
        visitorHash,
        ipAddress: ip ? String(ip).slice(0, 45) : null,
        userAgent: ua,
        deviceType,
        browser,
        os,
        referrer,
        referrerSource,
      })

      if (eventType === 'demo_click') {
        project.demoClickCount = Number(project.demoClickCount || 0) + 1
      } else if (eventType === 'repo_click') {
        project.repoClickCount = Number(project.repoClickCount || 0) + 1
      }
      await project.save()

      return response.ok({
        success: true,
        message: 'Event recorded successfully',
        data: {
          eventType,
          demoClickCount: project.demoClickCount,
          repoClickCount: project.repoClickCount,
        },
      })
    } catch (err) {
      console.error('Failed to track project event:', err)
      return response.internalServerError({
        success: false,
        message: 'Failed to record event',
      })
    }
  }
}
