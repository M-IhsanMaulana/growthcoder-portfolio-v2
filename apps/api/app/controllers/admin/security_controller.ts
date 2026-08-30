import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import UserPasskey from '#models/user_passkey'
import { ActivityLogService } from '#services/activity_log_service'
import { changePasswordValidator } from '#validators/security_validator'

function parseUserAgent(uaString?: string | null) {
  if (!uaString) {
    return {
      browser: 'Browser Tidak Diketahui',
      os: 'OS Tidak Diketahui',
      deviceType: 'unknown' as const,
    }
  }

  const ua = uaString.toLowerCase()

  // OS Detection
  let os = 'OS Tidak Diketahui'
  let deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown' = 'desktop'

  if (ua.includes('windows phone')) {
    os = 'Windows Phone'
    deviceType = 'mobile'
  } else if (
    ua.includes('windows nt 10.0') ||
    ua.includes('windows 11') ||
    ua.includes('windows nt 11')
  ) {
    os = 'Windows 11 / 10'
  } else if (ua.includes('windows nt 6.3')) {
    os = 'Windows 8.1'
  } else if (ua.includes('windows')) {
    os = 'Windows'
  } else if (ua.includes('android')) {
    os = 'Android'
    deviceType = ua.includes('tablet') || !ua.includes('mobile') ? 'tablet' : 'mobile'
  } else if (ua.includes('iphone')) {
    os = 'iOS (iPhone)'
    deviceType = 'mobile'
  } else if (ua.includes('ipad')) {
    os = 'iPadOS (iPad)'
    deviceType = 'tablet'
  } else if (ua.includes('macintosh') || ua.includes('mac os x')) {
    os = 'macOS'
  } else if (ua.includes('linux')) {
    os = 'Linux'
  }

  // Browser Detection
  let browser = 'Web Browser'
  if (ua.includes('edg/')) {
    browser = 'Microsoft Edge'
  } else if (ua.includes('opr/') || ua.includes('opera')) {
    browser = 'Opera'
  } else if (ua.includes('chrome') && !ua.includes('chromium')) {
    browser = 'Google Chrome'
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Apple Safari'
  } else if (ua.includes('firefox')) {
    browser = 'Mozilla Firefox'
  } else if (ua.includes('postman') || ua.includes('insomnia') || ua.includes('curl')) {
    browser = 'API Client'
  } else if (ua.includes('passkey')) {
    browser = 'Passkey Session'
  }

  return { browser, os, deviceType }
}

export default class AdminSecurityController {
  /**
   * Get all registered passkeys for current authenticated user
   */
  async getPasskeys({ auth, response }: HttpContext) {
    const user = auth.use('api').getUserOrFail()

    const passkeys = await UserPasskey.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')

    const data = passkeys.map((p) => ({
      id: p.id,
      userId: p.userId,
      credentialId: p.credentialId,
      deviceName: p.deviceName || 'Kredensial Biometrik',
      counter: Number(p.counter),
      transports: p.transports ? JSON.parse(p.transports) : [],
      createdAt: p.createdAt.toISO(),
      lastUsedAt: p.lastUsedAt?.toISO() || null,
    }))

    return response.ok({
      success: true,
      data,
    })
  }

  /**
   * Delete / Revoke a registered passkey
   */
  async deletePasskey(ctx: HttpContext) {
    const { auth, params, response } = ctx
    const user = auth.use('api').getUserOrFail()

    const passkey = await UserPasskey.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!passkey) {
      return response.notFound({
        success: false,
        message: 'Passkey tidak ditemukan atau tidak memiliki akses.',
      })
    }

    const deviceName = passkey.deviceName || 'Passkey'
    await passkey.delete()

    ActivityLogService.log(ctx, 'delete', 'passkey', params.id, {
      deviceName,
    })

    return response.ok({
      success: true,
      message: `Passkey "${deviceName}" berhasil dihapus.`,
    })
  }

  /**
   * Get all active sessions for current authenticated user
   */
  async getSessions({ auth, response }: HttpContext) {
    const user = auth.use('api').getUserOrFail()
    const currentTokenId = user.currentAccessToken?.identifier

    const rows = await db
      .from('auth_access_tokens')
      .where('tokenable_id', user.id)
      .orderBy('created_at', 'desc')

    const sessions = rows.map((row) => {
      const uaParsed = parseUserAgent(row.name)
      const isCurrent = Number(row.id) === Number(currentTokenId)

      return {
        id: row.id,
        tokenableId: row.tokenable_id,
        name: row.name,
        browser: uaParsed.browser,
        os: uaParsed.os,
        deviceType: uaParsed.deviceType,
        isCurrent,
        createdAt: row.created_at
          ? new Date(row.created_at).toISOString()
          : new Date().toISOString(),
        lastUsedAt: row.last_used_at ? new Date(row.last_used_at).toISOString() : null,
        expiresAt: row.expires_at ? new Date(row.expires_at).toISOString() : null,
      }
    })

    return response.ok({
      success: true,
      data: sessions,
    })
  }

  /**
   * Revoke a specific active session
   */
  async revokeSession(ctx: HttpContext) {
    const { auth, params, response } = ctx
    const user = auth.use('api').getUserOrFail()

    const sessionRow = await db
      .from('auth_access_tokens')
      .where('id', params.id)
      .where('tokenable_id', user.id)
      .first()

    if (!sessionRow) {
      return response.notFound({
        success: false,
        message: 'Sesi tidak ditemukan atau telah kedaluwarsa.',
      })
    }

    const isCurrent = Number(sessionRow.id) === Number(user.currentAccessToken?.identifier)

    await db
      .from('auth_access_tokens')
      .where('id', params.id)
      .where('tokenable_id', user.id)
      .delete()

    ActivityLogService.log(ctx, 'delete', 'session', String(params.id), {
      sessionName: sessionRow.name,
      isCurrent,
    })

    return response.ok({
      success: true,
      message: isCurrent
        ? 'Sesi saat ini telah dicabut. Anda akan dialihkan ke halaman login.'
        : 'Sesi perangkat berhasil dicabut.',
      data: {
        isCurrent,
      },
    })
  }

  /**
   * Revoke all other active sessions except current
   */
  async revokeOtherSessions(ctx: HttpContext) {
    const { auth, response } = ctx
    const user = auth.use('api').getUserOrFail()
    const currentTokenId = user.currentAccessToken?.identifier

    let query = db.from('auth_access_tokens').where('tokenable_id', user.id)
    if (currentTokenId !== undefined && currentTokenId !== null) {
      query = query.whereNot('id', String(currentTokenId))
    }

    const deletedCount = await query.delete()

    ActivityLogService.log(ctx, 'delete', 'session_all_others', user.id, {
      revokedCount: deletedCount,
    })

    return response.ok({
      success: true,
      message: `Berhasil mencabut ${deletedCount} sesi perangkat lain.`,
      data: {
        revokedCount: deletedCount,
      },
    })
  }

  /**
   * Update password with current password verification
   */
  async updatePassword(ctx: HttpContext) {
    const { auth, request, response } = ctx
    const user = auth.use('api').getUserOrFail()
    const payload = await request.validateUsing(changePasswordValidator)

    // Verify current password
    const isCurrentPasswordValid = await hash.verify(user.password, payload.currentPassword)
    if (!isCurrentPasswordValid) {
      return response.badRequest({
        success: false,
        message: 'Kata sandi saat ini yang Anda masukkan salah. Silakan coba lagi.',
      })
    }

    // Update to new password
    user.password = await hash.make(payload.newPassword)
    await user.save()

    ActivityLogService.log(ctx, 'update', 'password', user.id, {
      email: user.email,
    })

    return response.ok({
      success: true,
      message: 'Kata sandi Anda berhasil diperbarui.',
    })
  }
}
