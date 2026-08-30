import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { categoryValidator } from '#validators/taxonomy_validator'
import { ActivityLogService } from '#services/activity_log_service'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class CategoriesController {
  async index({ request, response }: HttpContext) {
    const status = request.input('status')
    const query = Category.query()

    if (status) {
      query.withCount('posts', (q) => q.where('status', status))
    } else {
      query.withCount('posts')
    }

    const categories = await query.orderBy('name', 'asc')

    return response.ok({
      success: true,
      data: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        postsCount: Number(c.$extras.posts_count || 0),
        createdAt: c.createdAt.toISO(),
        updatedAt: c.updatedAt?.toISO() || c.createdAt.toISO(),
      })),
    })
  }

  async show({ params, response }: HttpContext) {
    const category = await Category.query().where('id', params.id).withCount('posts').firstOrFail()

    return response.ok({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        postsCount: Number(category.$extras.posts_count || 0),
        createdAt: category.createdAt.toISO(),
        updatedAt: category.updatedAt?.toISO() || category.createdAt.toISO(),
      },
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(categoryValidator)
    const slug = payload.slug || stringHelpers.slug(payload.name, { lower: true })

    const category = await Category.create({
      name: payload.name,
      slug,
      description: payload.description || null,
    })

    ActivityLogService.log(ctx, 'create', 'category', category.id, { name: category.name })

    return response.created({
      success: true,
      message: 'Category created successfully',
      data: category,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const category = await Category.findOrFail(params.id)
    const payload = await request.validateUsing(categoryValidator)

    category.name = payload.name
    category.slug = payload.slug || stringHelpers.slug(payload.name, { lower: true })
    category.description = payload.description || null

    await category.save()

    ActivityLogService.log(ctx, 'update', 'category', category.id, { name: category.name })

    return response.ok({
      success: true,
      message: 'Category updated successfully',
      data: category,
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const category = await Category.findOrFail(params.id)
    const name = category.name
    const id = category.id

    await category.delete()

    ActivityLogService.log(ctx, 'delete', 'category', id, { name })

    return response.ok({
      success: true,
      message: 'Category deleted successfully',
    })
  }
}
