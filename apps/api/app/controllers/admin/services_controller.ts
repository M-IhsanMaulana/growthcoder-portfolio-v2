import type { HttpContext } from '@adonisjs/core/http'
import Service from '#models/service'
import ServiceFaq from '#models/service_faq'
import { serviceValidator } from '#validators/service_validator'
import { ActivityLogService } from '#services/activity_log_service'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class ServicesController {
  async index({ response }: HttpContext) {
    const services = await Service.query()
      .preload('faqs', (q) => q.orderBy('sort_order', 'asc'))
      .orderBy('order', 'asc')

    return response.ok({
      success: true,
      data: services,
    })
  }

  async show({ params, response }: HttpContext) {
    const service = await Service.query()
      .where('id', params.id)
      .preload('faqs', (q) => q.orderBy('sort_order', 'asc'))
      .firstOrFail()

    return response.ok({
      success: true,
      data: service,
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(serviceValidator)
    const slug = payload.slug || stringHelpers.slug(payload.title, { lower: true })

    const service = await Service.create({
      title: payload.title,
      slug,
      iconSvg: payload.iconSvg || null,
      shortDescription: payload.shortDescription,
      valueProposition: payload.valueProposition,
      deliverables: payload.deliverables || [],
      order: payload.order ?? 0,
      isFeatured: payload.isFeatured ?? false,
    })

    if (payload.faqs && payload.faqs.length > 0) {
      await ServiceFaq.createMany(
        payload.faqs.map((faq, index) => ({
          serviceId: service.id,
          question: faq.question,
          answer: faq.answer,
          sortOrder: faq.sortOrder ?? index,
        }))
      )
    }

    await service.load('faqs')

    ActivityLogService.log(ctx, 'create', 'service', service.id, { title: service.title })

    return response.created({
      success: true,
      message: 'Service created successfully',
      data: service,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const service = await Service.findOrFail(params.id)
    const payload = await request.validateUsing(serviceValidator)

    if (payload.title && !payload.slug) {
      service.slug = stringHelpers.slug(payload.title, { lower: true })
    } else if (payload.slug) {
      service.slug = payload.slug
    }

    service.merge({
      ...(payload.title && { title: payload.title }),
      ...(payload.iconSvg !== undefined && { iconSvg: payload.iconSvg }),
      ...(payload.shortDescription && { shortDescription: payload.shortDescription }),
      ...(payload.valueProposition && { valueProposition: payload.valueProposition }),
      ...(payload.deliverables && { deliverables: payload.deliverables }),
      ...(payload.order !== undefined && { order: payload.order }),
      ...(payload.isFeatured !== undefined && { isFeatured: payload.isFeatured }),
    })

    await service.save()

    if (payload.faqs) {
      await ServiceFaq.query().where('service_id', service.id).delete()
      await ServiceFaq.createMany(
        payload.faqs.map((faq, index) => ({
          serviceId: service.id,
          question: faq.question,
          answer: faq.answer,
          sortOrder: faq.sortOrder ?? index,
        }))
      )
    }

    await service.load('faqs')

    ActivityLogService.log(ctx, 'update', 'service', service.id, { title: service.title })

    return response.ok({
      success: true,
      message: 'Service updated successfully',
      data: service,
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const service = await Service.findOrFail(params.id)
    const id = service.id
    const title = service.title

    await service.delete()

    ActivityLogService.log(ctx, 'delete', 'service', id, { title })

    return response.ok({
      success: true,
      message: 'Service deleted successfully',
    })
  }
}
