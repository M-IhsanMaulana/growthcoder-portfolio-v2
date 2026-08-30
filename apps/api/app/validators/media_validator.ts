import vine from '@vinejs/vine'

export const uploadMediaValidator = vine.compile(
  vine.object({
    altText: vine.string().trim().maxLength(255).optional().nullable(),
  })
)

export const updateMediaValidator = vine.compile(
  vine.object({
    altText: vine.string().trim().maxLength(255).optional().nullable(),
    fileName: vine.string().trim().minLength(1).maxLength(255).optional(),
  })
)

export const bulkDeleteMediaValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.string().uuid()).minLength(1),
  })
)
