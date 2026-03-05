import * as Sentry from '@sentry/node'
import type { MiddlewareHandler } from 'hono'

// Initialize Sentry at module scope (only when DSN is configured)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV || 'development',
    tracesSampleRate: process.env.VERCEL_ENV === 'production' ? 0.1 : 1.0,
    sendDefaultPii: false,
  })
}

/**
 * Sentry error-capture middleware for Hono.
 * Wraps request handling in try/catch and captures unhandled exceptions.
 * Gracefully skips when SENTRY_DSN is not configured (dev mode).
 */
export const sentryMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    try {
      await next()
    } catch (error) {
      // Only capture if Sentry is initialized
      if (process.env.SENTRY_DSN) {
        Sentry.captureException(error, {
          extra: {
            method: c.req.method,
            url: c.req.url,
            path: c.req.path,
          },
        })
      }
      // Re-throw so Hono's onError handler still fires
      throw error
    }
  }
}
