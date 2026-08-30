import type { HttpContext } from '@adonisjs/core/http'
import ProjectCategory from '#models/project_category'
import { projectCategoryValidator } from '#validators/project_validator'
import { ActivityLogService } from '#services/activity_log_service'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class ProjectCategoriesController {
  async index({ response }: HttpContext) {
    const categories = await ProjectCategory.query()
      .withCount('projects')
      .orderBy('order', 'asc')
      .orderBy('name', 'asc')

    return response.ok({
      success: true,
      data: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        order: c.order,
        projectsCount: Number(c.$extras.projects_count || 0),
        createdAt: c.createdAt.toISO(),
        updatedAt: c.updatedAt?.toISO() || c.createdAt.toISO(),
      })),
    })
  }

  async show({ params, response }: HttpContext) {
    const category = await ProjectCategory.query()
      .where('id', params.id)
      .withCount('projects')
      .firstOrFail()

    return response.ok({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        order: category.order,
        projectsCount: Number(category.$extras.projects_count || 0),
        createdAt: category.createdAt.toISO(),
        updatedAt: category.updatedAt?.toISO() || category.createdAt.toISO(),
      },
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(projectCategoryValidator)
    const slug = payload.slug || stringHelpers.slug(payload.name, { lower: true })

    const category = await ProjectCategory.create({
      name: payload.name,
      slug,
      description: payload.description || null,
      order: payload.order ?? 0,
    })

    ActivityLogService.log(ctx, 'create', 'project_category', category.id, { name: category.name })

    return response.created({
      success: true,
      message: 'Project category created successfully',
      data: category,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const category = await ProjectCategory.findOrFail(params.id)
    const payload = await request.validateUsing(projectCategoryValidator)

    category.name = payload.name
    category.slug = payload.slug || stringHelpers.slug(payload.name, { lower: true })
    category.description = payload.description || null
    if (payload.order !== undefined) {
      category.order = payload.order
    }

    await category.save()

    ActivityLogService.log(ctx, 'update', 'project_category', category.id, { name: category.name })

    return response.ok({
      success: true,
      message: 'Project category updated successfully',
      data: category,
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const category = await ProjectCategory.findOrFail(params.id)
    const name = category.name
    const id = category.id

    await category.delete()

    ActivityLogService.log(ctx, 'delete', 'project_category', id, { name })

    return response.ok({
      success: true,
      message: 'Project category deleted successfully',
    })
  }
}
