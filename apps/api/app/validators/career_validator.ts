import vine from '@vinejs/vine'

export const experienceValidator = vine.compile(
  vine.object({
    company: vine.string().trim().maxLength(150),
    position: vine.string().trim().maxLength(150),
    location: vine.string().trim().maxLength(150).optional().nullable(),
    employmentType: vine
      .enum(['full-time', 'part-time', 'contract', 'freelance'] as const)
      .optional()
      .nullable(),
    companyLogoUrl: vine.string().trim().optional().nullable(),
    startDate: vine.string().trim(),
    endDate: vine.string().trim().optional().nullable(),
    isCurrent: vine.boolean().optional(),
    description: vine.string().trim(),
    techStackIds: vine.array(vine.string().uuid()).optional(),
    order: vine.number().optional(),
  })
)

export const educationValidator = vine.compile(
  vine.object({
    institution: vine.string().trim().maxLength(150),
    degree: vine.string().trim().maxLength(100),
    fieldOfStudy: vine.string().trim().maxLength(150).optional().nullable(),
    institutionLogoUrl: vine.string().trim().optional().nullable(),
    startDate: vine.string().trim(),
    endDate: vine.string().trim().optional().nullable(),
    isCurrent: vine.boolean().optional(),
    grade: vine.string().trim().maxLength(50).optional().nullable(),
    description: vine.string().trim().optional().nullable(),
    order: vine.number().optional(),
  })
)

export const certificationValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(200),
    issuer: vine.string().trim().maxLength(150),
    issuerLogoUrl: vine.string().trim().optional().nullable(),
    issueDate: vine.string().trim(),
    expirationDate: vine.string().trim().optional().nullable(),
    credentialId: vine.string().trim().maxLength(150).optional().nullable(),
    credentialUrl: vine.string().trim().url().optional().nullable(),
    order: vine.number().optional(),
  })
)

export const reorderCareerValidator = vine.compile(
  vine.object({
    items: vine.array(
      vine.object({
        id: vine.string().uuid(),
        order: vine.number(),
      })
    ),
  })
)
