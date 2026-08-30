import vine from '@vinejs/vine'

export const categoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(150),
    slug: vine.string().trim().maxLength(180).optional(),
    description: vine.string().trim().optional().nullable(),
  })
)

export const tagValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(100),
    slug: vine.string().trim().maxLength(120).optional(),
  })
)
