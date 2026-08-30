import type { HttpContext } from '@adonisjs/core/http'
import WorkflowStep from '#models/workflow_step'
import { workflowStepValidator, workflowReorderValidator } from '#validators/workflow_validator'
import { ActivityLogService } from '#services/activity_log_service'

export default class WorkflowsController {
  async index({ response }: HttpContext) {
    const steps = await WorkflowStep.query().orderBy('order', 'asc').orderBy('created_at', 'asc')

    return response.ok({
      success: true,
      data: steps,
    })
  }

  async show({ params, response }: HttpContext) {
    const step = await WorkflowStep.findOrFail(params.id)

    return response.ok({
      success: true,
      data: step,
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(workflowStepValidator)

    const step = await WorkflowStep.create({
      stepNumber: payload.stepNumber,
      title: payload.title,
      shortTitle: payload.shortTitle,
      description: payload.description,
      activities: payload.activities || [],
      iconSvg: payload.iconSvg || null,
      badgeColor: payload.badgeColor || null,
      order: payload.order ?? 0,
      isActive: payload.isActive ?? true,
    })

    ActivityLogService.log(ctx, 'create', 'workflow_step', step.id, {
      title: step.title,
      stepNumber: step.stepNumber,
    })

    return response.created({
      success: true,
      message: 'Tahapan alur kerja berhasil dibuat',
      data: step,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const step = await WorkflowStep.findOrFail(params.id)
    const payload = await request.validateUsing(workflowStepValidator)

    step.merge({
      stepNumber: payload.stepNumber,
      title: payload.title,
      shortTitle: payload.shortTitle,
      description: payload.description,
      activities: payload.activities !== undefined ? payload.activities : step.activities,
      iconSvg: payload.iconSvg !== undefined ? payload.iconSvg : step.iconSvg,
      badgeColor: payload.badgeColor !== undefined ? payload.badgeColor : step.badgeColor,
      ...(payload.order !== undefined && { order: payload.order }),
      ...(payload.isActive !== undefined && { isActive: payload.isActive }),
    })

    await step.save()

    ActivityLogService.log(ctx, 'update', 'workflow_step', step.id, {
      title: step.title,
      stepNumber: step.stepNumber,
    })

    return response.ok({
      success: true,
      message: 'Tahapan alur kerja berhasil diperbarui',
      data: step,
    })
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    const step = await WorkflowStep.findOrFail(params.id)
    const id = step.id
    const title = step.title

    await step.delete()

    ActivityLogService.log(ctx, 'delete', 'workflow_step', id, { title })

    return response.ok({
      success: true,
      message: 'Tahapan alur kerja berhasil dihapus',
    })
  }

  async reorder(ctx: HttpContext) {
    const { request, response } = ctx
    const { items } = await request.validateUsing(workflowReorderValidator)

    for (const item of items) {
      await WorkflowStep.query().where('id', item.id).update({ order: item.order })
    }

    ActivityLogService.log(ctx, 'update', 'workflow_step', 'bulk', { count: items.length })

    return response.ok({
      success: true,
      message: 'Urutan tahapan berhasil diperbarui',
    })
  }
}
