import type { HttpContext } from '@adonisjs/core/http'
import Education from '#models/education'
import { educationValidator, reorderCareerValidator } from '#validators/career_validator'
import { ActivityLogService } from '#services/activity_log_service'
import { DateTime } from 'luxon'

export default class EducationsController {
  async index({ response }: HttpContext) {
    const educations = await Education.query().orderBy('order', 'asc').orderBy('start_date', 'desc')

    return response.ok({
      success: true,
      data: educations,
    })
  }

  async show({ params, response }: HttpContext) {
    const education = await Education.findOrFail(params.id)

    return response.ok({
      success: true,
      data: education,
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(educationValidator)

    const education = await Education.create({
      institution: payload.institution,
      degree: payload.degree,
      fieldOfStudy: payload.fieldOfStudy || '',
      institutionLogoUrl: payload.institutionLogoUrl || null,
      startDate: DateTime.fromISO(payload.startDate),
      endDate: payload.endDate ? DateTime.fromISO(payload.endDate) : null,
      isCurrent: payload.isCurrent ?? false,
      grade: payload.grade || null,
      description: payload.description || null,
      order: payload.order ?? 0,
    })

    ActivityLogService.log(ctx, 'create', 'education', education.id, {
      institution: education.institution,
    })

    return response.created({
      success: true,
      message: 'Education created successfully',
      data: education,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const education = await Education.findOrFail(params.id)
    const payload = await request.validateUsing(educationValidator)

    education.merge({
      institution: payload.institution,
      degree: payload.degree,
      fieldOfStudy: payload.fieldOfStudy !== undefined ? payload.fieldOfStudy || '' : education.fieldOfStudy,
      institutionLogoUrl: payload.institutionLogoUrl || null,
      startDate: DateTime.fromISO(payload.startDate),
      endDate: payload.endDate ? DateTime.fromISO(payload.endDate) : null,
      isCurrent: payload.isCurrent ?? false,
      grade: payload.grade || null,
      description: payload.description || null,
      ...(payload.order !== undefined && { order: payload.order }),
    })

    await education.save()

    ActivityLogService.log(ctx, 'update', 'education', education.id, {
      institution: education.institution,
    })

    return response.ok({
      success: true,
      message: 'Education updated successfully',
      data: education,
    })
  }

  async reorder({ request, response }: HttpContext) {
    const payload = await request.validateUsing(reorderCareerValidator)

    for (const item of payload.items) {
      await Education.query().where('id', item.id).update({ order: item.order })
    }

    return response.ok({
      success: true,
      message: 'Education order updated successfully',
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const education = await Education.findOrFail(params.id)
    const id = education.id
    const institution = education.institution

    await education.delete()

    ActivityLogService.log(ctx, 'delete', 'education', id, { institution })

    return response.ok({
      success: true,
      message: 'Education deleted successfully',
    })
  }
}
