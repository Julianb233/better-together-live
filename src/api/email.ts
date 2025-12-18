// Better Together: Email Service
// Handles email sending via Resend API

import { Hono } from 'hono'
import type { Context } from 'hono'

const emailApi = new Hono()

const RESEND_API = 'https://api.resend.com/emails'

interface EmailRequest {
  to: string
  subject: string
  html: string
  text?: string
}

async function sendEmail(request: EmailRequest, apiKey: string) {
  try {
    const response = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Better Together <noreply@better-together.app>',
        to: [request.to],
        subject: request.subject,
        html: request.html,
        text: request.text
      })
    })
    const data = await response.json() as any
    return { success: response.ok, messageId: data.id, error: data.message }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// Email templates
const templates = {
  partnerInvitation: (inviterName: string, inviteUrl: string) => ({
    subject: `${inviterName} invited you to Better Together`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Better Together</h1>
        </div>
        <div style="padding: 40px;">
          <h2>You're Invited!</h2>
          <p><strong>${inviterName}</strong> wants to strengthen your relationship with Better Together - the AI-powered relationship platform.</p>
          <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Accept Invitation</a>
          <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
        </div>
      </div>
    `
  }),

  subscriptionConfirmation: (userName: string, planName: string, price: string) => ({
    subject: `Welcome to ${planName}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Better Together</h1>
        </div>
        <div style="padding: 40px;">
          <h2>Welcome to Premium, ${userName}!</h2>
          <p>Your <strong>${planName}</strong> subscription is now active at ${price}/month.</p>
          <p>You now have access to:</p>
          <ul>
            <li>AI Relationship Coach</li>
            <li>Smart Scheduling</li>
            <li>Advanced Analytics</li>
            <li>All Premium Features</li>
          </ul>
          <a href="https://better-together.app/portal" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Go to Dashboard</a>
        </div>
      </div>
    `
  }),

  passwordReset: (userName: string, resetUrl: string) => ({
    subject: 'Reset your Better Together password',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Better Together</h1>
        </div>
        <div style="padding: 40px;">
          <h2>Reset Your Password</h2>
          <p>Hi ${userName}, we received a request to reset your password.</p>
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
          <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `
  }),

  giftNotification: (recipientName: string, senderName: string, giftType: string) => ({
    subject: `${senderName} sent you a gift!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Better Together</h1>
        </div>
        <div style="padding: 40px; text-align: center;">
          <h2>You Received a Gift!</h2>
          <p style="font-size: 48px; margin: 20px 0;">🎁</p>
          <p>Hi ${recipientName}, <strong>${senderName}</strong> sent you a <strong>${giftType}</strong>!</p>
          <a href="https://better-together.app/portal/gifts" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0;">View Gift</a>
        </div>
      </div>
    `
  }),

  milestoneReminder: (userName: string, partnerName: string, milestone: string, daysUntil: number) => ({
    subject: `Reminder: ${milestone} coming up!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Better Together</h1>
        </div>
        <div style="padding: 40px; text-align: center;">
          <h2>Upcoming Milestone!</h2>
          <p style="font-size: 48px; margin: 20px 0;">🎊</p>
          <p>Hi ${userName}, your <strong>${milestone}</strong> with ${partnerName} is ${daysUntil === 0 ? 'today!' : daysUntil === 1 ? 'tomorrow!' : `in ${daysUntil} days!`}</p>
          <a href="https://better-together.app/portal/suggestions" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Get Ideas</a>
        </div>
      </div>
    `
  })
}

// POST /api/email/invite-partner
emailApi.post('/invite-partner', async (c: Context) => {
  try {
    const { inviterName, partnerEmail, inviteToken } = await c.req.json()
    const apiKey = (c.env as any)?.RESEND_API_KEY

    if (!apiKey) return c.json({ error: 'Email not configured' }, 500)

    const inviteUrl = `https://better-together.app/accept-invite?token=${inviteToken}`
    const template = templates.partnerInvitation(inviterName, inviteUrl)
    const result = await sendEmail({ to: partnerEmail, ...template }, apiKey)

    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Failed to send invitation' }, 500)
  }
})

// POST /api/email/subscription-confirmation
emailApi.post('/subscription-confirmation', async (c: Context) => {
  try {
    const { email, userName, planName, price } = await c.req.json()
    const apiKey = (c.env as any)?.RESEND_API_KEY

    if (!apiKey) return c.json({ error: 'Email not configured' }, 500)

    const template = templates.subscriptionConfirmation(userName, planName, price)
    const result = await sendEmail({ to: email, ...template }, apiKey)

    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Failed to send confirmation' }, 500)
  }
})

// POST /api/email/password-reset
emailApi.post('/password-reset', async (c: Context) => {
  try {
    const { email, userName, resetToken } = await c.req.json()
    const apiKey = (c.env as any)?.RESEND_API_KEY

    if (!apiKey) return c.json({ error: 'Email not configured' }, 500)

    const resetUrl = `https://better-together.app/reset-password?token=${resetToken}`
    const template = templates.passwordReset(userName, resetUrl)
    const result = await sendEmail({ to: email, ...template }, apiKey)

    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Failed to send reset email' }, 500)
  }
})

// POST /api/email/notify-gift
emailApi.post('/notify-gift', async (c: Context) => {
  try {
    const { recipientEmail, recipientName, senderName, giftType } = await c.req.json()
    const apiKey = (c.env as any)?.RESEND_API_KEY

    if (!apiKey) return c.json({ error: 'Email not configured' }, 500)

    const template = templates.giftNotification(recipientName, senderName, giftType)
    const result = await sendEmail({ to: recipientEmail, ...template }, apiKey)

    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Failed to send notification' }, 500)
  }
})

// POST /api/email/milestone-reminder
emailApi.post('/milestone-reminder', async (c: Context) => {
  try {
    const { email, userName, partnerName, milestone, daysUntil } = await c.req.json()
    const apiKey = (c.env as any)?.RESEND_API_KEY

    if (!apiKey) return c.json({ error: 'Email not configured' }, 500)

    const template = templates.milestoneReminder(userName, partnerName, milestone, daysUntil)
    const result = await sendEmail({ to: email, ...template }, apiKey)

    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Failed to send reminder' }, 500)
  }
})

export default emailApi
