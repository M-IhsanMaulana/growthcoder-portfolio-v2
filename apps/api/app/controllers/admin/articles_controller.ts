import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createArticleValidator, updateArticleValidator } from '#validators/article_validator'
import { ActivityLogService } from '#services/activity_log_service'
import SanitizerService from '#services/sanitizer_service'
import stringHelpers from '@adonisjs/core/helpers/string'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import { createHmac } from 'node:crypto'
import env from '#start/env'

function computeContentEvaluation(content: string = '', readingTimeMinutes?: number | null) {
  const plainText = content
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const words = plainText ? plainText.split(/\s+/).filter(Boolean) : []
  const wordCount = words.length
  const characterCount = plainText.length

  const calculatedReadingTime = readingTimeMinutes || Math.max(1, Math.ceil(wordCount / 200))

  const h1Matches = content.match(/<h1[^>]*>/gi) || []
  const h2Matches = content.match(/<h2[^>]*>/gi) || []
  const h3Matches = content.match(/<h3[^>]*>/gi) || []
  const pMatches = content.match(/<p[^>]*>/gi) || []
  const imgMatches = content.match(/<img[^>]*>/gi) || []
  const aMatches = content.match(/<a [^>]*>/gi) || []

  // Readability heuristics
  let readabilityGrade: 'Easy' | 'Moderate' | 'Advanced' = 'Moderate'
  let readabilityScore = 75

  if (wordCount < 150) {
    readabilityGrade = 'Easy'
    readabilityScore = 60
  } else if (wordCount > 1500) {
    readabilityGrade = 'Advanced'
    readabilityScore = 85
  } else {
    readabilityGrade = 'Moderate'
    readabilityScore = 78
  }

  const recommendations: string[] = []
  if (wordCount < 300) {
    recommendations.push(
      'Panjang konten kurang dari 300 kata. Tambahkan lebih banyak penjelasan mendalam untuk performa SEO optimal.'
    )
  } else if (wordCount > 600) {
    recommendations.push('Panjang kata artikel sangat baik dan komprehensif (>600 kata).')
  }

  if (h2Matches.length === 0) {
    recommendations.push(
      'Tambahkan subjudul (H2) untuk membagi bagian artikel agar lebih mudah dipindai pembaca.'
    )
  }

  if (imgMatches.length === 0) {
    recommendations.push(
      'Sertakan setidaknya 1-2 gambar ilustrasi atau diagram untuk meningkatkan retensi pembaca.'
    )
  }

  if (aMatches.length === 0) {
    recommendations.push(
      'Tambahkan tautan internal (ke artikel lain) atau eksternal untuk kredibilitas konten.'
    )
  }

  return {
    wordCount,
    characterCount,
    readingTimeMinutes: calculatedReadingTime,
    headingCount: {
      h1: h1Matches.length,
      h2: h2Matches.length,
      h3: h3Matches.length,
      total: h1Matches.length + h2Matches.length + h3Matches.length,
    },
    imageCount: imgMatches.length,
    linkCount: aMatches.length,
    paragraphCount: pMatches.length,
    readabilityGrade,
    readabilityScore,
    recommendations,
  }
}

function computeSeoAudit(post: Post) {
  const metaTitle = post.metaTitle || post.title || ''
  const metaDescription = post.metaDescription || post.excerpt || ''

  const titleLen = metaTitle.length
  let metaTitleStatus: 'good' | 'warning' | 'error' = 'good'
  if (titleLen < 20 || titleLen > 70) {
    metaTitleStatus = titleLen > 75 ? 'error' : 'warning'
  }

  const descLen = metaDescription.length
  let metaDescriptionStatus: 'good' | 'warning' | 'error' = 'good'
  if (descLen < 50 || descLen > 170) {
    metaDescriptionStatus = descLen > 180 ? 'error' : 'warning'
  }

  const hasCover = Boolean(post.coverImage)
  const hasCat = Boolean(post.categoryId)
  const slugOk = /^[a-z0-9-]+$/.test(post.slug)

  const checklist: Array<{
    title: string
    description: string
    passed: boolean
    severity: 'critical' | 'recommended' | 'optional'
  }> = [
    {
      title: 'Meta Title Optimal',
      description: `Panjang judul: ${titleLen} karakter (Disarankan: 40-65 karakter)`,
      passed: titleLen >= 30 && titleLen <= 70,
      severity: 'critical',
    },
    {
      title: 'Meta Description Optimal',
      description: `Panjang deskripsi: ${descLen} karakter (Disarankan: 120-160 karakter)`,
      passed: descLen >= 80 && descLen <= 170,
      severity: 'critical',
    },
    {
      title: 'Cover Image Ditetapkan',
      description: hasCover
        ? 'Cover image terpasang untuk Open Graph preview'
        : 'Belum ada cover image yang diset',
      passed: hasCover,
      severity: 'recommended',
    },
    {
      title: 'Kategori Artikel',
      description: hasCat ? 'Artikel terhubung dengan kategori' : 'Kategori belum dipilih',
      passed: hasCat,
      severity: 'recommended',
    },
    {
      title: 'Format Slug Bersih & SEO Friendly',
      description: `Format slug: /${post.slug}`,
      passed: slugOk,
      severity: 'critical',
    },
  ]

  const passedCount = checklist.filter((c) => c.passed).length
  const overallScore = Math.round((passedCount / checklist.length) * 100)

  return {
    hasMetaTitle: Boolean(post.metaTitle),
    metaTitleLength: titleLen,
    metaTitleStatus,
    hasMetaDescription: Boolean(post.metaDescription),
    metaDescriptionLength: descLen,
    metaDescriptionStatus,
    hasCoverImage: hasCover,
    hasCategory: hasCat,
    hasTags: true,
    slugStatus: (slugOk ? 'good' : 'warning') as 'good' | 'warning',
    overallScore,
    checklist,
  }
}

export default class ArticlesController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const search = request.input('search')
    const status = request.input('status')
    const categoryId = request.input('categoryId')

    const query = Post.query().preload('category').preload('tags').orderBy('created_at', 'desc')

    if (search) {
      query.where((q) => {
        q.whereILike('title', `%${search}%`).orWhereILike('excerpt', `%${search}%`)
      })
    }

    if (status) {
      query.where('status', status)
    }

    if (categoryId) {
      query.where('category_id', categoryId)
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

  async show({ params, response }: HttpContext) {
    const post = await Post.query()
      .where('id', params.id)
      .preload('category')
      .preload('tags')
      .firstOrFail()

    return response.ok({
      success: true,
      data: post,
    })
  }

  async previewUrl({ params, response }: HttpContext) {
    const post = await Post.query().where('id', params.id).firstOrFail()
    const rawAppKey = env.get('APP_KEY')
    const appKey = typeof rawAppKey === 'string' ? rawAppKey : (rawAppKey?.release() || 'growthcoder-default-secret-key')
    const token = createHmac('sha256', appKey).update(`${post.slug}:preview`).digest('hex')
    const siteUrl = env.get('FRONTEND_URL') || env.get('SITE_URL') || 'https://growthcoder.id'
    const previewUrl = `${siteUrl.replace(/\/$/, '')}/blog/${post.slug}?preview=true&token=${token}`

    return response.ok({
      success: true,
      data: {
        previewUrl,
        token,
        slug: post.slug,
      },
    })
  }

  async analytics({ params, request, response }: HttpContext) {
    const post = await Post.query()
      .where('id', params.id)
      .preload('category')
      .preload('tags')
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

    // 1. Total views in period & Unique visitors
    const [periodStats] = await db
      .from('article_views')
      .where('post_id', post.id)
      .where('created_at', '>=', startSql)
      .where('created_at', '<=', endSql)
      .select(
        db.raw('count(*) as total_views'),
        db.raw('count(distinct visitor_hash) as unique_visitors')
      )

    const totalViewsInPeriod = Number(periodStats?.total_views || 0)
    const uniqueVisitors = Number(periodStats?.unique_visitors || 0)

    // 2. Previous Period Growth calculation
    const durationDays = Math.max(1, Math.round(endDate.diff(startDate, 'days').days))
    const prevStartDate = startDate.minus({ days: durationDays }).toSQL()!
    const [prevStats] = await db
      .from('article_views')
      .where('post_id', post.id)
      .where('created_at', '>=', prevStartDate)
      .where('created_at', '<', startSql)
      .select(db.raw('count(*) as total_views'))

    const prevViews = Number(prevStats?.total_views || 0)
    let periodGrowth = 0
    if (prevViews > 0) {
      periodGrowth = Math.round(((totalViewsInPeriod - prevViews) / prevViews) * 100)
    } else if (totalViewsInPeriod > 0) {
      periodGrowth = 100
    }

    // 3. Time Series Data (Daily Breakdown)
    const dailyViewsQuery = await db
      .from('article_views')
      .where('post_id', post.id)
      .where('created_at', '>=', startSql)
      .where('created_at', '<=', endSql)
      .select(
        db.raw('DATE(created_at) as view_date'),
        db.raw('count(*) as views'),
        db.raw('count(distinct visitor_hash) as unique_visitors')
      )
      .groupByRaw('DATE(created_at)')
      .orderByRaw('view_date ASC')

    const dailyMap = new Map<string, { views: number; uniqueVisitors: number }>()
    dailyViewsQuery.forEach((row: any) => {
      const dateStr =
        typeof row.view_date === 'string'
          ? row.view_date.split('T')[0]
          : DateTime.fromJSDate(new Date(row.view_date)).toFormat('yyyy-MM-dd')
      dailyMap.set(dateStr, {
        views: Number(row.views || 0),
        uniqueVisitors: Number(row.unique_visitors || 0),
      })
    })

    // Fill all days in date range
    const timeSeries: Array<{
      date: string
      formattedDate: string
      views: number
      uniqueVisitors: number
    }> = []
    let curr = startDate
    while (curr <= endDate) {
      const dateKey = curr.toFormat('yyyy-MM-dd')
      const formatted = curr.toFormat('dd LLL')
      const existing = dailyMap.get(dateKey) || { views: 0, uniqueVisitors: 0 }
      timeSeries.push({
        date: dateKey,
        formattedDate: formatted,
        views: existing.views,
        uniqueVisitors: existing.uniqueVisitors,
      })
      curr = curr.plus({ days: 1 })
    }

    // 4. Referrer Sources breakdown
    const sourcesQuery = await db
      .from('article_views')
      .where('post_id', post.id)
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
        totalViewsInPeriod > 0 ? Math.round((Number(r.count || 0) / totalViewsInPeriod) * 100) : 0,
    }))

    // 5. Device Type Breakdown
    const devicesQuery = await db
      .from('article_views')
      .where('post_id', post.id)
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
        totalViewsInPeriod > 0 ? Math.round((Number(r.count || 0) / totalViewsInPeriod) * 100) : 0,
    }))

    // 6. Browser Breakdown
    const browsersQuery = await db
      .from('article_views')
      .where('post_id', post.id)
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
        totalViewsInPeriod > 0 ? Math.round((Number(r.count || 0) / totalViewsInPeriod) * 100) : 0,
    }))

    // 7. Operating System Breakdown
    const osQuery = await db
      .from('article_views')
      .where('post_id', post.id)
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
        totalViewsInPeriod > 0 ? Math.round((Number(r.count || 0) / totalViewsInPeriod) * 100) : 0,
    }))

    // 8. Content Evaluation & SEO
    const contentEvaluation = computeContentEvaluation(post.content, post.readingTimeMinutes)
    const seoAudit = computeSeoAudit(post)

    return response.ok({
      success: true,
      data: {
        period,
        dateFrom: startDate.toISODate()!,
        dateTo: endDate.toISODate()!,
        summary: {
          totalViews: totalViewsInPeriod || Number(post.viewCount || 0),
          uniqueVisitors:
            uniqueVisitors ||
            (totalViewsInPeriod > 0
              ? Math.round(totalViewsInPeriod * 0.75)
              : Number(post.viewCount || 0)),
          avgReadingTime: contentEvaluation.readingTimeMinutes,
          bounceRateEstimate: 34,
          periodGrowth,
        },
        timeSeries,
        sources:
          sources.length > 0
            ? sources
            : [{ name: 'Direct', count: Number(post.viewCount || 1), percentage: 100 }],
        devices:
          devices.length > 0
            ? devices
            : [{ name: 'Desktop', count: Number(post.viewCount || 1), percentage: 100 }],
        browsers:
          browsers.length > 0
            ? browsers
            : [{ name: 'Chrome', count: Number(post.viewCount || 1), percentage: 100 }],
        operatingSystems:
          operatingSystems.length > 0
            ? operatingSystems
            : [{ name: 'Windows', count: Number(post.viewCount || 1), percentage: 100 }],
        contentEvaluation,
        seoAudit,
      },
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(createArticleValidator)

    const slug = payload.slug || stringHelpers.slug(payload.title, { lower: true })

    const cleanContent = SanitizerService.cleanHtml(payload.content)
    const cleanExcerpt = payload.excerpt
      ? SanitizerService.cleanExcerpt(payload.excerpt)
      : SanitizerService.cleanExcerpt(cleanContent)

    // Estimate reading time (~200 words/min)
    const wordCount = cleanContent.replace(/<[^>]*>?/gm, '').split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    const status = payload.status || 'draft'
    let publishedAt: DateTime | null = null
    if (status === 'published') {
      publishedAt = payload.publishedAt ? DateTime.fromISO(payload.publishedAt) : DateTime.now()
    }

    const post = await Post.create({
      title: payload.title,
      slug,
      excerpt: cleanExcerpt,
      content: cleanContent,
      coverImage: payload.coverImage || null,
      status,
      publishedAt,
      scheduledAt: payload.scheduledAt ? DateTime.fromISO(payload.scheduledAt) : null,
      readingTimeMinutes: payload.readingTimeMinutes || readingTime,
      metaTitle: payload.metaTitle || payload.title,
      metaDescription: payload.metaDescription || cleanExcerpt,
      categoryId: payload.categoryId || null,
      viewCount: 0,
    })

    if (payload.tagIds && payload.tagIds.length > 0) {
      await post.related('tags').attach(payload.tagIds)
    }

    await post.load('category')
    await post.load('tags')

    ActivityLogService.log(ctx, 'create', 'article', post.id, {
      title: post.title,
      status: post.status,
      slug: post.slug,
      categoryId: post.categoryId,
    })

    return response.created({
      success: true,
      message: 'Article created successfully',
      data: post,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const post = await Post.findOrFail(params.id)
    const payload = await request.validateUsing(updateArticleValidator)

    // Capture old values for rich diff logging
    const oldSnapshot = {
      title: post.title,
      slug: post.slug,
      status: post.status,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      categoryId: post.categoryId,
      scheduledAt: post.scheduledAt?.toISO() || null,
    }

    if (payload.title && !payload.slug) {
      post.slug = stringHelpers.slug(payload.title, { lower: true })
    } else if (payload.slug) {
      post.slug = payload.slug
    }

    let cleanContent: string | undefined
    if (payload.content !== undefined) {
      cleanContent = SanitizerService.cleanHtml(payload.content)
      const wordCount = cleanContent.replace(/<[^>]*>?/gm, '').split(/\s+/).length
      post.readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))
    }

    if (payload.status === 'published' && !post.publishedAt) {
      post.publishedAt = payload.publishedAt
        ? DateTime.fromISO(payload.publishedAt)
        : DateTime.now()
    }

    post.merge({
      ...(payload.title && { title: payload.title }),
      ...(payload.excerpt !== undefined && {
        excerpt: SanitizerService.cleanExcerpt(payload.excerpt),
      }),
      ...(cleanContent !== undefined && { content: cleanContent }),
      ...(payload.coverImage !== undefined && { coverImage: payload.coverImage }),
      ...(payload.status && { status: payload.status }),
      ...(payload.publishedAt && { publishedAt: DateTime.fromISO(payload.publishedAt) }),
      ...(payload.scheduledAt !== undefined && {
        scheduledAt: payload.scheduledAt ? DateTime.fromISO(payload.scheduledAt) : null,
      }),
      ...(payload.metaTitle !== undefined && { metaTitle: payload.metaTitle }),
      ...(payload.metaDescription !== undefined && { metaDescription: payload.metaDescription }),
      ...(payload.categoryId !== undefined && { categoryId: payload.categoryId }),
    })

    await post.save()

    if (payload.tagIds) {
      await post.related('tags').sync(payload.tagIds)
    }

    await post.load('category')
    await post.load('tags')

    // Find changes
    const newSnapshot = {
      title: post.title,
      slug: post.slug,
      status: post.status,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      categoryId: post.categoryId,
      scheduledAt: post.scheduledAt?.toISO() || null,
    }

    const changedFields: Record<string, { before: unknown; after: unknown }> = {}
    for (const key of Object.keys(newSnapshot) as Array<keyof typeof newSnapshot>) {
      if (oldSnapshot[key] !== newSnapshot[key]) {
        changedFields[key] = {
          before: oldSnapshot[key],
          after: newSnapshot[key],
        }
      }
    }

    ActivityLogService.log(ctx, 'update', 'article', post.id, {
      title: post.title,
      changedFields,
      changesSummary: Object.keys(changedFields).join(', ') || 'Content updated',
    })

    return response.ok({
      success: true,
      message: 'Article updated successfully',
      data: post,
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const post = await Post.findOrFail(params.id)
    const title = post.title
    const id = post.id

    await post.delete()

    ActivityLogService.log(ctx, 'delete', 'article', id, { title })

    return response.ok({
      success: true,
      message: 'Article deleted successfully',
    })
  }

  async toggleStatus(ctx: HttpContext) {
    const { params, request, response } = ctx
    const post = await Post.findOrFail(params.id)
    const status = request.input('status')

    if (!['draft', 'published', 'scheduled'].includes(status)) {
      return response.badRequest({
        success: false,
        message: 'Invalid article status',
      })
    }

    const oldStatus = post.status
    post.status = status
    if (status === 'published' && !post.publishedAt) {
      post.publishedAt = DateTime.now()
    }

    await post.save()

    ActivityLogService.log(ctx, 'update', 'article', post.id, {
      title: post.title,
      changedFields: {
        status: { before: oldStatus, after: status },
      },
      changesSummary: `Status diubah dari ${oldStatus} ke ${status}`,
    })

    return response.ok({
      success: true,
      message: `Article status changed to ${status}`,
      data: post,
    })
  }

  async publishScheduled({ response }: HttpContext) {
    const { processPublishScheduledArticlesJob } =
      await import('#tasks/publish_scheduled_articles_job')
    const result = await processPublishScheduledArticlesJob()

    return response.ok({
      success: true,
      message:
        result.processedCount > 0
          ? `Berhasil mempublikasikan ${result.processedCount} artikel terjadwal`
          : 'Tidak ada artikel terjadwal yang jatuh tempo saat ini',
      data: result,
    })
  }
}
