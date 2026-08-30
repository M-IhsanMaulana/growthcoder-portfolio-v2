import vine from '@vinejs/vine'

export const serviceValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(150),
    slug: vine.string().trim().maxLength(180).optional(),
    iconSvg: vine.string().trim().optional().nullable(),
    shortDescription: vine.string().trim(),
    valueProposition: vine.string().trim(),
    deliverables: vine.array(vine.string().trim()).optional(),
    order: vine.number().optional(),
    isFeatured: vine.boolean().optional(),
    faqs: vine
      .array(
        vine.object({
          question: vine.string().trim(),
          answer: vine.string().trim(),
          sortOrder: vine.number().optional(),
        })
      )
      .optional(),
  })
)

export const philosophyValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(150),
    iconSvg: vine.string().trim().optional().nullable(),
    tagline: vine.string().trim().maxLength(255),
    description: vine.string().trim(),
    order: vine.number().optional(),
  })
)
