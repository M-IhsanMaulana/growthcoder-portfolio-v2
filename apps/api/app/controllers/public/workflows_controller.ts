import type { HttpContext } from '@adonisjs/core/http'
import WorkflowStep from '#models/workflow_step'

export default class WorkflowsController {
  async index({ response }: HttpContext) {
    const steps = await WorkflowStep.query()
      .where('isActive', true)
      .orderBy('order', 'asc')
      .orderBy('created_at', 'asc')

    return response.ok({
      success: true,
      data: steps,
    })
  }
}
