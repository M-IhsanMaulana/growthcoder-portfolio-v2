import type { HttpContext } from '@adonisjs/core/http'
import Expertise from '#models/expertise'
import { expertiseValidator, reorderExpertiseValidator } from '#validators/expertise_validator'
import { ActivityLogService } from '#services/activity_log_service'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class ExpertisesController {
  async index({ response }: HttpContext) {
    const expertises = await Expertise.query()
      .preload('techStacks')
      .orderBy('order', 'asc')
      .orderBy('created_at', 'asc')

    return response.ok({
      success: true,
      data: expertises,
    })
  }

  async show({ params, response }: HttpContext) {
    const expertise = await Expertise.query()
      .where('id', params.id)
      .preload('techStacks')
      .firstOrFail()

    return response.ok({
      success: true,
      data: expertise,
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(expertiseValidator)

    const baseSlug = payload.slug || stringHelpers.slug(payload.title, { lower: true })
    let slug = baseSlug
    let counter = 1
    while (await Expertise.findBy('slug', slug)) {
      slug = `${baseSlug}-${counter++}`
    }

    const expertise = await Expertise.create({
      title: payload.title,
      slug,
      subtitle: payload.subtitle,
      description: payload.description,
      iconSvg: payload.iconSvg || null,
      order: payload.order ?? 0,
      isFeatured: payload.isFeatured ?? true,
    })

    if (payload.techStackIds && payload.techStackIds.length > 0) {
      await expertise.related('techStacks').attach(payload.techStackIds)
    }

    await expertise.load('techStacks')

    ActivityLogService.log(ctx, 'create', 'expertise', expertise.id, { title: expertise.title })

    return response.created({
      success: true,
      message: 'Expertise created successfully',
      data: expertise,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const expertise = await Expertise.findOrFail(params.id)
    const payload = await request.validateUsing(expertiseValidator)

    let slug = expertise.slug
    if (payload.slug && payload.slug !== expertise.slug) {
      const baseSlug = stringHelpers.slug(payload.slug, { lower: true })
      slug = baseSlug
      let counter = 1
      while (await Expertise.query().where('slug', slug).whereNot('id', expertise.id).first()) {
        slug = `${baseSlug}-${counter++}`
      }
    }

    expertise.merge({
      title: payload.title,
      slug,
      subtitle: payload.subtitle,
      description: payload.description,
      iconSvg: payload.iconSvg !== undefined ? payload.iconSvg : expertise.iconSvg,
      ...(payload.order !== undefined && { order: payload.order }),
      ...(payload.isFeatured !== undefined && { isFeatured: payload.isFeatured }),
    })

    await expertise.save()

    if (payload.techStackIds !== undefined) {
      await expertise.related('techStacks').sync(payload.techStackIds)
    }

    await expertise.load('techStacks')

    ActivityLogService.log(ctx, 'update', 'expertise', expertise.id, { title: expertise.title })

    return response.ok({
      success: true,
      message: 'Expertise updated successfully',
      data: expertise,
    })
  }

  async reorder({ request, response }: HttpContext) {
    const payload = await request.validateUsing(reorderExpertiseValidator)

    for (const item of payload.items) {
      await Expertise.query().where('id', item.id).update({ order: item.order })
    }

    return response.ok({
      success: true,
      message: 'Expertise order updated successfully',
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const expertise = await Expertise.findOrFail(params.id)
    const id = expertise.id
    const title = expertise.title

    await expertise.delete()

    ActivityLogService.log(ctx, 'delete', 'expertise', id, { title })

    return response.ok({
      success: true,
      message: 'Expertise deleted successfully',
    })
  }
}
