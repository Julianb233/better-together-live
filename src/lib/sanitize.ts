/**
 * XSS prevention utilities for user-generated content.
 * Hono TSX auto-escapes JSX expressions, but we sanitize on INPUT
 * as defense-in-depth for stored content.
 */

/** Encode HTML special characters to prevent XSS */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/** Sanitize plain text input (names, bios, etc.) -- escape + trim */
export function sanitizeTextInput(input: string): string {
  return escapeHtml(input.trim())
}

/** Strip ALL HTML tags, keep only text content */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}
