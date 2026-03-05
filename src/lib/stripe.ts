/**
 * Stripe webhook signature verification using Web Crypto API (edge-compatible).
 * Does NOT require the Stripe SDK.
 *
 * Implements verification per Stripe docs:
 * https://docs.stripe.com/webhooks#verify-manually
 */

/**
 * Verify Stripe webhook signature using Web Crypto API (edge-compatible).
 * Does NOT require the Stripe SDK.
 *
 * @param payload - Raw request body string
 * @param sigHeader - Value of stripe-signature header
 * @param secret - STRIPE_WEBHOOK_SECRET from env
 * @param toleranceSec - Max age of event in seconds (default 300 = 5 min)
 * @returns true if signature is valid
 */
export async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
  toleranceSec: number = 300
): Promise<boolean> {
  // Step 1: Parse the stripe-signature header
  const parts = sigHeader.split(',')
  const timestamp = parts.find(p => p.startsWith('t='))?.slice(2)
  const signature = parts.find(p => p.startsWith('v1='))?.slice(3)

  if (!timestamp || !signature) return false

  // Step 2: Check timestamp tolerance (prevent replay attacks)
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - parseInt(timestamp)) > toleranceSec) return false

  // Step 3: Construct signed payload and compute HMAC-SHA256
  const signedPayload = `${timestamp}.${payload}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(signedPayload)
  )
  const expected = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  // Step 4: Timing-safe comparison
  return timingSafeEqual(expected, signature)
}

/**
 * Timing-safe string comparison to prevent side-channel attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
