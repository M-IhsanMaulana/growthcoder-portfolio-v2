import SiteSetting from '#models/site_setting'
import { CryptoService } from '#services/crypto_service'
import env from '#start/env'
import type { TelegramLeadNotificationPayload } from '@growthcoder/types'

export interface TelegramCredentials {
  botToken: string
  chatId: string
  isEnabled: boolean
}

export interface TelegramSendResult {
  success: boolean
  messageId?: number
  error?: string
}

function escapeHtml(text?: string | null): string {
  if (!text) return '-'
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export class TelegramService {
  /**
   * Resolve credentials with priority:
   * 1. Decrypted from `site_settings` table (key: 'telegram' or 'telegram_bot_token')
   * 2. Fallback to environment variables (TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID)
   */
  static async getCredentials(): Promise<TelegramCredentials | null> {
    try {
      const telegramSetting = await SiteSetting.findBy('key', 'telegram')
      if (
        telegramSetting &&
        typeof telegramSetting.value === 'object' &&
        telegramSetting.value !== null
      ) {
        const val = telegramSetting.value as Record<string, unknown>
        let rawToken = typeof val.botToken === 'string' ? val.botToken : ''
        const chatId =
          typeof val.adminChatId === 'string'
            ? val.adminChatId
            : typeof val.chatId === 'string'
              ? val.chatId
              : ''
        const isEnabled = val.notifyOnInbox !== false

        if (rawToken) {
          const decryptedToken = CryptoService.decrypt(rawToken)
          if (decryptedToken && chatId) {
            return {
              botToken: decryptedToken,
              chatId,
              isEnabled,
            }
          }
        }
      }

      // Legacy or separate key checks
      const tokenSetting = await SiteSetting.findBy('key', 'telegram_bot_token')
      const chatSetting = await SiteSetting.findBy('key', 'telegram_admin_chat_id')
      if (
        tokenSetting &&
        typeof tokenSetting.value === 'string' &&
        chatSetting &&
        typeof chatSetting.value === 'string'
      ) {
        const decryptedToken = CryptoService.decrypt(tokenSetting.value)
        if (decryptedToken && chatSetting.value) {
          return {
            botToken: decryptedToken,
            chatId: chatSetting.value,
            isEnabled: true,
          }
        }
      }
    } catch (err) {
      console.warn('[TelegramService] Failed to read credentials from database:', err)
    }

    // Fallback to .env
    const envToken = env.get('TELEGRAM_BOT_TOKEN')
    const envChatId = env.get('TELEGRAM_CHAT_ID')

    if (envToken && envChatId) {
      return {
        botToken: envToken,
        chatId: envChatId,
        isEnabled: true,
      }
    }

    return null
  }

  /**
   * Send arbitrary message to Telegram
   */
  static async sendMessage(
    text: string,
    options?: {
      parseMode?: 'HTML' | 'MarkdownV2'
      botToken?: string
      chatId?: string
      disableWebPagePreview?: boolean
    }
  ): Promise<TelegramSendResult> {
    let token = options?.botToken
    let chat = options?.chatId

    if (!token || !chat) {
      const credentials = await this.getCredentials()
      if (!credentials) {
        return {
          success: false,
          error: 'Telegram Bot Token or Chat ID is not configured.',
        }
      }
      token = token || credentials.botToken
      chat = chat || credentials.chatId
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chat,
          text,
          parse_mode: options?.parseMode || 'HTML',
          disable_web_page_preview: options?.disableWebPagePreview ?? true,
        }),
      })

      const data = (await response.json()) as {
        ok: boolean
        result?: { message_id: number }
        description?: string
      }

      if (!response.ok || !data.ok) {
        const errorMsg = data.description || `HTTP ${response.status}: ${response.statusText}`
        console.error('[TelegramService] API error:', errorMsg)
        return { success: false, error: errorMsg }
      }

      return {
        success: true,
        messageId: data.result?.message_id,
      }
    } catch (error: any) {
      console.error('[TelegramService] Network error sending message:', error)
      return {
        success: false,
        error: error.message || 'Unknown network error',
      }
    }
  }

  /**
   * Format and send lead alert message
   */
  static async sendLeadNotification(
    payload: TelegramLeadNotificationPayload
  ): Promise<TelegramSendResult> {
    const creds = await this.getCredentials()
    if (!creds || !creds.isEnabled) {
      return {
        success: false,
        error: !creds
          ? 'Telegram credentials missing'
          : 'Telegram notification is disabled in settings',
      }
    }

    const name = escapeHtml(payload.name)
    const email = escapeHtml(payload.email)
    const subject = escapeHtml(payload.subject || 'Proyek Baru / Inquiry')
    const budget = escapeHtml(payload.budgetRange || 'Tidak ditentukan')
    const category = escapeHtml(payload.projectCategory || 'General Inquiry')
    const message = escapeHtml(payload.message)
    const ip = escapeHtml(payload.ipAddress || '127.0.0.1')
    const time = payload.createdAt || new Date().toISOString()

    const htmlMessage = [
      `🚀 <b>NEW CONTACT LEAD RECEIVED!</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 <b>Sender:</b> <code>${name}</code>`,
      `📧 <b>Email:</b> <a href="mailto:${email}">${email}</a>`,
      `📌 <b>Subject:</b> ${subject}`,
      `💰 <b>Budget Range:</b> <code>${budget}</code>`,
      `🏷️ <b>Category:</b> <code>${category}</code>`,
      `🌐 <b>IP Address:</b> <code>${ip}</code>`,
      `🕒 <b>Timestamp:</b> <i>${time}</i>`,
      ``,
      `💬 <b>Message Content:</b>`,
      `<blockquote>${message}</blockquote>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `<i>Sent automatically via growthcoder.id Notification Engine</i>`,
    ].join('\n')

    return this.sendMessage(htmlMessage, {
      parseMode: 'HTML',
      botToken: creds.botToken,
      chatId: creds.chatId,
    })
  }

  /**
   * Send test ping message from CMS settings
   */
  static async sendTestNotification(botToken: string, chatId: string): Promise<TelegramSendResult> {
    const testMessage = [
      `🔔 <b>TELEGRAM BOT TEST NOTIFICATION</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `✅ <b>Status:</b> Koneksi Berhasil & Aktif!`,
      `🤖 <b>Bot Token:</b> Terverifikasi`,
      `🆔 <b>Admin Chat ID:</b> <code>${chatId}</code>`,
      `🕒 <b>Waktu Uji Coba:</b> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`,
      ``,
      `<i>Pesan ini dikirim untuk memverifikasi integrasi Telegram Bot di portfolio growthcoder.id.</i>`,
    ].join('\n')

    return this.sendMessage(testMessage, {
      parseMode: 'HTML',
      botToken,
      chatId,
    })
  }
}
