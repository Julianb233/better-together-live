-- =============================================================================
-- 013: Venue/Sponsor Partnership Portal - Revenue Engine
-- Adds venues, offers, bookings, commissions, campaigns, and analytics
-- =============================================================================

-- Venues: Physical or virtual locations that partner with the platform
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  sponsor_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'dining',
  -- Categories: dining, travel, wellness, entertainment, gifts, activities, cruises, hotels, spas, events, vacation_packages
  subcategory TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  gallery_urls TEXT, -- JSON array of image URLs
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  latitude NUMERIC,
  longitude NUMERIC,
  phone TEXT,
  email TEXT,
  website_url TEXT,
  hours_of_operation TEXT, -- JSON object
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  couple_friendly_rating NUMERIC DEFAULT 0, -- 0-5 rating
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  tier TEXT NOT NULL DEFAULT 'standard' CHECK (tier IN ('standard', 'premium', 'elite')),
  -- standard: basic listing
  -- premium: featured placement + push notifications
  -- elite: homepage takeover + priority everything
  monthly_budget_cents INTEGER DEFAULT 0,
  total_spent_cents INTEGER DEFAULT 0,
  commission_rate NUMERIC DEFAULT 0.15, -- 15% default
  avg_rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venue offers: Deals/packages that sponsors create for couples
CREATE TABLE IF NOT EXISTS venue_offers (
  id TEXT PRIMARY KEY,
  venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  offer_type TEXT NOT NULL DEFAULT 'discount'
    CHECK (offer_type IN ('discount', 'package', 'experience', 'exclusive', 'seasonal')),
  -- discount: % or $ off
  -- package: bundled experience (dinner + show)
  -- experience: unique date activity
  -- exclusive: couples-only deal
  -- seasonal: time-limited campaign
  category TEXT,
  original_price_cents INTEGER,
  offer_price_cents INTEGER,
  discount_percentage NUMERIC,
  commission_rate NUMERIC, -- override venue default if set
  couple_exclusive BOOLEAN DEFAULT TRUE,
  stitch_verified BOOLEAN DEFAULT FALSE,
  max_redemptions INTEGER, -- null = unlimited
  current_redemptions INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  days_available TEXT, -- JSON array: ["monday","friday","saturday"]
  time_restrictions TEXT, -- e.g. "5pm-10pm"
  terms_and_conditions TEXT,
  image_url TEXT,
  tags TEXT, -- JSON array
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings: When couples redeem offers
CREATE TABLE IF NOT EXISTS venue_bookings (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL REFERENCES venue_offers(id),
  venue_id TEXT NOT NULL REFERENCES venues(id),
  user_id TEXT NOT NULL,
  relationship_id TEXT,
  booking_date TIMESTAMPTZ,
  party_size INTEGER DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  amount_cents INTEGER DEFAULT 0,
  commission_cents INTEGER DEFAULT 0,
  commission_rate NUMERIC,
  payment_status TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  stripe_payment_intent_id TEXT,
  special_requests TEXT,
  rating INTEGER, -- 1-5 post-visit
  review_text TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission ledger: Tracks all commission transactions
CREATE TABLE IF NOT EXISTS commission_ledger (
  id TEXT PRIMARY KEY,
  venue_id TEXT NOT NULL REFERENCES venues(id),
  booking_id TEXT REFERENCES venue_bookings(id),
  transaction_type TEXT NOT NULL
    CHECK (transaction_type IN ('commission', 'payout', 'adjustment', 'refund')),
  amount_cents INTEGER NOT NULL,
  balance_cents INTEGER NOT NULL, -- running balance
  description TEXT,
  payout_reference TEXT, -- Stripe transfer ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsored campaigns: Seasonal/branded campaigns
CREATE TABLE IF NOT EXISTS sponsor_campaigns (
  id TEXT PRIMARY KEY,
  venue_id TEXT NOT NULL REFERENCES venues(id),
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL DEFAULT 'seasonal'
    CHECK (campaign_type IN ('seasonal', 'sponsored_package', 'homepage_takeover', 'push_notification', 'discover_featured')),
  description TEXT,
  sponsor_branding TEXT, -- e.g. "Valentine's with [Sponsor Name]"
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  budget_cents INTEGER DEFAULT 0,
  spent_cents INTEGER DEFAULT 0,
  impression_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  target_audience TEXT, -- JSON: age ranges, interests, location
  is_active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_review', 'approved', 'active', 'paused', 'completed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venue analytics: Aggregated daily metrics per venue
CREATE TABLE IF NOT EXISTS venue_analytics (
  id TEXT PRIMARY KEY,
  venue_id TEXT NOT NULL REFERENCES venues(id),
  analytics_date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  offer_views INTEGER DEFAULT 0,
  offer_clicks INTEGER DEFAULT 0,
  bookings INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  revenue_cents INTEGER DEFAULT 0,
  commission_cents INTEGER DEFAULT 0,
  avg_rating NUMERIC,
  unique_couples INTEGER DEFAULT 0,
  -- Demographics (aggregated, anonymized)
  age_18_24 INTEGER DEFAULT 0,
  age_25_34 INTEGER DEFAULT 0,
  age_35_44 INTEGER DEFAULT 0,
  age_45_plus INTEGER DEFAULT 0,
  relationship_dating INTEGER DEFAULT 0,
  relationship_engaged INTEGER DEFAULT 0,
  relationship_married INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(venue_id, analytics_date)
);

-- Sponsor auth: Login credentials for the sponsor portal
CREATE TABLE IF NOT EXISTS sponsor_accounts (
  id TEXT PRIMARY KEY,
  sponsor_application_id TEXT,
  venue_id TEXT REFERENCES venues(id),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'viewer')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_venues_category ON venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_is_featured ON venues(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_venues_is_active ON venues(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_venues_tier ON venues(tier);
CREATE INDEX IF NOT EXISTS idx_venue_offers_venue_id ON venue_offers(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_offers_is_featured ON venue_offers(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_venue_offers_active ON venue_offers(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_venue_bookings_user_id ON venue_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_venue_id ON venue_bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_status ON venue_bookings(status);
CREATE INDEX IF NOT EXISTS idx_commission_ledger_venue_id ON commission_ledger(venue_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_campaigns_venue_id ON sponsor_campaigns(venue_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_campaigns_active ON sponsor_campaigns(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_venue_analytics_venue_date ON venue_analytics(venue_id, analytics_date);
CREATE INDEX IF NOT EXISTS idx_sponsor_accounts_email ON sponsor_accounts(email);

-- RLS Policies
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_accounts ENABLE ROW LEVEL SECURITY;

-- Public can view active venues and offers
CREATE POLICY venues_public_read ON venues FOR SELECT USING (is_active = TRUE);
CREATE POLICY offers_public_read ON venue_offers FOR SELECT USING (is_active = TRUE);

-- Authenticated users can create bookings
CREATE POLICY bookings_user_insert ON venue_bookings FOR INSERT WITH CHECK (TRUE);
CREATE POLICY bookings_user_read ON venue_bookings FOR SELECT USING (TRUE);

-- Service role has full access (used by API)
CREATE POLICY venues_service_all ON venues FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY offers_service_all ON venue_offers FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY bookings_service_all ON venue_bookings FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY commission_service_all ON commission_ledger FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY campaigns_service_all ON sponsor_campaigns FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY analytics_service_all ON venue_analytics FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY accounts_service_all ON sponsor_accounts FOR ALL USING (TRUE) WITH CHECK (TRUE);
