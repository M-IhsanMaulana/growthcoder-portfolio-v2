import vine from '@vinejs/vine'

export const expertiseValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(150),
    slug: vine.string().trim().maxLength(180).optional(),
    subtitle: vine.string().trim().maxLength(200),
    description: vine.string().trim(),
    iconSvg: vine.string().trim().optional().nullable(),
    order: vine.number().optional(),
    isFeatured: vine.boolean().optional(),
    techStackIds: vine.array(vine.string().uuid()).optional(),
  })
)

export const reorderExpertiseValidator = vine.compile(
  vine.object({
    items: vine.array(
      vine.object({
        id: vine.string().uuid(),
        order: vine.number(),
      })
    ),
  })
)
