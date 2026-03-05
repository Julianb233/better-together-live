import pino from 'pino'

/**
 * Standalone pino logger for use outside of request context.
 * Use this for startup logging, cron jobs, or anywhere the Hono
 * request context (c.var.logger) is not available.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV !== 'production'
    ? { transport: { target: 'pino-pretty' } }
    : {}),
})
