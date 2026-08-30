import vine from '@vinejs/vine'

export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().minLength(6),
    newPassword: vine.string().minLength(8),
    newPassword_confirmation: vine.string().minLength(8).sameAs('newPassword'),
  })
)
