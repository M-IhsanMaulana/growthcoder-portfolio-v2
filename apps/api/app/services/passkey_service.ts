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

function getRpId(): string {
  const envRpId = process.env.RP_ID || env.get('RP_ID')
  if (envRpId && envRpId !== '0.0.0.0' && envRpId !== '127.0.0.1') {
    return envRpId
  }

  const host = env.get('HOST', 'localhost')
  if (host === '0.0.0.0' || host === '127.0.0.1') {
    return 'localhost'
  }
  return host || 'localhost'
}

function getRpName(): string {
  return process.env.RP_NAME || env.get('RP_NAME') || 'GrowthCoder Admin'
}

function getExpectedOrigins(): string[] {
  const origins = new Set<string>([
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://admin.growthcoder.id',
    'https://growthcoder.id',
    'https://www.growthcoder.id',
  ])

  const originEnv = process.env.ORIGIN || env.get('ORIGIN')
  if (originEnv) {
    originEnv.split(',').forEach((o) => origins.add(o.trim()))
  }

  const allowedOrigins = process.env.ALLOWED_ORIGINS || env.get('ALLOWED_ORIGINS')
  if (allowedOrigins) {
    allowedOrigins.split(',').forEach((o) => origins.add(o.trim()))
  }

  const appUrl = env.get('APP_URL')
  if (appUrl) {
    origins.add(appUrl)
  }

  return Array.from(origins).filter(Boolean)
}

export class PasskeyService {
  /**
   * Generate registration options for a given user
   */
  static async getRegistrationOptions(user: User) {
    await user.load('passkeys')

    const userPasskeys = user.passkeys || []
    const rpID = getRpId()
    const rpName = getRpName()

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
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
    const rpID = getRpId()
    const expectedOrigin = getExpectedOrigins()

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
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

    const rpID = getRpId()

    const options = await generateAuthenticationOptions({
      rpID,
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

    const rpID = getRpId()
    const expectedOrigin = getExpectedOrigins()

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
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

