import vine from '@vinejs/vine'

export const publicInboxValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(150),
    email: vine.string().trim().email(),
    subject: vine.string().trim().maxLength(255).optional().nullable(),
    message: vine.string().trim().minLength(5),
    budgetRange: vine.string().trim().maxLength(100).optional().nullable(),
    projectCategory: vine.string().trim().maxLength(100).optional().nullable(),
    honeypot: vine.string().optional(),
  })
)

export const updateInboxStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['unread', 'read', 'replied', 'archived'] as const),
    replyNotes: vine.string().trim().optional().nullable(),
  })
)
