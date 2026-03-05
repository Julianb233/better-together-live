// Better Together: Sponsor Applications API
// Handles sponsor/partner applications and management

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { generateId, getCurrentDateTime } from '../utils'
import { getPaginationParams } from '../lib/pagination'
import { zValidator, zodErrorHandler } from '../lib/validation'
import { sponsorApplicationSchema, reviewApplicationSchema, listApplicationsQuerySchema } from '../lib/validation/schemas/sponsors'

const sponsorsApi = new Hono()

// POST /api/sponsors/apply
// Submit a sponsor/partner application
sponsorsApi.post('/apply',
  zValidator('json', sponsorApplicationSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const body = c.req.valid('json' as never)

      // Check if application already exists from this email
      const { data: existingApp, error: checkError } = await supabase
        .from('sponsor_applications')
        .select('id, status')
        .eq('contact_email', body.contactEmail.toLowerCase())
        .neq('status', 'rejected')
        .maybeSingle()

      if (checkError) throw checkError

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

      const { error } = await supabase
        .from('sponsor_applications')
        .insert({
          id: applicationId,
          business_name: body.businessName,
          business_type: body.businessType,
          website: body.website || null,
          address: body.address,
          city: body.city,
          state: body.state,
          zip_code: body.zipCode,
          contact_name: body.contactName,
          contact_email: body.contactEmail.toLowerCase(),
          contact_phone: body.contactPhone,
          contact_role: body.contactRole,
          partnership_type: body.partnershipType,
          offer_description: body.offerDescription,
          target_audience: body.targetAudience || null,
          expected_reach: body.expectedReach || null,
          how_did_you_hear: body.howDidYouHear || null,
          additional_notes: body.additionalNotes || null,
          status: 'pending',
          created_at: now,
          updated_at: now
        })

      if (error) throw error

      return c.json({
        success: true,
        message: 'Your application has been submitted successfully! We will review it and contact you within 3-5 business days.',
        applicationId
      }, 201)
    } catch (error) {
      console.error('Sponsor application error:', error)
      return c.json({ error: 'Failed to submit application' }, 500)
    }
  }
)

// GET /api/sponsors/application/:id
// Check application status
sponsorsApi.get('/application/:id', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const applicationId = c.req.param('id')

    const { data: application, error } = await supabase
      .from('sponsor_applications')
      .select('id, business_name, contact_email, status, created_at, reviewed_at, review_notes')
      .eq('id', applicationId)
      .maybeSingle()

    if (error) throw error

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
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const status = c.req.query('status') || 'all'
    const { limit, offset } = getPaginationParams(c)

    let query = supabase
      .from('sponsor_applications')
      .select('id, business_name, business_type, contact_name, contact_email, partnership_type, status, created_at, reviewed_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: applications, error } = await query

    if (error) throw error

    // Get total count
    let countQuery = supabase
      .from('sponsor_applications')
      .select('*', { count: 'exact', head: true })

    if (status !== 'all') {
      countQuery = countQuery.eq('status', status)
    }

    const { count, error: countError } = await countQuery

    if (countError) throw countError

    const page = Math.floor(offset / limit) + 1

    return c.json({
      applications,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('List applications error:', error)
    return c.json({ error: 'Failed to list applications' }, 500)
  }
})

// PUT /api/sponsors/applications/:id/review
// Review an application (admin only)
sponsorsApi.put('/applications/:id/review',
  zValidator('json', reviewApplicationSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const applicationId = c.req.param('id')
      const { status, reviewNotes } = c.req.valid('json' as never)

      const now = getCurrentDateTime()

      const { error } = await supabase
        .from('sponsor_applications')
        .update({
          status,
          review_notes: reviewNotes || null,
          reviewed_at: now,
          updated_at: now
        })
        .eq('id', applicationId)

      if (error) throw error

      return c.json({
        success: true,
        message: `Application ${status}`
      })
    } catch (error) {
      console.error('Review application error:', error)
      return c.json({ error: 'Failed to review application' }, 500)
    }
  }
)

export default sponsorsApi
