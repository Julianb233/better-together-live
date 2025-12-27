// Better Together: Sponsor Applications API
// Handles sponsor/partner applications and management

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { generateId, getCurrentDateTime, isValidEmail } from '../utils'

const sponsorsApi = new Hono()

interface SponsorApplication {
  // Business Information
  businessName: string
  businessType: string
  website?: string
  address: string
  city: string
  state: string
  zipCode: string

  // Contact Information
  contactName: string
  contactEmail: string
  contactPhone: string
  contactRole: string

  // Partnership Details
  partnershipType: string
  offerDescription: string
  targetAudience?: string
  expectedReach?: string

  // Additional Info
  howDidYouHear?: string
  additionalNotes?: string
}

// POST /api/sponsors/apply
// Submit a sponsor/partner application
sponsorsApi.post('/apply', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const body: SponsorApplication = await c.req.json()

    // Validate required fields
    const requiredFields = [
      'businessName', 'businessType', 'address', 'city', 'state', 'zipCode',
      'contactName', 'contactEmail', 'contactPhone', 'contactRole',
      'partnershipType', 'offerDescription'
    ]

    for (const field of requiredFields) {
      if (!body[field as keyof SponsorApplication]) {
        return c.json({ error: `${field} is required` }, 400)
      }
    }

    // Validate email
    if (!isValidEmail(body.contactEmail)) {
      return c.json({ error: 'Invalid email format' }, 400)
    }

    // Validate phone (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
    if (!phoneRegex.test(body.contactPhone)) {
      return c.json({ error: 'Invalid phone number format' }, 400)
    }

    // Check if application already exists from this email
    const existingApp = await db.first<{ id: string; status: string }>(
      'SELECT id, status FROM sponsor_applications WHERE contact_email = $1 AND status != $2',
      [body.contactEmail.toLowerCase(), 'rejected']
    )

    if (existingApp) {
      return c.json({
        error: 'An application from this email is already being reviewed',
        applicationId: existingApp.id,
        status: existingApp.status
      }, 409)
    }

    // Create application
    const applicationId = generateId()
    const now = getCurrentDateTime()

    await db.run(`
      INSERT INTO sponsor_applications (
        id, business_name, business_type, website, address, city, state, zip_code,
        contact_name, contact_email, contact_phone, contact_role,
        partnership_type, offer_description, target_audience, expected_reach,
        how_did_you_hear, additional_notes, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'pending', $19, $20)
    `, [
      applicationId,
      body.businessName,
      body.businessType,
      body.website || null,
      body.address,
      body.city,
      body.state,
      body.zipCode,
      body.contactName,
      body.contactEmail.toLowerCase(),
      body.contactPhone,
      body.contactRole,
      body.partnershipType,
      body.offerDescription,
      body.targetAudience || null,
      body.expectedReach || null,
      body.howDidYouHear || null,
      body.additionalNotes || null,
      now,
      now
    ])

    // TODO: Send confirmation email to applicant
    // TODO: Send notification email to admin

    return c.json({
      success: true,
      message: 'Your application has been submitted successfully! We will review it and contact you within 3-5 business days.',
      applicationId
    }, 201)
  } catch (error) {
    console.error('Sponsor application error:', error)
    return c.json({ error: 'Failed to submit application' }, 500)
  }
})

// GET /api/sponsors/application/:id
// Check application status
sponsorsApi.get('/application/:id', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const applicationId = c.req.param('id')

    const application = await db.first<{
      id: string
      business_name: string
      contact_email: string
      status: string
      created_at: string
      reviewed_at: string | null
      review_notes: string | null
    }>(
      `SELECT id, business_name, contact_email, status, created_at, reviewed_at, review_notes
       FROM sponsor_applications WHERE id = $1`,
      [applicationId]
    )

    if (!application) {
      return c.json({ error: 'Application not found' }, 404)
    }

    return c.json({
      applicationId: application.id,
      businessName: application.business_name,
      status: application.status,
      submittedAt: application.created_at,
      reviewedAt: application.reviewed_at,
      reviewNotes: application.status === 'rejected' ? null : application.review_notes
    })
  } catch (error) {
    console.error('Get application status error:', error)
    return c.json({ error: 'Failed to get application status' }, 500)
  }
})

// GET /api/sponsors/categories
// Get available sponsor categories
sponsorsApi.get('/categories', (c: Context) => {
  return c.json({
    categories: [
      { id: 'dining', name: 'Dining & Restaurants', icon: 'fa-utensils' },
      { id: 'travel', name: 'Travel & Hotels', icon: 'fa-plane' },
      { id: 'wellness', name: 'Wellness & Spa', icon: 'fa-spa' },
      { id: 'entertainment', name: 'Entertainment', icon: 'fa-film' },
      { id: 'gifts', name: 'Gifts & Shopping', icon: 'fa-gift' },
      { id: 'activities', name: 'Activities & Adventures', icon: 'fa-hiking' },
      { id: 'services', name: 'Professional Services', icon: 'fa-briefcase' },
      { id: 'other', name: 'Other', icon: 'fa-star' }
    ],
    partnershipTypes: [
      { id: 'discount', name: 'Discount Partner', description: 'Offer exclusive discounts to couples' },
      { id: 'experience', name: 'Experience Partner', description: 'Provide unique date experiences' },
      { id: 'gift', name: 'Gift Partner', description: 'Supply gifts for surprise boxes' },
      { id: 'featured', name: 'Featured Partner', description: 'Premium placement and promotion' }
    ]
  })
})

// Admin endpoints (should be protected with admin auth)

// GET /api/sponsors/applications
// List all applications (admin only)
sponsorsApi.get('/applications', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const status = c.req.query('status') || 'all'
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    let query = `
      SELECT id, business_name, business_type, contact_name, contact_email,
             partnership_type, status, created_at, reviewed_at
      FROM sponsor_applications
    `
    const params: any[] = []

    if (status !== 'all') {
      query += ' WHERE status = $1'
      params.push(status)
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
    params.push(limit, offset)

    const applications = await db.all(query, params)

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM sponsor_applications'
    if (status !== 'all') {
      countQuery += ' WHERE status = $1'
    }
    const countResult = await db.first<{ count: number }>(countQuery, status !== 'all' ? [status] : [])

    return c.json({
      applications,
      pagination: {
        page,
        limit,
        total: countResult?.count || 0,
        totalPages: Math.ceil((countResult?.count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('List applications error:', error)
    return c.json({ error: 'Failed to list applications' }, 500)
  }
})

// PUT /api/sponsors/applications/:id/review
// Review an application (admin only)
sponsorsApi.put('/applications/:id/review', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const applicationId = c.req.param('id')
    const { status, reviewNotes } = await c.req.json()

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400)
    }

    const now = getCurrentDateTime()

    await db.run(`
      UPDATE sponsor_applications
      SET status = $1, review_notes = $2, reviewed_at = $3, updated_at = $4
      WHERE id = $5
    `, [status, reviewNotes || null, now, now, applicationId])

    // TODO: Send email notification to applicant

    return c.json({
      success: true,
      message: `Application ${status}`
    })
  } catch (error) {
    console.error('Review application error:', error)
    return c.json({ error: 'Failed to review application' }, 500)
  }
})

export default sponsorsApi
