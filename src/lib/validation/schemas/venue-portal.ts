// Better Together: Venue/Sponsor Portal Validation Schemas

import { z } from 'zod'

// ── Venue Management ──

export const createVenueSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  category: z.enum([
    'dining', 'travel', 'wellness', 'entertainment', 'gifts',
    'activities', 'cruises', 'hotels', 'spas', 'events', 'vacation_packages'
  ]),
  subcategory: z.string().max(100).optional(),
  logoUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  galleryUrls: z.array(z.string().url()).max(10).optional(),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  websiteUrl: z.string().url().optional(),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  tier: z.enum(['standard', 'premium', 'elite']).default('standard'),
})

export const updateVenueSchema = createVenueSchema.partial()

// ── Offers ──

export const createOfferSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  offerType: z.enum(['discount', 'package', 'experience', 'exclusive', 'seasonal']),
  category: z.string().max(100).optional(),
  originalPriceCents: z.number().int().min(0).optional(),
  offerPriceCents: z.number().int().min(0).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  commissionRate: z.number().min(0).max(1).optional(),
  coupleExclusive: z.boolean().default(true),
  maxRedemptions: z.number().int().min(1).optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  daysAvailable: z.array(z.string()).optional(),
  timeRestrictions: z.string().max(100).optional(),
  termsAndConditions: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
})

export const updateOfferSchema = createOfferSchema.partial()

// ── Bookings ──

export const createBookingSchema = z.object({
  offerId: z.string().min(1),
  venueId: z.string().min(1),
  bookingDate: z.string().optional(),
  partySize: z.number().int().min(1).max(20).default(2),
  specialRequests: z.string().max(500).optional(),
})

export const reviewBookingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().max(1000).optional(),
})

// ── Campaigns ──

export const createCampaignSchema = z.object({
  campaignName: z.string().min(1).max(200),
  campaignType: z.enum([
    'seasonal', 'sponsored_package', 'homepage_takeover',
    'push_notification', 'discover_featured'
  ]),
  description: z.string().max(2000).optional(),
  sponsorBranding: z.string().max(200).optional(),
  startDate: z.string(),
  endDate: z.string(),
  budgetCents: z.number().int().min(0).optional(),
  targetAudience: z.object({
    ageRanges: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
  }).optional(),
})

export const updateCampaignSchema = createCampaignSchema.partial()

// ── Sponsor Auth ──

export const sponsorLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const sponsorRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(200),
  applicationId: z.string().optional(),
})

// ── Analytics Query ──

export const analyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
})
