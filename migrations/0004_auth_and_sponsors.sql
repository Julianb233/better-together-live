-- Better Together: Authentication & Sponsor Extensions
-- Password resets and sponsor applications tables

-- Password Resets table - Track password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add password_hash column to users if not exists
-- Note: Run this as separate statement if column already exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Sponsor Applications table - Track partner/sponsor applications
CREATE TABLE IF NOT EXISTS sponsor_applications (
  id TEXT PRIMARY KEY,

  -- Business Information
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  website TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,

  -- Contact Information
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_role TEXT NOT NULL,

  -- Partnership Details
  partnership_type TEXT NOT NULL CHECK(partnership_type IN ('discount', 'experience', 'gift', 'featured')),
  offer_description TEXT NOT NULL,
  target_audience TEXT,
  expected_reach TEXT,

  -- Additional Info
  how_did_you_hear TEXT,
  additional_notes TEXT,

  -- Application Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'under_review', 'approved', 'rejected')),
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Approved Sponsors table - Active sponsor accounts
CREATE TABLE IF NOT EXISTS sponsors (
  id TEXT PRIMARY KEY,
  application_id TEXT UNIQUE,
  user_id TEXT, -- Optional linked user account

  -- Business Info (from approved application)
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  description TEXT,

  -- Contact
  contact_email TEXT NOT NULL,
  contact_phone TEXT,

  -- Location
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Partnership
  partnership_type TEXT NOT NULL,
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,

  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'paused', 'suspended', 'terminated')),
  featured BOOLEAN DEFAULT FALSE,

  -- Stats
  total_bookings INTEGER DEFAULT 0,
  total_revenue_cents INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0.00,

  -- Timestamps
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (application_id) REFERENCES sponsor_applications(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Sponsor Offers table - Deals and offers from sponsors
CREATE TABLE IF NOT EXISTS sponsor_offers (
  id TEXT PRIMARY KEY,
  sponsor_id TEXT NOT NULL,

  -- Offer Details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  offer_type TEXT NOT NULL CHECK(offer_type IN ('discount', 'experience', 'gift', 'bundle')),

  -- Value
  discount_percentage INTEGER, -- For percentage discounts
  discount_amount_cents INTEGER, -- For fixed discounts
  original_price_cents INTEGER,
  offer_price_cents INTEGER,

  -- Availability
  quantity_available INTEGER,
  quantity_used INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,

  -- Restrictions
  minimum_purchase_cents INTEGER,
  maximum_uses_per_user INTEGER DEFAULT 1,
  requires_subscription BOOLEAN DEFAULT FALSE,

  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('draft', 'active', 'paused', 'expired', 'sold_out')),

  -- Stats
  view_count INTEGER DEFAULT 0,
  redemption_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (sponsor_id) REFERENCES sponsors(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON password_resets(expires_at);

CREATE INDEX IF NOT EXISTS idx_sponsor_applications_email ON sponsor_applications(contact_email);
CREATE INDEX IF NOT EXISTS idx_sponsor_applications_status ON sponsor_applications(status);
CREATE INDEX IF NOT EXISTS idx_sponsor_applications_created ON sponsor_applications(created_at);

CREATE INDEX IF NOT EXISTS idx_sponsors_status ON sponsors(status);
CREATE INDEX IF NOT EXISTS idx_sponsors_type ON sponsors(business_type);
CREATE INDEX IF NOT EXISTS idx_sponsors_location ON sponsors(city, state);
CREATE INDEX IF NOT EXISTS idx_sponsors_featured ON sponsors(featured);

CREATE INDEX IF NOT EXISTS idx_sponsor_offers_sponsor ON sponsor_offers(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_offers_status ON sponsor_offers(status);
CREATE INDEX IF NOT EXISTS idx_sponsor_offers_dates ON sponsor_offers(starts_at, ends_at);
