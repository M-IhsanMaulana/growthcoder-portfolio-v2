import type { HttpContext } from '@adonisjs/core/http'
import Experience from '#models/experience'
import { experienceValidator, reorderCareerValidator } from '#validators/career_validator'
import { ActivityLogService } from '#services/activity_log_service'
import { DateTime } from 'luxon'

export default class ExperiencesController {
  async index({ response }: HttpContext) {
    const experiences = await Experience.query()
      .preload('techStacks')
      .orderBy('order', 'asc')
      .orderBy('start_date', 'desc')

    return response.ok({
      success: true,
      data: experiences,
    })
  }

  async show({ params, response }: HttpContext) {
    const experience = await Experience.query()
      .where('id', params.id)
      .preload('techStacks')
      .firstOrFail()

    return response.ok({
      success: true,
      data: experience,
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(experienceValidator)

    const experience = await Experience.create({
      company: payload.company,
      position: payload.position,
      location: payload.location || null,
      employmentType: payload.employmentType || 'full-time',
      companyLogoUrl: payload.companyLogoUrl || null,
      startDate: DateTime.fromISO(payload.startDate),
      endDate: payload.endDate ? DateTime.fromISO(payload.endDate) : null,
      isCurrent: payload.isCurrent ?? false,
      description: payload.description,
      order: payload.order ?? 0,
    })

    if (payload.techStackIds && payload.techStackIds.length > 0) {
      await experience.related('techStacks').attach(payload.techStackIds)
    }

    await experience.load('techStacks')

    ActivityLogService.log(ctx, 'create', 'experience', experience.id, {
      company: experience.company,
    })

    return response.created({
      success: true,
      message: 'Experience created successfully',
      data: experience,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const experience = await Experience.findOrFail(params.id)
    const payload = await request.validateUsing(experienceValidator)

    experience.merge({
      company: payload.company,
      position: payload.position,
      location: payload.location || null,
      employmentType: payload.employmentType || 'full-time',
      companyLogoUrl: payload.companyLogoUrl || null,
      startDate: DateTime.fromISO(payload.startDate),
      endDate: payload.endDate ? DateTime.fromISO(payload.endDate) : null,
      isCurrent: payload.isCurrent ?? false,
      description: payload.description,
      ...(payload.order !== undefined && { order: payload.order }),
    })

    await experience.save()

    if (payload.techStackIds !== undefined) {
      await experience.related('techStacks').sync(payload.techStackIds)
    }

    await experience.load('techStacks')

    ActivityLogService.log(ctx, 'update', 'experience', experience.id, {
      company: experience.company,
    })

    return response.ok({
      success: true,
      message: 'Experience updated successfully',
      data: experience,
    })
  }

  async reorder({ request, response }: HttpContext) {
    const payload = await request.validateUsing(reorderCareerValidator)

    for (const item of payload.items) {
      await Experience.query().where('id', item.id).update({ order: item.order })
    }

    return response.ok({
      success: true,
      message: 'Experience order updated successfully',
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const experience = await Experience.findOrFail(params.id)
    const id = experience.id
    const company = experience.company

    await experience.delete()

    ActivityLogService.log(ctx, 'delete', 'experience', id, { company })

    return response.ok({
      success: true,
      message: 'Experience deleted successfully',
    })
  }
}
