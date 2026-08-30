import Post from '#models/post'
import { DateTime } from 'luxon'
import transmit from '@adonisjs/transmit/services/main'
import ActivityLog from '#models/activity_log'
import type { ScheduledArticlesPublishResult } from '@growthcoder/types'

export async function processPublishScheduledArticlesJob(): Promise<ScheduledArticlesPublishResult> {
  const now = DateTime.now()
  const nowSql = now.toSQL()!

  // Find all posts that are scheduled and their scheduledAt time has passed
  const scheduledPosts = await Post.query()
    .where('status', 'scheduled')
    .whereNotNull('scheduled_at')
    .where('scheduled_at', '<=', nowSql)

  const publishedPostIds: string[] = []

  for (const post of scheduledPosts) {
    const oldScheduledAt = post.scheduledAt
    post.status = 'published'
    post.publishedAt = oldScheduledAt || now

    await post.save()
    publishedPostIds.push(post.id)

    // Broadcast SSE event
    try {
      transmit.broadcast('article/published', {
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
        publishedAt: post.publishedAt?.toISO(),
      })
    } catch (err) {
      console.warn('[PublishScheduledArticlesJob] SSE Broadcast failed:', err)
    }

    // Persist activity log
    try {
      await ActivityLog.create({
        action: 'update',
        entity: 'article',
        entityId: post.id,
        payload: {
          title: post.title,
          trigger: 'scheduler_auto_publish',
          publishedAt: post.publishedAt?.toISO(),
          scheduledAt: oldScheduledAt?.toISO(),
        },
        userAgent: 'Scheduler Daemon (BullMQ)',
        ipAddress: '127.0.0.1',
      })
    } catch (err) {
      console.warn('[PublishScheduledArticlesJob] Activity log persist failed:', err)
    }

    console.log(
      `[PublishScheduledArticlesJob] Auto-published article: "${post.title}" (${post.id})`
    )
  }

  return {
    processedCount: publishedPostIds.length,
    publishedPostIds,
    timestamp: now.toISO(),
  }
}
