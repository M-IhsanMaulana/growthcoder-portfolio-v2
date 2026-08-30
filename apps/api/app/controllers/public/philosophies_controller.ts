import type { HttpContext } from '@adonisjs/core/http'
import Philosophy from '#models/philosophy'

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
}
