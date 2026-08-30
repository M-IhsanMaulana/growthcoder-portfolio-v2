import type { HttpContext } from '@adonisjs/core/http'
import SiteSetting from '#models/site_setting'
import { updateSettingValidator, updateBulkSettingsValidator } from '#validators/setting_validator'
import { ActivityLogService } from '#services/activity_log_service'
import { CryptoService } from '#services/crypto_service'

export default class SettingsController {
  async index({ response }: HttpContext) {
    const settings = await SiteSetting.all()
    const settingsMap: Record<string, unknown> = {}

    for (const setting of settings) {
      if (
        setting.key === 'telegram' &&
        typeof setting.value === 'object' &&
        setting.value !== null
      ) {
        const telegramVal = { ...(setting.value as Record<string, unknown>) }
        if (telegramVal.botToken) {
          telegramVal.botToken = '••••••••••••••••'
        }
        settingsMap[setting.key] = telegramVal
        continue
      }

      if (setting.key === 'telegram_bot_token' && typeof setting.value === 'string') {
        settingsMap[setting.key] = '••••••••••••••••'
        continue
      }

      settingsMap[setting.key] = setting.value
    }

    return response.ok({
      success: true,
      data: settingsMap,
    })
  }

  async updateSingle(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(updateSettingValidator)

    let value = payload.value

    if (payload.key === 'telegram' && typeof value === 'object' && value !== null) {
      const telegramVal = { ...(value as Record<string, unknown>) }
      if (telegramVal.botToken && telegramVal.botToken !== '••••••••••••••••') {
        telegramVal.botToken = CryptoService.encrypt(String(telegramVal.botToken))
      } else if (telegramVal.botToken === '••••••••••••••••') {
        // Keep existing token
        const existing = await SiteSetting.findBy('key', 'telegram')
        if (existing && typeof existing.value === 'object' && existing.value !== null) {
          telegramVal.botToken = (existing.value as Record<string, unknown>).botToken
        }
      }
      value = telegramVal
    } else if (payload.key === 'telegram_bot_token' && typeof value === 'string') {
      if (value !== '••••••••••••••••') {
        value = CryptoService.encrypt(value)
      } else {
        const existing = await SiteSetting.findBy('key', 'telegram_bot_token')
        if (existing) {
          value = existing.value
        }
      }
    }

    const setting = await SiteSetting.updateOrCreate({ key: payload.key }, { value })

    ActivityLogService.log(ctx, 'setting_change', 'site_setting', setting.id, { key: payload.key })

    return response.ok({
      success: true,
      message: `Pengaturan '${payload.key}' berhasil diperbarui`,
      data: setting,
    })
  }

  async updateBulk(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(updateBulkSettingsValidator)

    for (const [key, val] of Object.entries(payload.settings)) {
      let value = val

      if (key === 'telegram' && typeof value === 'object' && value !== null) {
        const telegramVal = { ...(value as Record<string, unknown>) }
        if (telegramVal.botToken && telegramVal.botToken !== '••••••••••••••••') {
          telegramVal.botToken = CryptoService.encrypt(String(telegramVal.botToken))
        } else if (telegramVal.botToken === '••••••••••••••••') {
          const existing = await SiteSetting.findBy('key', 'telegram')
          if (existing && typeof existing.value === 'object' && existing.value !== null) {
            telegramVal.botToken = (existing.value as Record<string, unknown>).botToken
          }
        }
        value = telegramVal
      } else if (key === 'telegram_bot_token' && typeof value === 'string') {
        if (value !== '••••••••••••••••') {
          value = CryptoService.encrypt(value)
        } else {
          const existing = await SiteSetting.findBy('key', 'telegram_bot_token')
          if (existing) {
            value = existing.value
          }
        }
      }

      await SiteSetting.updateOrCreate({ key }, { value })
    }

    ActivityLogService.log(ctx, 'setting_change', 'site_settings_bulk', null, {
      keys: Object.keys(payload.settings),
    })

    return response.ok({
      success: true,
      message: 'Seluruh pengaturan berhasil diperbarui',
    })
  }

  async testTelegram({ request, response }: HttpContext) {
    const { TelegramService } = await import('#services/telegram_service')
    const botTokenInput = request.input('botToken')
    const chatIdInput = request.input('chatId')

    let botToken = botTokenInput
    let chatId = chatIdInput

    if (!botToken || botToken === '••••••••••••••••' || !chatId) {
      const creds = await TelegramService.getCredentials()
      if (!creds) {
        return response.badRequest({
          success: false,
          message: 'Kredensial Telegram (Bot Token / Chat ID) belum dikonfigurasi.',
        })
      }
      botToken = botToken && botToken !== '••••••••••••••••' ? botToken : creds.botToken
      chatId = chatId || creds.chatId
    }

    const result = await TelegramService.sendTestNotification(botToken, chatId)

    if (!result.success) {
      return response.badRequest({
        success: false,
        message: `Gagal mengirim pesan uji coba: ${result.error}`,
      })
    }

    return response.ok({
      success: true,
      message: 'Notifikasi uji coba Telegram berhasil dikirim!',
      data: result,
    })
  }
}
