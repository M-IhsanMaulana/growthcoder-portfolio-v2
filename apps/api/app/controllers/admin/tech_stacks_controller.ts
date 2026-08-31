import type { HttpContext } from '@adonisjs/core/http'
import TechStack from '#models/tech_stack'
import {
  createTechStackValidator,
  updateTechStackValidator,
} from '#validators/tech_stack_validator'
import { ActivityLogService } from '#services/activity_log_service'
import { RevalidateService } from '#services/revalidate_service'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class TechStacksController {
  async index({ request, response }: HttpContext) {
    const category = request.input('category')
    const query = TechStack.query().orderBy('order', 'asc').orderBy('name', 'asc')

    if (category) {
      query.where('category', category)
    }

    const techStacks = await query

    return response.ok({
      success: true,
      data: techStacks,
    })
  }

  async show({ params, response }: HttpContext) {
    const techStack = await TechStack.findOrFail(params.id)

    return response.ok({
      success: true,
      data: techStack,
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(createTechStackValidator)
    const slug = payload.slug || stringHelpers.slug(payload.name, { lower: true })

    const techStack = await TechStack.create({
      name: payload.name,
      slug,
      iconSvg: payload.iconSvg || null,
      category: payload.category,
      isFeatured: payload.isFeatured ?? false,
      level: payload.level || null,
      order: payload.order ?? 0,
    })

    ActivityLogService.log(ctx, 'create', 'tech_stack', techStack.id, { name: techStack.name })
    await RevalidateService.revalidate('tech-stacks')

    return response.created({
      success: true,
      message: 'Tech stack created successfully',
      data: techStack,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const techStack = await TechStack.findOrFail(params.id)
    const payload = await request.validateUsing(updateTechStackValidator)

    if (payload.name && !payload.slug) {
      techStack.slug = stringHelpers.slug(payload.name, { lower: true })
    } else if (payload.slug) {
      techStack.slug = payload.slug
    }

    techStack.merge({
      ...(payload.name && { name: payload.name }),
      ...(payload.iconSvg !== undefined && { iconSvg: payload.iconSvg }),
      ...(payload.category && { category: payload.category }),
      ...(payload.isFeatured !== undefined && { isFeatured: payload.isFeatured }),
      ...(payload.level !== undefined && { level: payload.level }),
      ...(payload.order !== undefined && { order: payload.order }),
    })

    await techStack.save()

    ActivityLogService.log(ctx, 'update', 'tech_stack', techStack.id, { name: techStack.name })
    await RevalidateService.revalidate('tech-stacks')

    return response.ok({
      success: true,
      message: 'Tech stack updated successfully',
      data: techStack,
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const techStack = await TechStack.findOrFail(params.id)
    const name = techStack.name
    const id = techStack.id

    await techStack.delete()

    ActivityLogService.log(ctx, 'delete', 'tech_stack', id, { name })
    await RevalidateService.revalidate('tech-stacks')

    return response.ok({
      success: true,
      message: 'Tech stack deleted successfully',
    })
  }
}

