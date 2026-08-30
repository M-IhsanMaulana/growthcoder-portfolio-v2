import vine from '@vinejs/vine'

export const updateSettingValidator = vine.compile(
  vine.object({
    key: vine.string().trim().maxLength(100),
    value: vine.any(),
  })
)

export const updateBulkSettingsValidator = vine.compile(
  vine.object({
    settings: vine.record(vine.any()),
  })
)
