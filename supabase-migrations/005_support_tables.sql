-- Better Together: Support Tables
-- Date: 2025-12-28
-- Password resets, sponsor applications, and push notification device tokens

-- ============================================================================
-- PASSWORD RESET TOKENS
-- ============================================================================

CREATE TABLE IF NOT EXISTS password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_email ON password_resets(email);
CREATE INDEX idx_password_resets_user ON password_resets(user_id);
CREATE INDEX idx_password_resets_expires ON password_resets(expires_at) WHERE used_at IS NULL;

-- ============================================================================
-- SPONSOR APPLICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS sponsor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Company Information
  company_name VARCHAR(255) NOT NULL,
  website_url TEXT,
  industry VARCHAR(100),
  company_size VARCHAR(50) CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '500+')),

  -- Contact Information
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  contact_title VARCHAR(100),

  -- Sponsorship Details
  sponsorship_tier VARCHAR(50) CHECK (sponsorship_tier IN ('bronze', 'silver', 'gold', 'platinum', 'custom')),
  budget_range VARCHAR(100),
  sponsorship_goals TEXT,
  target_audience TEXT,

  -- Application Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
    'pending',
    'under_review',
    'approved',
    'rejected',
    'withdrawn'
  )),

  -- Review Information
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sponsor_applications_status ON sponsor_applications(status, created_at DESC);
CREATE INDEX idx_sponsor_applications_email ON sponsor_applications(contact_email);
CREATE INDEX idx_sponsor_applications_company ON sponsor_applications(company_name);
CREATE INDEX idx_sponsor_applications_reviewed_by ON sponsor_applications(reviewed_by);

-- ============================================================================
-- DEVICE TOKENS (for Push Notifications)
-- ============================================================================

CREATE TABLE IF NOT EXISTS device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Device Information
  token TEXT NOT NULL UNIQUE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  device_name VARCHAR(255),
  device_model VARCHAR(100),
  os_version VARCHAR(50),
  app_version VARCHAR(50),

  -- Token Status
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_device_tokens_user ON device_tokens(user_id);
CREATE INDEX idx_device_tokens_token ON device_tokens(token);
CREATE INDEX idx_device_tokens_platform ON device_tokens(platform);
CREATE INDEX idx_device_tokens_active ON device_tokens(user_id, is_active) WHERE is_active = TRUE;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Password Resets
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own password reset tokens"
ON password_resets FOR SELECT
USING (user_id = auth.uid() OR email = (SELECT email FROM users WHERE id = auth.uid()));

CREATE POLICY "Anyone can create password reset tokens"
ON password_resets FOR INSERT
WITH CHECK (true);

-- Sponsor Applications (Admin-only access)
ALTER TABLE sponsor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit sponsor applications"
ON sponsor_applications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all sponsor applications"
ON sponsor_applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update sponsor applications"
ON sponsor_applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Device Tokens
ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own device tokens"
ON device_tokens FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can register device tokens"
ON device_tokens FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own device tokens"
ON device_tokens FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own device tokens"
ON device_tokens FOR DELETE
USING (user_id = auth.uid());

-- ============================================================================
-- AUTO-UPDATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_sponsor_applications_updated_at
BEFORE UPDATE ON sponsor_applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_tokens_updated_at
BEFORE UPDATE ON device_tokens
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
