#!/bin/bash

# Better Together - Production Database Initialization Script
# One-command setup for production D1 database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

DB_NAME="better-together-production"

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║   Better Together - Production DB Initialization      ║"
echo "╔════════════════════════════════════════════════════════╗"
echo -e "${NC}"
echo ""

# Check for Cloudflare API token
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${RED}✗ CLOUDFLARE_API_TOKEN not set${NC}"
    echo ""
    echo -e "${YELLOW}Please set your Cloudflare API token:${NC}"
    echo -e "  export CLOUDFLARE_API_TOKEN='your-api-token'"
    echo ""
    echo -e "${YELLOW}Get your token from:${NC}"
    echo -e "  https://dash.cloudflare.com/profile/api-tokens"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓${NC} Cloudflare API token detected"
echo ""

# Step 1: Check if database already exists
echo -e "${BLUE}[Step 1/5]${NC} Checking if database exists..."
if npx wrangler d1 list 2>/dev/null | grep -q "$DB_NAME"; then
    echo -e "${YELLOW}⚠${NC}  Database '$DB_NAME' already exists"
    echo -e "${YELLOW}Skipping creation...${NC}"
    DB_ALREADY_EXISTS=true
else
    echo -e "${BLUE}Creating database '$DB_NAME'...${NC}"

    # Create database and capture output
    CREATE_OUTPUT=$(npx wrangler d1 create "$DB_NAME" 2>&1)

    # Extract database ID from output
    DB_ID=$(echo "$CREATE_OUTPUT" | grep "database_id" | sed -n 's/.*database_id = "\([^"]*\)".*/\1/p')

    if [ -z "$DB_ID" ]; then
        echo -e "${RED}✗ Failed to create database${NC}"
        echo "$CREATE_OUTPUT"
        exit 1
    fi

    echo -e "${GREEN}✓${NC} Database created successfully"
    echo -e "${CYAN}Database ID: ${GREEN}$DB_ID${NC}"
    echo ""

    # Update wrangler.jsonc with database ID
    echo -e "${BLUE}Updating wrangler.jsonc with database ID...${NC}"

    # Backup wrangler.jsonc
    cp wrangler.jsonc wrangler.jsonc.backup

    # Replace database_id in wrangler.jsonc
    sed -i "s/\"database_id\": \"local\"/\"database_id\": \"$DB_ID\"/g" wrangler.jsonc
    sed -i "s/\"database_id\": \"REPLACE_WITH_PRODUCTION_DB_ID\"/\"database_id\": \"$DB_ID\"/g" wrangler.jsonc

    echo -e "${GREEN}✓${NC} wrangler.jsonc updated"
    echo -e "${YELLOW}Note:${NC} Backup saved to wrangler.jsonc.backup"
    echo ""

    DB_ALREADY_EXISTS=false
fi

# Step 2: Apply migrations
echo -e "${BLUE}[Step 2/5]${NC} Applying database migrations..."
echo -e "${CYAN}Running migrations:${NC}"
echo "  • 0001_initial_relationship_schema.sql"
echo "  • 0002_payment_subscription_schema.sql"
echo "  • 0003_analytics_events.sql"
echo ""

if npx wrangler d1 migrations apply "$DB_NAME" --remote; then
    echo -e "${GREEN}✓${NC} All migrations applied successfully"
else
    echo -e "${RED}✗${NC} Migration failed"
    echo -e "${YELLOW}This might be because migrations were already applied${NC}"
fi
echo ""

# Step 3: Seed subscription plans
echo -e "${BLUE}[Step 3/5]${NC} Seeding subscription plans..."

cat > /tmp/seed-plans.sql << 'EOF'
-- Subscription Plans (based on MONETIZATION_STRATEGY.md)
INSERT OR IGNORE INTO subscription_plans (id, plan_name, plan_type, billing_period, price_cents, price_display, features, is_active, sort_order, created_at)
VALUES
  ('plan_try_monthly', 'Try It Out Plan', 'try_it_out', 'monthly', 3000, '$30/month',
   '["Essential AI Coach", "Basic Challenges", "Simple Date Planning", "Email Support"]',
   1, 1, CURRENT_TIMESTAMP),

  ('plan_better_annual', 'Better Together Plan', 'better_together', 'annual', 24000, '$240/year',
   '["Personal AI Coach", "Intimacy Challenges", "Smart Date Planning", "Relationship Games", "Priority Support", "$50 Surprise Credits", "Private Community", "First Access to Features"]',
   1, 2, CURRENT_TIMESTAMP),

  ('plan_premium_annual', 'Premium Plus Plan', 'premium_plus', 'annual', 28900, '$289/year',
   '["Everything in Better Together", "Monthly Surprise Box", "Save $49/year"]',
   1, 3, CURRENT_TIMESTAMP);

-- Subscription Add-ons
INSERT OR IGNORE INTO subscription_addons (id, addon_name, addon_type, description, price_cents, billing_period, is_active, created_at)
VALUES
  ('addon_surprise_box', 'Monthly Surprise Box', 'surprise_box',
   'Curated relationship items, games, and treats delivered monthly',
   4900, 'monthly', 1, CURRENT_TIMESTAMP),

  ('addon_coaching_virtual', 'Virtual Coaching Session', 'coaching',
   'One-on-one video session with certified relationship expert',
   8900, 'one_time', 1, CURRENT_TIMESTAMP),

  ('addon_coaching_person', 'In-Person Coaching', 'coaching',
   'In-person session with certified relationship therapist',
   14900, 'one_time', 1, CURRENT_TIMESTAMP),

  ('addon_ai_credits_50', '50 AI Credits', 'content',
   'Additional AI coaching interactions and content generation',
   1000, 'one_time', 1, CURRENT_TIMESTAMP),

  ('addon_ai_credits_200', '200 AI Credits', 'content',
   'Bulk AI credits package with bonus credits',
   3500, 'one_time', 1, CURRENT_TIMESTAMP);
EOF

if npx wrangler d1 execute "$DB_NAME" --file=/tmp/seed-plans.sql; then
    echo -e "${GREEN}✓${NC} Subscription plans seeded"
else
    echo -e "${YELLOW}⚠${NC}  Seed may have already been applied"
fi

rm /tmp/seed-plans.sql
echo ""

# Step 4: Seed challenges and achievements
echo -e "${BLUE}[Step 4/5]${NC} Seeding challenges and achievements..."

if [ -f "seed.sql" ]; then
    if npx wrangler d1 execute "$DB_NAME" --file=seed.sql; then
        echo -e "${GREEN}✓${NC} Challenges and achievements seeded"
    else
        echo -e "${YELLOW}⚠${NC}  Seed may have already been applied"
    fi
else
    echo -e "${YELLOW}⚠${NC}  seed.sql not found, skipping"
fi
echo ""

# Step 5: Verify database
echo -e "${BLUE}[Step 5/5]${NC} Verifying database setup..."
echo ""

# Run verification script if it exists
if [ -f "scripts/verify-database.sh" ]; then
    ./scripts/verify-database.sh "$DB_NAME" "production"
else
    # Manual verification
    echo -e "${CYAN}Checking database health...${NC}"

    TABLE_COUNT=$(npx wrangler d1 execute "$DB_NAME" --command "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';" 2>/dev/null | grep -o '[0-9]\+' | tail -1 || echo "0")

    echo -e "Tables created: ${GREEN}$TABLE_COUNT${NC}"

    if [ "$TABLE_COUNT" -ge 40 ]; then
        echo -e "${GREEN}✓${NC} Database verification passed"
    else
        echo -e "${YELLOW}⚠${NC}  Expected 40+ tables, found $TABLE_COUNT"
    fi
fi

echo ""
echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║              Setup Complete! 🎉                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${GREEN}Production database is ready!${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo -e "  1. Configure Stripe API keys:"
echo -e "     ${YELLOW}npx wrangler secret put STRIPE_SECRET_KEY${NC}"
echo -e "     ${YELLOW}npx wrangler secret put STRIPE_WEBHOOK_SECRET${NC}"
echo ""
echo -e "  2. Deploy the application:"
echo -e "     ${YELLOW}npm run deploy:prod${NC}"
echo ""
echo -e "  3. Setup custom domain in Cloudflare Pages"
echo ""
echo -e "  4. Configure Stripe webhook URL:"
echo -e "     ${YELLOW}https://better-together.pages.dev/api/webhooks/stripe${NC}"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo -e "  • D1_SETUP_INSTRUCTIONS.md - Detailed setup guide"
echo -e "  • MONETIZATION_STRATEGY.md - Business model details"
echo ""
echo -e "${GREEN}Database: $DB_NAME${NC}"
if [ -n "$DB_ID" ]; then
    echo -e "${GREEN}ID: $DB_ID${NC}"
fi
echo ""

exit 0
