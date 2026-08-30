import type { HttpContext } from '@adonisjs/core/http'
import Expertise from '#models/expertise'

export default class ExpertisesController {
  async index({ response }: HttpContext) {
    const expertises = await Expertise.query()
      .where('is_featured', true)
      .preload('techStacks', (q) => {
        q.orderBy('order', 'asc')
      })
      .orderBy('order', 'asc')
      .orderBy('created_at', 'asc')

    return response.ok({
      success: true,
      data: expertises,
    })
  }
}
