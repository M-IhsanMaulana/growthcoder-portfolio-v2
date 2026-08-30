import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'
import env from '#start/env'
import type User from '#models/user'
import UserPasskey from '#models/user_passkey'
import type { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/types'

const RP_NAME = 'GrowthCoder Portfolio'
const RP_ID = env.get('HOST', 'localhost')
const ORIGIN = env.get('APP_URL', 'http://localhost:3333')

export class PasskeyService {
  /**
   * Generate registration options for a given user
   */
  static async getRegistrationOptions(user: User) {
    await user.load('passkeys')

    const userPasskeys = user.passkeys || []

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: new TextEncoder().encode(user.id),
      userName: user.email,
      userDisplayName: user.name,
      attestationType: 'none',
      excludeCredentials: userPasskeys.map((passkey) => ({
        id: passkey.credentialId,
        transports: passkey.transports ? JSON.parse(passkey.transports) : undefined,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    })

    return options
  }

  /**
   * Verify registration response and persist new passkey
   */
  static async verifyRegistration(
    user: User,
    expectedChallenge: string,
    response: RegistrationResponseJSON,
    deviceName?: string
  ) {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: [
        ORIGIN,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
      ],
      expectedRPID: RP_ID,
    })

    if (!verification.verified || !verification.registrationInfo) {
      throw new Error('Passkey registration verification failed')
    }

    const { credential } = verification.registrationInfo
    const publicKeyBase64 = Buffer.from(credential.publicKey).toString('base64')

    const passkey = await UserPasskey.create({
      userId: user.id,
      credentialId: credential.id,
      publicKey: publicKeyBase64,
      counter: credential.counter,
      deviceName: deviceName || 'Biometric Key',
      transports: credential.transports ? JSON.stringify(credential.transports) : null,
    })

    return passkey
  }

  /**
   * Generate authentication challenge options
   */
  static async getAuthenticationOptions(user?: User) {
    let allowCredentials
    if (user) {
      await user.load('passkeys')
      allowCredentials = user.passkeys.map((passkey) => ({
        id: passkey.credentialId,
        transports: passkey.transports ? JSON.parse(passkey.transports) : undefined,
      }))
    }

    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials,
      userVerification: 'preferred',
    })

    return options
  }

  /**
   * Verify authentication challenge response
   */
  static async verifyAuthentication(
    expectedChallenge: string,
    response: AuthenticationResponseJSON
  ) {
    const passkey = await UserPasskey.query()
      .where('credential_id', response.id)
      .preload('user')
      .first()

    if (!passkey) {
      throw new Error('Passkey credential not found')
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: [
        ORIGIN,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
      ],
      expectedRPID: RP_ID,
      credential: {
        id: passkey.credentialId,
        publicKey: Buffer.from(passkey.publicKey, 'base64'),
        counter: Number(passkey.counter),
        transports: passkey.transports ? JSON.parse(passkey.transports) : undefined,
      },
    })

    if (!verification.verified || !verification.authenticationInfo) {
      throw new Error('Passkey authentication verification failed')
    }

    // Update counter and last used at
    passkey.counter = verification.authenticationInfo.newCounter
    if (passkey.$trx) {
      passkey.useTransaction(passkey.$trx)
    }
    await passkey.save()

    return passkey.user
  }
}
