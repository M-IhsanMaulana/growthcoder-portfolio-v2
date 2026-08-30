import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth_validator'
import { ActivityLogService } from '#services/activity_log_service'

export default class AuthController {
  /**
   * Login with email & password, return Access Token
   */
  async login(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(payload.email, payload.password)
    const token = await User.accessTokens.create(user, ['*'], {
      name: request.header('user-agent') || 'Admin Session',
      expiresIn: '30 days',
    })

    ActivityLogService.log(ctx, 'login', 'auth', user.id, { email: user.email })

    return response.ok({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt.toISO(),
          updatedAt: user.updatedAt?.toISO() || user.createdAt.toISO(),
        },
        token: {
          type: 'bearer',
          token: token.value!.release(),
          expiresAt: token.expiresAt?.toISOString(),
        },
      },
    })
  }

  /**
   * Get current authenticated user profile
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.use('api').getUserOrFail()

    return response.ok({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISO(),
        updatedAt: user.updatedAt?.toISO() || user.createdAt.toISO(),
      },
    })
  }

  /**
   * Logout current access token
   */
  async logout(ctx: HttpContext) {
    const { auth, response } = ctx
    const user = auth.use('api').getUserOrFail()

    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    ActivityLogService.log(ctx, 'logout', 'auth', user.id, { email: user.email })

    return response.ok({
      success: true,
      message: 'Logged out successfully',
    })
  }
}
