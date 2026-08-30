import type { HttpContext } from '@adonisjs/core/http'
import Tag from '#models/tag'
import { tagValidator } from '#validators/taxonomy_validator'
import { ActivityLogService } from '#services/activity_log_service'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class TagsController {
  async index({ request, response }: HttpContext) {
    const status = request.input('status')
    const query = Tag.query()

    if (status) {
      query.withCount('posts', (q) => q.where('status', status))
    } else {
      query.withCount('posts')
    }

    const tags = await query.orderBy('name', 'asc')

    return response.ok({
      success: true,
      data: tags.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        postsCount: Number(t.$extras.posts_count || 0),
        createdAt: t.createdAt.toISO(),
        updatedAt: t.updatedAt?.toISO() || t.createdAt.toISO(),
      })),
    })
  }

  async show({ params, response }: HttpContext) {
    const tag = await Tag.query().where('id', params.id).withCount('posts').firstOrFail()

    return response.ok({
      success: true,
      data: {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        postsCount: Number(tag.$extras.posts_count || 0),
        createdAt: tag.createdAt.toISO(),
        updatedAt: tag.updatedAt?.toISO() || tag.createdAt.toISO(),
      },
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(tagValidator)
    const slug = payload.slug || stringHelpers.slug(payload.name, { lower: true })

    const tag = await Tag.create({
      name: payload.name,
      slug,
    })

    ActivityLogService.log(ctx, 'create', 'tag', tag.id, { name: tag.name })

    return response.created({
      success: true,
      message: 'Tag created successfully',
      data: tag,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const tag = await Tag.findOrFail(params.id)
    const payload = await request.validateUsing(tagValidator)

    tag.name = payload.name
    tag.slug = payload.slug || stringHelpers.slug(payload.name, { lower: true })

    await tag.save()

    ActivityLogService.log(ctx, 'update', 'tag', tag.id, { name: tag.name })

    return response.ok({
      success: true,
      message: 'Tag updated successfully',
      data: tag,
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const tag = await Tag.findOrFail(params.id)
    const name = tag.name
    const id = tag.id

    await tag.delete()

    ActivityLogService.log(ctx, 'delete', 'tag', id, { name })

    return response.ok({
      success: true,
      message: 'Tag deleted successfully',
    })
  }
}
