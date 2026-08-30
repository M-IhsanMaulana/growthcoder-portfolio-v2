import limiter from '@adonisjs/limiter/services/main'

/**
 * Throttle login attempts to prevent brute-force attacks.
 * Max 5 attempts per 1 minute per IP + email combination.
 */
export const loginThrottle = limiter.define('login', (ctx) => {
  const ip = ctx.request.ip()
  const email = ctx.request.input('email', 'anonymous')
  return limiter
    .allowRequests(5)
    .every('1 minute')
    .usingKey(`login_${ip}_${email}`)
    .blockFor('5 minutes')
})

/**
 * Throttle Passkey / WebAuthn verification requests.
 * Max 5 attempts per 1 minute per IP.
 */
export const passkeyThrottle = limiter.define('passkey', (ctx) => {
  const ip = ctx.request.ip()
  return limiter.allowRequests(5).every('1 minute').usingKey(`passkey_${ip}`).blockFor('5 minutes')
})

/**
 * Throttle Contact Form submissions to prevent spam.
 * Max 3 submissions per 10 minutes per IP.
 */
export const inboxThrottle = limiter.define('inbox', (ctx) => {
  const ip = ctx.request.ip()
  return limiter.allowRequests(3).every('10 minutes').usingKey(`inbox_${ip}`).blockFor('15 minutes')
})

/**
 * Global rate limiter for public read-only API endpoints.
 * Max 120 requests per 1 minute per IP.
 */
export const publicApiThrottle = limiter.define('public_api', (ctx) => {
  const ip = ctx.request.ip()
  return limiter.allowRequests(120).every('1 minute').usingKey(`pub_${ip}`)
})
