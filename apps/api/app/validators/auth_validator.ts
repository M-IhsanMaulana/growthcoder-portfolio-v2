import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    password: vine.string().minLength(6),
  })
)

export const passkeyChallengeValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase().optional(),
  })
)

export const verifyPasskeyRegistrationValidator = vine.compile(
  vine.object({
    response: vine.object({}).allowUnknownProperties(),
    deviceName: vine.string().maxLength(255).optional(),
    challenge: vine.string().optional(),
  })
)

export const verifyPasskeyAuthenticationValidator = vine.compile(
  vine.object({
    response: vine.object({}).allowUnknownProperties(),
    email: vine.string().email().trim().toLowerCase().optional(),
    challenge: vine.string().optional(),
  })
)
