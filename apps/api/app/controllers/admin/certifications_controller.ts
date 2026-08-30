import type { HttpContext } from '@adonisjs/core/http'
import Certification from '#models/certification'
import { certificationValidator, reorderCareerValidator } from '#validators/career_validator'
import { ActivityLogService } from '#services/activity_log_service'
import { DateTime } from 'luxon'

export default class CertificationsController {
  async index({ response }: HttpContext) {
    const certifications = await Certification.query()
      .orderBy('order', 'asc')
      .orderBy('issue_date', 'desc')

    return response.ok({
      success: true,
      data: certifications,
    })
  }

  async show({ params, response }: HttpContext) {
    const certification = await Certification.findOrFail(params.id)

    return response.ok({
      success: true,
      data: certification,
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(certificationValidator)

    const certification = await Certification.create({
      name: payload.name,
      issuer: payload.issuer,
      issuerLogoUrl: payload.issuerLogoUrl || null,
      issueDate: DateTime.fromISO(payload.issueDate),
      expirationDate: payload.expirationDate ? DateTime.fromISO(payload.expirationDate) : null,
      credentialId: payload.credentialId || null,
      credentialUrl: payload.credentialUrl || null,
      order: payload.order ?? 0,
    })

    ActivityLogService.log(ctx, 'create', 'certification', certification.id, {
      name: certification.name,
    })

    return response.created({
      success: true,
      message: 'Certification created successfully',
      data: certification,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const certification = await Certification.findOrFail(params.id)
    const payload = await request.validateUsing(certificationValidator)

    certification.merge({
      name: payload.name,
      issuer: payload.issuer,
      issuerLogoUrl: payload.issuerLogoUrl || null,
      issueDate: DateTime.fromISO(payload.issueDate),
      expirationDate: payload.expirationDate ? DateTime.fromISO(payload.expirationDate) : null,
      credentialId: payload.credentialId || null,
      credentialUrl: payload.credentialUrl || null,
      ...(payload.order !== undefined && { order: payload.order }),
    })

    await certification.save()

    ActivityLogService.log(ctx, 'update', 'certification', certification.id, {
      name: certification.name,
    })

    return response.ok({
      success: true,
      message: 'Certification updated successfully',
      data: certification,
    })
  }

  async reorder({ request, response }: HttpContext) {
    const payload = await request.validateUsing(reorderCareerValidator)

    for (const item of payload.items) {
      await Certification.query().where('id', item.id).update({ order: item.order })
    }

    return response.ok({
      success: true,
      message: 'Certification order updated successfully',
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const certification = await Certification.findOrFail(params.id)
    const id = certification.id
    const name = certification.name

    await certification.delete()

    ActivityLogService.log(ctx, 'delete', 'certification', id, { name })

    return response.ok({
      success: true,
      message: 'Certification deleted successfully',
    })
  }
}
