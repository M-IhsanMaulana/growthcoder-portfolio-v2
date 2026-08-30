import vine from '@vinejs/vine'

export const createTechStackValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(150),
    slug: vine.string().trim().maxLength(180).optional(),
    iconSvg: vine.string().trim().optional().nullable(),
    category: vine.enum(['frontend', 'backend', 'database', 'devops', 'tools'] as const),
    isFeatured: vine.boolean().optional(),
    level: vine.number().min(0).max(100).optional().nullable(),
    order: vine.number().optional(),
  })
)

export const updateTechStackValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(150).optional(),
    slug: vine.string().trim().maxLength(180).optional(),
    iconSvg: vine.string().trim().optional().nullable(),
    category: vine.enum(['frontend', 'backend', 'database', 'devops', 'tools'] as const).optional(),
    isFeatured: vine.boolean().optional(),
    level: vine.number().min(0).max(100).optional().nullable(),
    order: vine.number().optional(),
  })
)
