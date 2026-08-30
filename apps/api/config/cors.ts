import env from '#start/env'
import { defineConfig } from '@adonisjs/cors'

const allowedOriginsEnv = env.get('ALLOWED_ORIGINS')
const parsedOrigins = allowedOriginsEnv
  ? allowedOriginsEnv
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean)
  : [
      'https://growthcoder.id',
      'https://www.growthcoder.id',
      'https://admin.growthcoder.id',
      'http://localhost:3000',
      'http://localhost:3001',
    ]

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  /**
   * Enable or disable CORS handling globally.
   */
  enabled: env.get('CORS_ENABLED', true),

  /**
   * Allow configured domains in production and local frontend in development.
   */
  origin: parsedOrigins,

  /**
   * HTTP methods accepted for cross-origin requests.
   */
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  /**
   * Reflect request headers by default.
   */
  headers: true,

  /**
   * Response headers exposed to the browser.
   */
  exposeHeaders: ['set-cookie'],

  /**
   * Allow cookies/authorization headers on cross-origin requests.
   */
  credentials: true,

  /**
   * Cache CORS preflight response for N seconds.
   */
  maxAge: 90,
})

export default corsConfig
