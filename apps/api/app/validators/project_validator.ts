import vine from '@vinejs/vine'

export const createProjectValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(255),
    slug: vine.string().trim().maxLength(255).optional(),
    excerpt: vine.string().trim(),
    content: vine.string().trim(),
    clientName: vine.string().trim().maxLength(150).optional().nullable(),
    projectYear: vine.number().min(2000).max(2100).optional(),
    coverImage: vine.string().trim(),
    demoUrl: vine.string().trim().url().optional().nullable(),
    repositoryUrl: vine.string().trim().url().optional().nullable(),
    isFeatured: vine.boolean().optional(),
    order: vine.number().optional(),
    categoryId: vine.string().trim().optional().nullable(),
    techStackIds: vine.array(vine.string().trim()).optional(),
    galleries: vine
      .array(
        vine.object({
          imageUrl: vine.string().trim(),
          caption: vine.string().trim().maxLength(255).optional().nullable(),
          sortOrder: vine.number().optional(),
        })
      )
      .optional(),
  })
)

export const updateProjectValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(255).optional(),
    slug: vine.string().trim().maxLength(255).optional(),
    excerpt: vine.string().trim().optional(),
    content: vine.string().trim().optional(),
    clientName: vine.string().trim().maxLength(150).optional().nullable(),
    projectYear: vine.number().min(2000).max(2100).optional(),
    coverImage: vine.string().trim().optional(),
    demoUrl: vine.string().trim().url().optional().nullable(),
    repositoryUrl: vine.string().trim().url().optional().nullable(),
    isFeatured: vine.boolean().optional(),
    order: vine.number().optional(),
    categoryId: vine.string().trim().optional().nullable(),
    techStackIds: vine.array(vine.string().trim()).optional(),
    galleries: vine
      .array(
        vine.object({
          imageUrl: vine.string().trim(),
          caption: vine.string().trim().maxLength(255).optional().nullable(),
          sortOrder: vine.number().optional(),
        })
      )
      .optional(),
  })
)

export const projectCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(150),
    slug: vine.string().trim().maxLength(180).optional(),
    description: vine.string().trim().optional().nullable(),
    order: vine.number().optional(),
  })
)
