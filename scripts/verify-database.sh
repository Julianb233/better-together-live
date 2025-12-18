#!/bin/bash

# Better Together - Database Verification Script
# Verifies that all migrations have been applied and database is healthy

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DB_NAME="${1:-better-together-production}"
ENVIRONMENT="${2:-production}"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}Better Together Database Verification${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""
echo -e "Database: ${GREEN}$DB_NAME${NC}"
echo -e "Environment: ${GREEN}$ENVIRONMENT${NC}"
echo ""

# Function to run D1 query
run_query() {
    local query="$1"
    if [ "$ENVIRONMENT" = "local" ]; then
        npx wrangler d1 execute "$DB_NAME" --local --command "$query" 2>/dev/null
    else
        npx wrangler d1 execute "$DB_NAME" --command "$query" 2>/dev/null
    fi
}

# Check if database exists
echo -e "${BLUE}[1/7]${NC} Checking database existence..."
if npx wrangler d1 list 2>/dev/null | grep -q "$DB_NAME"; then
    echo -e "${GREEN}✓${NC} Database '$DB_NAME' exists"
else
    echo -e "${RED}✗${NC} Database '$DB_NAME' not found!"
    echo -e "${YELLOW}Run:${NC} npx wrangler d1 create $DB_NAME"
    exit 1
fi

# Check tables exist
echo -e "\n${BLUE}[2/7]${NC} Verifying table count..."
TABLE_COUNT=$(run_query "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'd1_%';" | grep -o '[0-9]\+' | tail -1)

if [ "$TABLE_COUNT" -ge 40 ]; then
    echo -e "${GREEN}✓${NC} Found $TABLE_COUNT tables"
else
    echo -e "${RED}✗${NC} Only found $TABLE_COUNT tables (expected 40+)"
    echo -e "${YELLOW}Run:${NC} npm run db:migrate:${ENVIRONMENT/production/prod}"
    exit 1
fi

# Check core tables
echo -e "\n${BLUE}[3/7]${NC} Checking core relationship tables..."
CORE_TABLES=("users" "relationships" "shared_goals" "daily_checkins" "activities" "challenges" "achievements")
for table in "${CORE_TABLES[@]}"; do
    if run_query "SELECT name FROM sqlite_master WHERE type='table' AND name='$table';" | grep -q "$table"; then
        echo -e "${GREEN}✓${NC} $table"
    else
        echo -e "${RED}✗${NC} Missing table: $table"
        exit 1
    fi
done

# Check payment tables
echo -e "\n${BLUE}[4/7]${NC} Checking payment & subscription tables..."
PAYMENT_TABLES=("subscription_plans" "subscriptions" "payment_transactions" "ai_credits" "stripe_webhooks")
for table in "${PAYMENT_TABLES[@]}"; do
    if run_query "SELECT name FROM sqlite_master WHERE type='table' AND name='$table';" | grep -q "$table"; then
        echo -e "${GREEN}✓${NC} $table"
    else
        echo -e "${RED}✗${NC} Missing table: $table"
        exit 1
    fi
done

# Check analytics tables
echo -e "\n${BLUE}[5/7]${NC} Checking analytics & tracking tables..."
ANALYTICS_TABLES=("analytics_events" "page_views" "user_sessions" "revenue_analytics" "engagement_scores")
for table in "${ANALYTICS_TABLES[@]}"; do
    if run_query "SELECT name FROM sqlite_master WHERE type='table' AND name='$table';" | grep -q "$table"; then
        echo -e "${GREEN}✓${NC} $table"
    else
        echo -e "${RED}✗${NC} Missing table: $table"
        exit 1
    fi
done

# Check indexes
echo -e "\n${BLUE}[6/7]${NC} Verifying database indexes..."
INDEX_COUNT=$(run_query "SELECT COUNT(*) as count FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%';" | grep -o '[0-9]\+' | tail -1)

if [ "$INDEX_COUNT" -ge 50 ]; then
    echo -e "${GREEN}✓${NC} Found $INDEX_COUNT indexes"
else
    echo -e "${YELLOW}⚠${NC}  Only found $INDEX_COUNT indexes (expected 50+)"
    echo -e "${YELLOW}Warning:${NC} Some indexes may be missing, but database is functional"
fi

# Check data integrity
echo -e "\n${BLUE}[7/7]${NC} Running data integrity checks..."

# Check for subscription plans
PLAN_COUNT=$(run_query "SELECT COUNT(*) as count FROM subscription_plans WHERE is_active = 1;" | grep -o '[0-9]\+' | tail -1 || echo "0")
if [ "$PLAN_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Found $PLAN_COUNT active subscription plans"
else
    echo -e "${YELLOW}⚠${NC}  No subscription plans found"
    echo -e "${YELLOW}Info:${NC} Run seed script to add subscription plans"
fi

# Check for challenges
CHALLENGE_COUNT=$(run_query "SELECT COUNT(*) as count FROM challenges WHERE is_template = 1;" | grep -o '[0-9]\+' | tail -1 || echo "0")
if [ "$CHALLENGE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Found $CHALLENGE_COUNT pre-built challenges"
else
    echo -e "${YELLOW}⚠${NC}  No challenges found"
    echo -e "${YELLOW}Info:${NC} Run: npm run db:seed"
fi

# Check for achievements
ACHIEVEMENT_COUNT=$(run_query "SELECT COUNT(*) as count FROM achievements WHERE is_active = 1;" | grep -o '[0-9]\+' | tail -1 || echo "0")
if [ "$ACHIEVEMENT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Found $ACHIEVEMENT_COUNT active achievements"
else
    echo -e "${YELLOW}⚠${NC}  No achievements found"
    echo -e "${YELLOW}Info:${NC} Run: npm run db:seed"
fi

# Summary
echo -e "\n${BLUE}======================================${NC}"
echo -e "${GREEN}✓ Database verification complete!${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""
echo -e "Database Status: ${GREEN}HEALTHY${NC}"
echo -e "Tables: ${GREEN}$TABLE_COUNT${NC}"
echo -e "Indexes: ${GREEN}$INDEX_COUNT${NC}"
echo -e "Subscription Plans: ${GREEN}$PLAN_COUNT${NC}"
echo -e "Challenges: ${GREEN}$CHALLENGE_COUNT${NC}"
echo -e "Achievements: ${GREEN}$ACHIEVEMENT_COUNT${NC}"
echo ""

# Show table list
echo -e "${BLUE}All tables in database:${NC}"
run_query "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'd1_%' ORDER BY name;" | grep -v "^\[" | grep -v "^{" | grep -v "^}" | grep -v "^Executing"

echo ""
echo -e "${GREEN}Database is ready for use!${NC}"

exit 0
