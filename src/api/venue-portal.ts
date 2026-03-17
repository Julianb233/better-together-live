// Better Together: Venue/Sponsor Partnership Portal API
// Self-serve dashboard for sponsors to manage venues, offers, campaigns, and analytics

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { generateId, getCurrentDateTime } from '../utils'
import { getPaginationParams } from '../lib/pagination'
import { zValidator, zodErrorHandler } from '../lib/validation'
import {
  createVenueSchema,
  updateVenueSchema,
  createOfferSchema,
  updateOfferSchema,
  createBookingSchema,
  reviewBookingSchema,
  createCampaignSchema,
  updateCampaignSchema,
} from '../lib/validation/schemas/venue-portal'

const venuePortalApi = new Hono()

// =============================================================================
// PUBLIC: Browse Venues & Offers (for couples)
// =============================================================================

// GET /api/venues - Browse active venues
venuePortalApi.get('/', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const category = c.req.query('category')
    const city = c.req.query('city')
    const tier = c.req.query('tier')
    const featured = c.req.query('featured')
    const search = c.req.query('q')
    const sortBy = c.req.query('sort') || 'featured'
    const { limit, offset } = getPaginationParams(c)

    let query = supabase
      .from('venues' as any)
      .select('id, name, slug, description, category, subcategory, logo_url, cover_image_url, city, state, price_range, couple_friendly_rating, is_verified, is_featured, tier, avg_rating, review_count, view_count, booking_count')
      .eq('is_active', true)

    if (category) query = query.eq('category', category)
    if (city) query = query.ilike('city', `%${city}%`)
    if (tier) query = query.eq('tier', tier)
    if (featured === 'true') query = query.eq('is_featured', true)
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)

    if (sortBy === 'featured') {
      query = query.order('is_featured', { ascending: false }).order('avg_rating', { ascending: false })
    } else if (sortBy === 'rating') {
      query = query.order('avg_rating', { ascending: false })
    } else if (sortBy === 'popular') {
      query = query.order('booking_count', { ascending: false })
    } else if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false })
    }

    query = query.range(offset, offset + limit - 1)

    const { data: venues, error } = await query
    if (error) throw error

    return c.json({ venues: venues || [] })
  } catch (error) {
    console.error('Browse venues error:', error)
    return c.json({ error: 'Failed to browse venues' }, 500)
  }
})

// GET /api/venues/categories/all - Sponsor categories
venuePortalApi.get('/categories/all', (c: Context) => {
  return c.json({
    categories: [
      { id: 'dining', name: 'Restaurants', icon: 'fa-utensils', description: 'Date night dining' },
      { id: 'cruises', name: 'Cruise Lines', icon: 'fa-ship', description: 'Romantic getaways at sea' },
      { id: 'hotels', name: 'Hotels', icon: 'fa-hotel', description: 'Couples retreats and stays' },
      { id: 'vacation_packages', name: 'Vacation Packages', icon: 'fa-umbrella-beach', description: 'All-inclusive couple trips' },
      { id: 'spas', name: 'Spas', icon: 'fa-spa', description: 'Wellness and relaxation' },
      { id: 'events', name: 'Events', icon: 'fa-calendar-star', description: 'Concerts, shows, experiences' },
      { id: 'gifts', name: 'Gifts', icon: 'fa-gift', description: 'Surprise your partner' },
      { id: 'entertainment', name: 'Entertainment', icon: 'fa-film', description: 'Movies, shows, games' },
      { id: 'activities', name: 'Activities', icon: 'fa-hiking', description: 'Adventures together' },
      { id: 'wellness', name: 'Wellness', icon: 'fa-heart-pulse', description: 'Health and fitness' },
      { id: 'travel', name: 'Travel', icon: 'fa-plane', description: 'Flights and transportation' },
    ],
    tiers: [
      {
        id: 'standard',
        name: 'Standard Partner',
        price: 'Free',
        commission: '15%',
        features: ['Basic listing', 'Offer creation', 'Basic analytics', 'Commission tracking']
      },
      {
        id: 'premium',
        name: 'Premium Partner',
        price: '$499/mo',
        commission: '12%',
        features: ['Featured placement in Discover', 'Push notification sponsorship', 'Detailed demographics', 'Priority support', 'Seasonal campaign access']
      },
      {
        id: 'elite',
        name: 'Elite Partner',
        price: '$1,999/mo',
        commission: '10%',
        features: ['Homepage takeover slots', 'Push notification priority', 'Full demographic data', 'Dedicated account manager', 'Custom campaign design', 'API access']
      },
    ]
  })
})

// GET /api/venues/discover/featured - Featured venues for discover page
venuePortalApi.get('/discover/featured', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)

    const { data: featured, error } = await supabase
      .from('venues' as any)
      .select('id, name, slug, description, category, logo_url, cover_image_url, city, state, price_range, is_verified, tier, avg_rating, review_count')
      .eq('is_active', true)
      .or('is_featured.eq.true,tier.eq.premium,tier.eq.elite')
      .order('tier', { ascending: false })
      .limit(12)

    if (error) throw error

    const { data: sponsoredOffers } = await supabase
      .from('venue_offers' as any)
      .select('id, title, description, offer_type, original_price_cents, offer_price_cents, discount_percentage, couple_exclusive, stitch_verified, image_url, venue_id')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(8)

    const { data: campaigns } = await supabase
      .from('sponsor_campaigns' as any)
      .select('id, campaign_name, campaign_type, description, sponsor_branding')
      .eq('is_active', true)
      .eq('status', 'active')
      .lte('start_date', new Date().toISOString())
      .gte('end_date', new Date().toISOString())
      .limit(4)

    return c.json({
      featuredVenues: featured || [],
      sponsoredOffers: sponsoredOffers || [],
      activeCampaigns: campaigns || [],
    })
  } catch (error) {
    console.error('Discover featured error:', error)
    return c.json({ error: 'Failed to load featured content' }, 500)
  }
})

// GET /api/venues/discover/date-night - Curated date night packages
venuePortalApi.get('/discover/date-night', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const category = c.req.query('category')

    let query = supabase
      .from('venue_offers' as any)
      .select('id, title, description, offer_type, category, original_price_cents, offer_price_cents, discount_percentage, couple_exclusive, stitch_verified, image_url, tags, valid_until, venue_id')
      .eq('is_active', true)
      .in('offer_type', ['package', 'experience', 'exclusive'])
      .order('stitch_verified', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data: packages, error } = await query.limit(20)

    if (error) throw error

    return c.json({ packages: packages || [] })
  } catch (error) {
    console.error('Date night packages error:', error)
    return c.json({ error: 'Failed to load date night packages' }, 500)
  }
})

// GET /api/venues/:slug - Get venue details
venuePortalApi.get('/:slug', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const slug = c.req.param('slug')

    const { data, error } = await supabase
      .from('venues' as any)
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error
    const venue = data as any
    if (!venue) return c.json({ error: 'Venue not found' }, 404)

    const { data: offers } = await supabase
      .from('venue_offers' as any)
      .select('id, title, description, offer_type, category, original_price_cents, offer_price_cents, discount_percentage, couple_exclusive, stitch_verified, valid_from, valid_until, image_url, tags, is_featured')
      .eq('venue_id', venue.id)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })

    // Increment view count
    await supabase
      .from('venues' as any)
      .update({ view_count: (venue.view_count || 0) + 1 } as any)
      .eq('id', venue.id)

    return c.json({ venue, offers: offers || [] })
  } catch (error) {
    console.error('Get venue error:', error)
    return c.json({ error: 'Failed to get venue' }, 500)
  }
})

// =============================================================================
// COUPLE: Book offers
// =============================================================================

// POST /api/venues/book - Create a booking
venuePortalApi.post('/book',
  zValidator('json', createBookingSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const body: any = c.req.valid('json' as never)
      const userId = c.req.header('x-user-id') || ''

      const { data, error: offerErr } = await supabase
        .from('venue_offers' as any)
        .select('*')
        .eq('id', body.offerId)
        .eq('is_active', true)
        .maybeSingle()

      if (offerErr) throw offerErr
      const offer = data as any
      if (!offer) return c.json({ error: 'Offer not found or inactive' }, 404)

      if (offer.max_redemptions && offer.current_redemptions >= offer.max_redemptions) {
        return c.json({ error: 'This offer has reached its maximum redemptions' }, 409)
      }

      const now = new Date()
      if (offer.valid_from && new Date(offer.valid_from) > now) {
        return c.json({ error: 'This offer is not yet active' }, 400)
      }
      if (offer.valid_until && new Date(offer.valid_until) < now) {
        return c.json({ error: 'This offer has expired' }, 400)
      }

      const amountCents = offer.offer_price_cents || offer.original_price_cents || 0
      const commissionRate = offer.commission_rate || 0.15
      const commissionCents = Math.round(amountCents * commissionRate)

      const bookingId = generateId()
      const nowStr = getCurrentDateTime()

      const { error } = await supabase
        .from('venue_bookings' as any)
        .insert({
          id: bookingId,
          offer_id: body.offerId,
          venue_id: body.venueId,
          user_id: userId,
          booking_date: body.bookingDate || nowStr,
          party_size: body.partySize || 2,
          status: 'pending',
          amount_cents: amountCents,
          commission_cents: commissionCents,
          commission_rate: commissionRate,
          payment_status: 'pending',
          special_requests: body.specialRequests || null,
          created_at: nowStr,
          updated_at: nowStr,
        } as any)

      if (error) throw error

      // Increment redemption count
      await supabase
        .from('venue_offers' as any)
        .update({ current_redemptions: (offer.current_redemptions || 0) + 1 } as any)
        .eq('id', body.offerId)

      return c.json({
        success: true,
        bookingId,
        amountCents,
        commissionCents,
        message: 'Booking created successfully'
      }, 201)
    } catch (error) {
      console.error('Create booking error:', error)
      return c.json({ error: 'Failed to create booking' }, 500)
    }
  }
)

// POST /api/venues/bookings/:id/review - Review a completed booking
venuePortalApi.post('/bookings/:id/review',
  zValidator('json', reviewBookingSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const bookingId = c.req.param('id')
      const body: any = c.req.valid('json' as never)
      const now = getCurrentDateTime()

      const { error } = await supabase
        .from('venue_bookings' as any)
        .update({
          rating: body.rating,
          review_text: body.reviewText || null,
          reviewed_at: now,
          updated_at: now,
        } as any)
        .eq('id', bookingId)

      if (error) throw error

      return c.json({ success: true, message: 'Review submitted' })
    } catch (error) {
      console.error('Review booking error:', error)
      return c.json({ error: 'Failed to submit review' }, 500)
    }
  }
)

// =============================================================================
// SPONSOR PORTAL: Venue Management (authenticated sponsor)
// =============================================================================

// POST /api/venues/manage - Create a venue (sponsor self-serve)
venuePortalApi.post('/manage',
  zValidator('json', createVenueSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const body: any = c.req.valid('json' as never)
      const sponsorId = c.req.header('x-sponsor-id') || c.req.header('x-user-id') || ''

      const venueId = generateId()
      const now = getCurrentDateTime()
      const slug = (body.name as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + venueId.slice(0, 8)

      const { error } = await supabase
        .from('venues' as any)
        .insert({
          id: venueId,
          sponsor_id: sponsorId,
          name: body.name,
          slug,
          description: body.description || null,
          category: body.category,
          subcategory: body.subcategory || null,
          logo_url: body.logoUrl || null,
          cover_image_url: body.coverImageUrl || null,
          gallery_urls: body.galleryUrls ? JSON.stringify(body.galleryUrls) : null,
          address: body.address || null,
          city: body.city || null,
          state: body.state || null,
          zip_code: body.zipCode || null,
          phone: body.phone || null,
          email: body.email || null,
          website_url: body.websiteUrl || null,
          price_range: body.priceRange || null,
          tier: body.tier || 'standard',
          commission_rate: body.tier === 'elite' ? 0.10 : body.tier === 'premium' ? 0.12 : 0.15,
          created_at: now,
          updated_at: now,
        } as any)

      if (error) throw error

      return c.json({ success: true, venueId, slug }, 201)
    } catch (error) {
      console.error('Create venue error:', error)
      return c.json({ error: 'Failed to create venue' }, 500)
    }
  }
)

// PUT /api/venues/manage/:id - Update venue
venuePortalApi.put('/manage/:id',
  zValidator('json', updateVenueSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const venueId = c.req.param('id')
      const body: any = c.req.valid('json' as never)
      const now = getCurrentDateTime()

      const updateData: Record<string, unknown> = { updated_at: now }
      if (body.name !== undefined) updateData.name = body.name
      if (body.description !== undefined) updateData.description = body.description
      if (body.category !== undefined) updateData.category = body.category
      if (body.subcategory !== undefined) updateData.subcategory = body.subcategory
      if (body.logoUrl !== undefined) updateData.logo_url = body.logoUrl
      if (body.coverImageUrl !== undefined) updateData.cover_image_url = body.coverImageUrl
      if (body.address !== undefined) updateData.address = body.address
      if (body.city !== undefined) updateData.city = body.city
      if (body.state !== undefined) updateData.state = body.state
      if (body.zipCode !== undefined) updateData.zip_code = body.zipCode
      if (body.phone !== undefined) updateData.phone = body.phone
      if (body.email !== undefined) updateData.email = body.email
      if (body.websiteUrl !== undefined) updateData.website_url = body.websiteUrl
      if (body.priceRange !== undefined) updateData.price_range = body.priceRange

      const { error } = await supabase
        .from('venues' as any)
        .update(updateData as any)
        .eq('id', venueId)

      if (error) throw error

      return c.json({ success: true, message: 'Venue updated' })
    } catch (error) {
      console.error('Update venue error:', error)
      return c.json({ error: 'Failed to update venue' }, 500)
    }
  }
)

// GET /api/venues/manage/:id/dashboard - Sponsor dashboard data
venuePortalApi.get('/manage/:id/dashboard', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const venueId = c.req.param('id')

    const { data: venue, error: venueErr } = await supabase
      .from('venues' as any)
      .select('*')
      .eq('id', venueId)
      .maybeSingle()

    if (venueErr) throw venueErr
    if (!venue) return c.json({ error: 'Venue not found' }, 404)

    const { count: activeOffers } = await supabase
      .from('venue_offers' as any)
      .select('*', { count: 'exact', head: true })
      .eq('venue_id', venueId)
      .eq('is_active', true)

    const { data: recentBookings } = await supabase
      .from('venue_bookings' as any)
      .select('id, status, amount_cents, commission_cents, booking_date, created_at')
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false })
      .limit(10)

    const { data: lastLedger } = await supabase
      .from('commission_ledger' as any)
      .select('balance_cents')
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false })
      .limit(1)

    const { data: activeCampaigns } = await supabase
      .from('sponsor_campaigns' as any)
      .select('id, campaign_name, campaign_type, status, impression_count, click_count, conversion_count')
      .eq('venue_id', venueId)
      .in('status', ['active', 'approved'])

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: analyticsData } = await supabase
      .from('venue_analytics' as any)
      .select('impressions, profile_views, offer_views, offer_clicks, bookings, completed_bookings, revenue_cents, commission_cents, unique_couples')
      .eq('venue_id', venueId)
      .gte('analytics_date', thirtyDaysAgo.toISOString().split('T')[0])

    const summary = {
      totalImpressions: 0,
      totalProfileViews: 0,
      totalOfferViews: 0,
      totalOfferClicks: 0,
      totalBookings: 0,
      totalCompletedBookings: 0,
      totalRevenueCents: 0,
      totalCommissionCents: 0,
      totalUniqueCouples: 0,
    }

    if (analyticsData) {
      for (const day of analyticsData as any[]) {
        summary.totalImpressions += day.impressions || 0
        summary.totalProfileViews += day.profile_views || 0
        summary.totalOfferViews += day.offer_views || 0
        summary.totalOfferClicks += day.offer_clicks || 0
        summary.totalBookings += day.bookings || 0
        summary.totalCompletedBookings += day.completed_bookings || 0
        summary.totalRevenueCents += day.revenue_cents || 0
        summary.totalCommissionCents += day.commission_cents || 0
        summary.totalUniqueCouples += day.unique_couples || 0
      }
    }

    return c.json({
      venue,
      activeOffers: activeOffers || 0,
      recentBookings: recentBookings || [],
      commissionBalance: (lastLedger as any)?.[0]?.balance_cents || 0,
      activeCampaigns: activeCampaigns || [],
      analytics30Day: summary,
    })
  } catch (error) {
    console.error('Sponsor dashboard error:', error)
    return c.json({ error: 'Failed to load dashboard' }, 500)
  }
})

// =============================================================================
// SPONSOR PORTAL: Offer Management
// =============================================================================

// GET /api/venues/manage/:venueId/offers - List venue offers
venuePortalApi.get('/manage/:venueId/offers', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const venueId = c.req.param('venueId')
    const { limit, offset } = getPaginationParams(c)

    const { data: offers, error } = await supabase
      .from('venue_offers' as any)
      .select('*')
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return c.json({ offers: offers || [] })
  } catch (error) {
    console.error('List offers error:', error)
    return c.json({ error: 'Failed to list offers' }, 500)
  }
})

// POST /api/venues/manage/:venueId/offers - Create offer
venuePortalApi.post('/manage/:venueId/offers',
  zValidator('json', createOfferSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const venueId = c.req.param('venueId')
      const body: any = c.req.valid('json' as never)
      const now = getCurrentDateTime()
      const offerId = generateId()

      const { error } = await supabase
        .from('venue_offers' as any)
        .insert({
          id: offerId,
          venue_id: venueId,
          title: body.title,
          description: body.description || null,
          offer_type: body.offerType,
          category: body.category || null,
          original_price_cents: body.originalPriceCents || null,
          offer_price_cents: body.offerPriceCents || null,
          discount_percentage: body.discountPercentage || null,
          commission_rate: body.commissionRate || null,
          couple_exclusive: body.coupleExclusive ?? true,
          max_redemptions: body.maxRedemptions || null,
          valid_from: body.validFrom || null,
          valid_until: body.validUntil || null,
          days_available: body.daysAvailable ? JSON.stringify(body.daysAvailable) : null,
          time_restrictions: body.timeRestrictions || null,
          terms_and_conditions: body.termsAndConditions || null,
          image_url: body.imageUrl || null,
          tags: body.tags ? JSON.stringify(body.tags) : null,
          is_active: true,
          created_at: now,
          updated_at: now,
        } as any)

      if (error) throw error

      return c.json({ success: true, offerId }, 201)
    } catch (error) {
      console.error('Create offer error:', error)
      return c.json({ error: 'Failed to create offer' }, 500)
    }
  }
)

// PUT /api/venues/manage/:venueId/offers/:offerId - Update offer
venuePortalApi.put('/manage/:venueId/offers/:offerId',
  zValidator('json', updateOfferSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const offerId = c.req.param('offerId')
      const body: any = c.req.valid('json' as never)
      const now = getCurrentDateTime()

      const updateData: Record<string, unknown> = { updated_at: now }
      if (body.title !== undefined) updateData.title = body.title
      if (body.description !== undefined) updateData.description = body.description
      if (body.offerType !== undefined) updateData.offer_type = body.offerType
      if (body.originalPriceCents !== undefined) updateData.original_price_cents = body.originalPriceCents
      if (body.offerPriceCents !== undefined) updateData.offer_price_cents = body.offerPriceCents
      if (body.discountPercentage !== undefined) updateData.discount_percentage = body.discountPercentage
      if (body.coupleExclusive !== undefined) updateData.couple_exclusive = body.coupleExclusive
      if (body.maxRedemptions !== undefined) updateData.max_redemptions = body.maxRedemptions
      if (body.validFrom !== undefined) updateData.valid_from = body.validFrom
      if (body.validUntil !== undefined) updateData.valid_until = body.validUntil
      if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl
      if (body.tags !== undefined) updateData.tags = JSON.stringify(body.tags)

      const { error } = await supabase
        .from('venue_offers' as any)
        .update(updateData as any)
        .eq('id', offerId)

      if (error) throw error

      return c.json({ success: true, message: 'Offer updated' })
    } catch (error) {
      console.error('Update offer error:', error)
      return c.json({ error: 'Failed to update offer' }, 500)
    }
  }
)

// DELETE /api/venues/manage/:venueId/offers/:offerId - Deactivate offer
venuePortalApi.delete('/manage/:venueId/offers/:offerId', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const offerId = c.req.param('offerId')

    const { error } = await supabase
      .from('venue_offers' as any)
      .update({ is_active: false, updated_at: getCurrentDateTime() } as any)
      .eq('id', offerId)

    if (error) throw error

    return c.json({ success: true, message: 'Offer deactivated' })
  } catch (error) {
    console.error('Delete offer error:', error)
    return c.json({ error: 'Failed to deactivate offer' }, 500)
  }
})

// =============================================================================
// SPONSOR PORTAL: Campaign Management
// =============================================================================

// GET /api/venues/manage/:venueId/campaigns - List campaigns
venuePortalApi.get('/manage/:venueId/campaigns', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const venueId = c.req.param('venueId')

    const { data: campaigns, error } = await supabase
      .from('sponsor_campaigns' as any)
      .select('*')
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return c.json({ campaigns: campaigns || [] })
  } catch (error) {
    console.error('List campaigns error:', error)
    return c.json({ error: 'Failed to list campaigns' }, 500)
  }
})

// POST /api/venues/manage/:venueId/campaigns - Create campaign
venuePortalApi.post('/manage/:venueId/campaigns',
  zValidator('json', createCampaignSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const venueId = c.req.param('venueId')
      const body: any = c.req.valid('json' as never)
      const now = getCurrentDateTime()
      const campaignId = generateId()

      const { error } = await supabase
        .from('sponsor_campaigns' as any)
        .insert({
          id: campaignId,
          venue_id: venueId,
          campaign_name: body.campaignName,
          campaign_type: body.campaignType,
          description: body.description || null,
          sponsor_branding: body.sponsorBranding || null,
          start_date: body.startDate,
          end_date: body.endDate,
          budget_cents: body.budgetCents || 0,
          target_audience: body.targetAudience ? JSON.stringify(body.targetAudience) : null,
          status: 'pending_review',
          created_at: now,
          updated_at: now,
        } as any)

      if (error) throw error

      return c.json({ success: true, campaignId }, 201)
    } catch (error) {
      console.error('Create campaign error:', error)
      return c.json({ error: 'Failed to create campaign' }, 500)
    }
  }
)

// =============================================================================
// SPONSOR PORTAL: Analytics & Demographics
// =============================================================================

// GET /api/venues/manage/:venueId/analytics - Venue analytics
venuePortalApi.get('/manage/:venueId/analytics', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const venueId = c.req.param('venueId')
    const startDate = c.req.query('startDate') || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
    const endDate = c.req.query('endDate') || new Date().toISOString().split('T')[0]

    const { data: analytics, error } = await supabase
      .from('venue_analytics' as any)
      .select('*')
      .eq('venue_id', venueId)
      .gte('analytics_date', startDate)
      .lte('analytics_date', endDate)
      .order('analytics_date', { ascending: true })

    if (error) throw error

    const totals = {
      impressions: 0,
      profileViews: 0,
      offerViews: 0,
      offerClicks: 0,
      bookings: 0,
      completedBookings: 0,
      revenueCents: 0,
      commissionCents: 0,
      uniqueCouples: 0,
    }

    const demographics = {
      age18_24: 0,
      age25_34: 0,
      age35_44: 0,
      age45Plus: 0,
      relationshipDating: 0,
      relationshipEngaged: 0,
      relationshipMarried: 0,
    }

    if (analytics) {
      for (const day of analytics as any[]) {
        totals.impressions += day.impressions || 0
        totals.profileViews += day.profile_views || 0
        totals.offerViews += day.offer_views || 0
        totals.offerClicks += day.offer_clicks || 0
        totals.bookings += day.bookings || 0
        totals.completedBookings += day.completed_bookings || 0
        totals.revenueCents += day.revenue_cents || 0
        totals.commissionCents += day.commission_cents || 0
        totals.uniqueCouples += day.unique_couples || 0
        demographics.age18_24 += day.age_18_24 || 0
        demographics.age25_34 += day.age_25_34 || 0
        demographics.age35_44 += day.age_35_44 || 0
        demographics.age45Plus += day.age_45_plus || 0
        demographics.relationshipDating += day.relationship_dating || 0
        demographics.relationshipEngaged += day.relationship_engaged || 0
        demographics.relationshipMarried += day.relationship_married || 0
      }
    }

    const clickThroughRate = totals.impressions > 0
      ? ((totals.offerClicks / totals.impressions) * 100).toFixed(2)
      : '0.00'
    const bookingConversionRate = totals.offerClicks > 0
      ? ((totals.bookings / totals.offerClicks) * 100).toFixed(2)
      : '0.00'

    return c.json({
      daily: analytics || [],
      totals,
      demographics,
      rates: {
        clickThroughRate: `${clickThroughRate}%`,
        bookingConversionRate: `${bookingConversionRate}%`,
      },
      roi: {
        totalRevenueCents: totals.revenueCents,
        totalCommissionCents: totals.commissionCents,
        netRevenueCents: totals.revenueCents - totals.commissionCents,
      }
    })
  } catch (error) {
    console.error('Venue analytics error:', error)
    return c.json({ error: 'Failed to load analytics' }, 500)
  }
})

// GET /api/venues/manage/:venueId/commissions - Commission ledger
venuePortalApi.get('/manage/:venueId/commissions', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const venueId = c.req.param('venueId')
    const { limit, offset } = getPaginationParams(c)

    const { data: ledger, error } = await supabase
      .from('commission_ledger' as any)
      .select('*')
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    const { data: balance } = await supabase
      .from('commission_ledger' as any)
      .select('balance_cents')
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false })
      .limit(1)

    return c.json({
      ledger: ledger || [],
      currentBalanceCents: (balance as any)?.[0]?.balance_cents || 0,
    })
  } catch (error) {
    console.error('Commission ledger error:', error)
    return c.json({ error: 'Failed to load commissions' }, 500)
  }
})

export default venuePortalApi
