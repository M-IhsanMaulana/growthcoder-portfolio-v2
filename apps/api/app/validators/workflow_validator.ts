import vine from '@vinejs/vine'

export const workflowStepValidator = vine.compile(
  vine.object({
    stepNumber: vine.string().trim().maxLength(10),
    title: vine.string().trim().maxLength(200),
    shortTitle: vine.string().trim().maxLength(100),
    description: vine.string().trim(),
    activities: vine.array(vine.string().trim()).optional(),
    iconSvg: vine.string().trim().optional().nullable(),
    badgeColor: vine.string().trim().optional().nullable(),
    order: vine.number().optional(),
    isActive: vine.boolean().optional(),
  })
)

export const workflowReorderValidator = vine.compile(
  vine.object({
    items: vine.array(
      vine.object({
        id: vine.string().uuid(),
        order: vine.number(),
      })
    ),
  })
)
