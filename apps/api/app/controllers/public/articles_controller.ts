import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import ArticleView from '#models/article_view'
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

export default class ArticlesController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const category = request.input('category')
    const tag = request.input('tag')
    const search = request.input('search')

    const query = Post.query()
      .where('status', 'published')
      .preload('category')
      .preload('tags')
      .orderBy('published_at', 'desc')

    if (category) {
      query.whereHas('category', (q) => {
        if (isUuid(category)) {
          q.where('id', category).orWhere('slug', category)
        } else {
          q.where('slug', category)
        }
      })
    }

    if (tag) {
      query.whereHas('tags', (q) => {
        if (isUuid(tag)) {
          q.where('id', tag).orWhere('slug', tag)
        } else {
          q.where('slug', tag)
        }
      })
    }

    if (search) {
      query.where((q) => {
        q.whereILike('title', `%${search}%`).orWhereILike('excerpt', `%${search}%`)
      })
    }

    const posts = await query.paginate(page, perPage)

    return response.ok({
      success: true,
      data: posts.all(),
      meta: {
        total: posts.total,
        page: posts.currentPage,
        perPage: posts.perPage,
        lastPage: posts.lastPage,
      },
    })
  }

  async show({ params, request, response }: HttpContext) {
    const rawSlug = String(params.slug)
    const isParamUuid = isUuid(rawSlug)

    let post = await Post.query()
      .where('status', 'published')
      .andWhere((q) => {
        if (isParamUuid) {
          q.where('id', rawSlug).orWhere('slug', rawSlug)
        } else {
          q.where('slug', rawSlug)
        }
      })
      .preload('category')
      .preload('tags')
      .first()

    if (!post) {
      // Fallback matching for slight slug hyphenation differences
      const cleanPrefix = rawSlug.split('-').slice(0, 3).join('-')
      post = await Post.query()
        .where('status', 'published')
        .whereILike('slug', `%${cleanPrefix}%`)
        .preload('category')
        .preload('tags')
        .firstOrFail()
    }

    // Smart Server-side View Tracking with Anti-Spam (30 min window)
    try {
      const ip = request.ip() || request.header('x-forwarded-for') || null
      const ua = request.header('user-agent') || null
      const referrer = request.header('referer') || null

      const visitorHash = createHash('sha256')
        .update(`${ip || 'unknown'}-${ua || 'unknown'}`)
        .digest('hex')

      const thirtyMinutesAgo = DateTime.now().minus({ minutes: 30 }).toSQL()!

      const recentView = await ArticleView.query()
        .where('post_id', post.id)
        .where('visitor_hash', visitorHash)
        .where('created_at', '>=', thirtyMinutesAgo)
        .first()

      if (!recentView) {
        const { deviceType, browser, os } = parseUserAgent(ua)
        const referrerSource = parseReferrerSource(referrer)

        await ArticleView.create({
          postId: post.id,
          visitorHash,
          ipAddress: ip ? String(ip).slice(0, 45) : null,
          userAgent: ua,
          deviceType,
          browser,
          os,
          referrer,
          referrerSource,
        })

        // Increment view count
        post.viewCount = Number(post.viewCount || 0) + 1
        await post.save()
      }
    } catch (err) {
      console.error('Failed to log article view:', err)
    }

    return response.ok({
      success: true,
      data: post,
    })
  }
}
