import type { HttpContext } from '@adonisjs/core/http'
import SiteSetting from '#models/site_setting'

export default class SettingsController {
  async index({ response }: HttpContext) {
    const settings = await SiteSetting.all()
    const settingsMap: Record<string, unknown> = {}

    for (const setting of settings) {
      // Exclude private secrets from public settings response
      if (setting.key === 'telegram') {
        const tel = setting.value as Record<string, unknown>
        settingsMap[setting.key] = {
          notifyOnInbox: tel?.notifyOnInbox ?? false,
          notifyOnPostPublish: tel?.notifyOnPostPublish ?? false,
        }
      } else {
        settingsMap[setting.key] = setting.value
      }
    }

    return response.ok({
      success: true,
      data: settingsMap,
    })
  }
}
