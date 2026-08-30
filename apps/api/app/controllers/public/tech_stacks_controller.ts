import type { HttpContext } from '@adonisjs/core/http'
import TechStack from '#models/tech_stack'

export default class TechStacksController {
  async index({ request, response }: HttpContext) {
    const category = request.input('category')
    const isFeatured = request.input('isFeatured')

    const query = TechStack.query().orderBy('order', 'asc').orderBy('name', 'asc')

    if (category) {
      query.where('category', category)
    }

    if (isFeatured !== undefined) {
      query.where('is_featured', isFeatured === 'true' || isFeatured === true)
    }

    const techStacks = await query

    return response.ok({
      success: true,
      data: techStacks,
    })
  }
}
