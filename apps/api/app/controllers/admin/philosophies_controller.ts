import type { HttpContext } from '@adonisjs/core/http'
import Philosophy from '#models/philosophy'
import { philosophyValidator } from '#validators/service_validator'
import { ActivityLogService } from '#services/activity_log_service'
import { RevalidateService } from '#services/revalidate_service'

export default class PhilosophiesController {
  async index({ response }: HttpContext) {
    const philosophies = await Philosophy.query()
      .orderBy('order', 'asc')
      .orderBy('created_at', 'asc')

    return response.ok({
      success: true,
      data: philosophies,
    })
  }

  async show({ params, response }: HttpContext) {
    const philosophy = await Philosophy.findOrFail(params.id)

    return response.ok({
      success: true,
      data: philosophy,
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(philosophyValidator)

    const philosophy = await Philosophy.create({
      title: payload.title,
      iconSvg: payload.iconSvg || null,
      tagline: payload.tagline,
      description: payload.description,
      order: payload.order ?? 0,
    })

    ActivityLogService.log(ctx, 'create', 'philosophy', philosophy.id, { title: philosophy.title })

    RevalidateService.revalidate('career').catch(() => {})
    RevalidateService.revalidate('/about').catch(() => {})

    return response.created({
      success: true,
      message: 'Development philosophy created successfully',
      data: philosophy,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const philosophy = await Philosophy.findOrFail(params.id)
    const payload = await request.validateUsing(philosophyValidator)

    philosophy.merge({
      title: payload.title,
      iconSvg: payload.iconSvg !== undefined ? payload.iconSvg : philosophy.iconSvg,
      tagline: payload.tagline,
      description: payload.description,
      ...(payload.order !== undefined && { order: payload.order }),
    })

    await philosophy.save()

    ActivityLogService.log(ctx, 'update', 'philosophy', philosophy.id, { title: philosophy.title })

    RevalidateService.revalidate('career').catch(() => {})
    RevalidateService.revalidate('/about').catch(() => {})

    return response.ok({
      success: true,
      message: 'Development philosophy updated successfully',
      data: philosophy,
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const philosophy = await Philosophy.findOrFail(params.id)
    const id = philosophy.id
    const title = philosophy.title

    await philosophy.delete()

    ActivityLogService.log(ctx, 'delete', 'philosophy', id, { title })

    RevalidateService.revalidate('career').catch(() => {})
    RevalidateService.revalidate('/about').catch(() => {})

    return response.ok({
      success: true,
      message: 'Development philosophy deleted successfully',
    })
  }
}
