import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { PasskeyService } from '#services/passkey_service'
import {
  passkeyChallengeValidator,
  verifyPasskeyRegistrationValidator,
  verifyPasskeyAuthenticationValidator,
} from '#validators/auth_validator'
import { ActivityLogService } from '#services/activity_log_service'
import type { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/types'

export default class PasskeyController {
  /**
   * Generate registration challenge options for authenticated user
   */
  async generateRegistrationOptions({ auth, session, response }: HttpContext) {
    const user = auth.use('api').getUserOrFail()
    const options = await PasskeyService.getRegistrationOptions(user)

    session.put('passkey_registration_challenge', options.challenge)

    return response.ok({
      success: true,
      data: options,
    })
  }

  /**
   * Verify registration response and register passkey
   */
  async verifyRegistration(ctx: HttpContext) {
    const { auth, session, request, response } = ctx
    const user = auth.use('api').getUserOrFail()
    const payload = await request.validateUsing(verifyPasskeyRegistrationValidator)

    const expectedChallenge = session.get('passkey_registration_challenge') || payload.challenge
    if (!expectedChallenge) {
      return response.badRequest({
        success: false,
        message: 'Passkey registration challenge expired or not found',
      })
    }

    session.forget('passkey_registration_challenge')

    const passkey = await PasskeyService.verifyRegistration(
      user,
      expectedChallenge,
      payload.response as unknown as RegistrationResponseJSON,
      payload.deviceName
    )

    ActivityLogService.log(ctx, 'create', 'passkey', passkey.id, { deviceName: passkey.deviceName })

    return response.ok({
      success: true,
      message: 'Passkey registered successfully',
      data: passkey,
    })
  }

  /**
   * Generate authentication options for login
   */
  async generateAuthenticationOptions({ request, session, response }: HttpContext) {
    const payload = await request.validateUsing(passkeyChallengeValidator)
    let user: User | undefined

    if (payload.email) {
      user = (await User.findBy('email', payload.email)) || undefined
    }

    const options = await PasskeyService.getAuthenticationOptions(user)
    session.put('passkey_auth_challenge', options.challenge)

    return response.ok({
      success: true,
      data: options,
    })
  }

  /**
   * Verify authentication response and login user
   */
  async verifyAuthentication(ctx: HttpContext) {
    const { session, request, response } = ctx
    const payload = await request.validateUsing(verifyPasskeyAuthenticationValidator)

    const expectedChallenge = session.get('passkey_auth_challenge') || payload.challenge
    if (!expectedChallenge) {
      return response.badRequest({
        success: false,
        message: 'Passkey authentication challenge expired or not found',
      })
    }

    session.forget('passkey_auth_challenge')

    const user = await PasskeyService.verifyAuthentication(
      expectedChallenge,
      payload.response as unknown as AuthenticationResponseJSON
    )

    const token = await User.accessTokens.create(user, ['*'], {
      name: request.header('user-agent') || 'Passkey Session',
      expiresIn: '30 days',
    })

    ActivityLogService.log(ctx, 'login', 'passkey_auth', user.id, { email: user.email })

    return response.ok({
      success: true,
      message: 'Passkey authentication successful',
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
}
