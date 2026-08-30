import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { loginThrottle, passkeyThrottle, inboxThrottle, publicApiThrottle } from '#start/limiter'

const limitersMap = {
  login: loginThrottle,
  passkey: passkeyThrottle,
  inbox: inboxThrottle,
  public_api: publicApiThrottle,
} as const

export type ThrottleTarget = keyof typeof limitersMap

export default class ThrottleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, name: ThrottleTarget) {
    const limiterHandler = limitersMap[name]
    if (limiterHandler) {
      return limiterHandler(ctx, next)
    }

    return next()
  }
}
