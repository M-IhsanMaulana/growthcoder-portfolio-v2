import vine from '@vinejs/vine'

export const createArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(255),
    slug: vine.string().trim().maxLength(255).optional(),
    excerpt: vine.string().trim(),
    content: vine.string().trim(),
    coverImage: vine.string().trim().optional().nullable(),
    status: vine.enum(['draft', 'published', 'scheduled'] as const).optional(),
    publishedAt: vine.string().trim().optional().nullable(),
    scheduledAt: vine.string().trim().optional().nullable(),
    readingTimeMinutes: vine.number().min(1).optional().nullable(),
    metaTitle: vine.string().trim().maxLength(255).optional().nullable(),
    metaDescription: vine.string().trim().optional().nullable(),
    categoryId: vine.string().trim().optional().nullable(),
    tagIds: vine.array(vine.string().trim()).optional(),
  })
)

export const updateArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(255).optional(),
    slug: vine.string().trim().maxLength(255).optional(),
    excerpt: vine.string().trim().optional(),
    content: vine.string().trim().optional(),
    coverImage: vine.string().trim().optional().nullable(),
    status: vine.enum(['draft', 'published', 'scheduled'] as const).optional(),
    publishedAt: vine.string().trim().optional().nullable(),
    scheduledAt: vine.string().trim().optional().nullable(),
    readingTimeMinutes: vine.number().min(1).optional().nullable(),
    metaTitle: vine.string().trim().maxLength(255).optional().nullable(),
    metaDescription: vine.string().trim().optional().nullable(),
    categoryId: vine.string().trim().optional().nullable(),
    tagIds: vine.array(vine.string().trim()).optional(),
  })
)
