import type { HttpContext } from '@adonisjs/core/http'
import Experience from '#models/experience'
import Education from '#models/education'
import Certification from '#models/certification'

export default class ExperiencesController {
  async index({ response }: HttpContext) {
    const experiences = await Experience.query()
      .preload('techStacks')
      .orderBy('order', 'asc')
      .orderBy('start_date', 'desc')
    const educations = await Education.query().orderBy('order', 'asc').orderBy('start_date', 'desc')
    const certifications = await Certification.query()
      .orderBy('order', 'asc')
      .orderBy('issue_date', 'desc')

    return response.ok({
      success: true,
      data: {
        experiences,
        educations,
        certifications,
      },
    })
  }
}
