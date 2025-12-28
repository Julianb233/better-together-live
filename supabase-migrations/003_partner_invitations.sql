-- Better Together: Partner Invitations Table
-- Date: 2025-12-28
-- CRITICAL: Referenced in /src/api/relationships.ts but missing from schema

-- ============================================================================
-- PARTNER INVITATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_email VARCHAR(255) NOT NULL,
  invite_token TEXT NOT NULL UNIQUE,
  relationship_type VARCHAR(100),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_partner_invitations_inviter ON partner_invitations(inviter_user_id);
CREATE INDEX idx_partner_invitations_token ON partner_invitations(invite_token);
CREATE INDEX idx_partner_invitations_email ON partner_invitations(partner_email);
CREATE INDEX idx_partner_invitations_status ON partner_invitations(status);
CREATE INDEX idx_partner_invitations_created ON partner_invitations(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE partner_invitations ENABLE ROW LEVEL SECURITY;

-- Users can view invitations they sent
CREATE POLICY "Users can view invitations they sent"
ON partner_invitations FOR SELECT
USING (auth.uid() = inviter_user_id);

-- Users can view invitations sent to their email
CREATE POLICY "Users can view invitations sent to them"
ON partner_invitations FOR SELECT
USING (partner_email = (SELECT email FROM users WHERE id = auth.uid()));

-- Users can create invitations
CREATE POLICY "Users can create invitations"
ON partner_invitations FOR INSERT
WITH CHECK (auth.uid() = inviter_user_id);

-- Users can update invitations they sent
CREATE POLICY "Users can update invitations they sent"
ON partner_invitations FOR UPDATE
USING (auth.uid() = inviter_user_id);

-- Users can update invitations sent to their email (for accepting/declining)
CREATE POLICY "Users can update invitations sent to them"
ON partner_invitations FOR UPDATE
USING (partner_email = (SELECT email FROM users WHERE id = auth.uid()));
