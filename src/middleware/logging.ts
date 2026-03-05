import { pinoLogger } from 'hono-pino'
import pino from 'pino'

/**
 * Structured logging middleware using hono-pino.
 * Logs all HTTP requests as structured JSON with method, path, status, duration.
 * Uses pino-pretty in development for readable output.
 */
export const loggingMiddleware = () => {
  return pinoLogger({
    pino: pino({
      level: process.env.LOG_LEVEL || 'info',
      ...(process.env.NODE_ENV !== 'production'
        ? { transport: { target: 'pino-pretty' } }
        : {}),
    }),
  })
}
