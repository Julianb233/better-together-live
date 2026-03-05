// Better Together: Sponsors Validation Schemas
// Matches fields from src/api/sponsors.ts

import { z } from 'zod'

/** POST /api/sponsors/apply */
export const sponsorApplicationSchema = z.object({
  businessName: z.string().min(1).max(200),
  businessType: z.string().min(1).max(100),
  website: z.string().url().optional(),
  address: z.string().min(1).max(300),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  zipCode: z.string().min(1).max(20),
  contactName: z.string().min(1).max(200),
  contactEmail: z.string().email(),
  contactPhone: z.string().regex(/^[\d\s\-\+\(\)]{10,}$/, 'Invalid phone number format'),
  contactRole: z.string().min(1).max(100),
  partnershipType: z.string().min(1).max(100),
  offerDescription: z.string().min(1).max(2000),
  targetAudience: z.string().max(500).optional(),
  expectedReach: z.string().max(200).optional(),
  howDidYouHear: z.string().max(200).optional(),
  additionalNotes: z.string().max(2000).optional(),
})

/** PUT /api/sponsors/applications/:id/review */
export const reviewApplicationSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
  reviewNotes: z.string().max(2000).optional(),
})

/** GET /api/sponsors/applications - query params */
export const listApplicationsQuerySchema = z.object({
  status: z.enum(['all', 'pending', 'approved', 'rejected']).default('all'),
})
