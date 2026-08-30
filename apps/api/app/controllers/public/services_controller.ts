import type { HttpContext } from '@adonisjs/core/http'
import Service from '#models/service'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isUuid(val?: string | null): boolean {
  return Boolean(val && UUID_REGEX.test(val))
}

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
    const isParamUuid = isUuid(params.slug)
    const service = await Service.query()
      .where((q) => {
        if (isParamUuid) {
          q.where('id', params.slug).orWhere('slug', params.slug)
        } else {
          q.where('slug', params.slug)
        }
      })
      .preload('faqs', (q) => q.orderBy('sort_order', 'asc'))
      .firstOrFail()

    return response.ok({
      success: true,
      data: service,
    })
  }
}
