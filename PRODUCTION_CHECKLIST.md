# Production Deployment Checklist

## Pre-Deployment Setup

### 1. Cloudflare Account Configuration
- [ ] Create Cloudflare account (if not exists)
- [ ] Verify email address
- [ ] Enable two-factor authentication (2FA)
- [ ] Create API token with required permissions:
  - Cloudflare Pages: Edit
  - D1 Database: Edit
  - Workers Routes: Edit (for custom domains)
- [ ] Copy Account ID from dashboard
- [ ] Store API token securely

### 2. Domain Configuration (Optional but Recommended)
- [ ] Purchase domain name (e.g., better-together.app)
- [ ] Transfer domain to Cloudflare or update nameservers
- [ ] Verify domain is active in Cloudflare dashboard
- [ ] Confirm DNS propagation complete

### 3. GitHub Repository Setup
- [ ] Repository created and code pushed
- [ ] Branch protection enabled on `main`
- [ ] Require pull request reviews before merging
- [ ] Require status checks to pass
- [ ] Add GitHub secrets:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
- [ ] Enable GitHub Actions in repository settings
- [ ] Configure production environment protection rules

### 4. Local Development Testing
- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` - verify app loads
- [ ] Test database migrations: `npm run db:migrate:local`
- [ ] Seed local database: `npm run db:seed`
- [ ] Test all core features locally:
  - [ ] Homepage loads correctly
  - [ ] API endpoints respond
  - [ ] Database queries execute
  - [ ] Static assets load
  - [ ] Navigation works
  - [ ] Forms submit properly
- [ ] Run `npm run build` - verify no errors
- [ ] Test preview: `npm run preview`

---

## Production Database Setup

### 5. Create Production D1 Database
```bash
# Create the production database
wrangler d1 create better-together-production
```

**Expected output:**
```
✅ Successfully created DB 'better-together-production'!

[[d1_databases]]
binding = "DB"
database_name = "better-together-production"
database_id = "abc123def-456-789-ghi-jkl012mno345"
```

- [ ] Copy the `database_id` from output
- [ ] Update `wrangler.jsonc` with production database ID:
  ```json
  "database_id": "abc123def-456-789-ghi-jkl012mno345"
  ```
- [ ] Commit wrangler.jsonc changes to git

### 6. Run Database Migrations
```bash
# Apply migrations to production database
wrangler d1 migrations apply better-together-production
```

- [ ] Verify all migrations applied successfully
- [ ] Check migration status:
  ```bash
  wrangler d1 migrations list better-together-production
  ```

### 7. Seed Production Database (Optional)
```bash
# Seed with initial data
wrangler d1 execute better-together-production --file=./seed.sql
```

- [ ] Review seed data before applying
- [ ] Confirm seed execution successful
- [ ] Verify data with:
  ```bash
  wrangler d1 execute better-together-production --command "SELECT * FROM challenges LIMIT 5"
  ```

---

## Cloudflare Pages Deployment

### 8. Create Cloudflare Pages Project
```bash
# Create Pages project
wrangler pages project create better-together \
  --production-branch main \
  --compatibility-date 2024-01-01
```

- [ ] Pages project created successfully
- [ ] Note the default deployment URL: `better-together.pages.dev`
- [ ] Verify project appears in Cloudflare dashboard

### 9. Initial Manual Deployment
```bash
# Build and deploy
npm run build
wrangler pages deploy dist --project-name better-together --branch main
```

- [ ] Build completes without errors
- [ ] Deployment successful
- [ ] Deployment URL provided
- [ ] Visit deployment URL and verify:
  - [ ] Homepage loads (< 1 second)
  - [ ] No console errors
  - [ ] API endpoints respond
  - [ ] Database connectivity works
  - [ ] Images and CSS load properly

### 10. Configure Custom Domain (If Using)
```bash
# Add custom domain
wrangler pages domain add better-together.app --project-name better-together
```

**DNS Configuration:**
- [ ] Add DNS records in Cloudflare:
  - CNAME: `@` → `better-together.pages.dev`
  - CNAME: `www` → `better-together.pages.dev`
- [ ] Wait for DNS propagation (up to 48 hours, usually < 15 minutes)
- [ ] SSL/TLS certificate automatically provisioned
- [ ] Verify HTTPS works on custom domain

---

## CI/CD Pipeline Setup

### 11. Test GitHub Actions Workflow
- [ ] Push code to a feature branch
- [ ] Create pull request to `main`
- [ ] Verify GitHub Actions workflow triggers:
  - [ ] Lint and test job passes
  - [ ] Build completes successfully
  - [ ] Preview deployment created
  - [ ] Preview URL commented on PR
- [ ] Visit preview URL and test functionality

### 12. Production Deployment via CI/CD
- [ ] Merge pull request to `main`
- [ ] Verify GitHub Actions workflow triggers:
  - [ ] Lint and test job passes
  - [ ] Production deployment job runs
  - [ ] Database migrations applied (if any)
  - [ ] Deployment summary created
- [ ] Check deployment summary in GitHub Actions
- [ ] Visit production URL and verify:
  - [ ] Latest changes deployed
  - [ ] No regressions
  - [ ] All features working

---

## Post-Deployment Verification

### 13. Core Functionality Testing
- [ ] **Homepage**: Loads in < 1 second
- [ ] **Registration**: Can create new relationship
- [ ] **Login System**: User authentication works
- [ ] **Dashboard**: Displays correctly
- [ ] **API Endpoints**:
  ```bash
  curl https://better-together.app/api/challenges
  curl https://better-together.app/api/check-ins
  curl https://better-together.app/api/goals
  ```
- [ ] **Database Queries**: Execute without errors
- [ ] **Static Assets**: Images, CSS, JS load from CDN
- [ ] **Mobile Responsive**: Test on mobile device

### 14. Performance Verification
- [ ] Run Lighthouse audit (target scores):
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 90
- [ ] Check Cloudflare Analytics:
  - [ ] Requests being served from edge
  - [ ] Response times < 200ms
  - [ ] No error spikes
- [ ] Test from multiple geographic locations
- [ ] Verify caching headers set correctly

### 15. Security Verification
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] SSL certificate valid and trusted
- [ ] Security headers present:
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-XSS-Protection: 1; mode=block`
- [ ] CORS configured correctly (API routes only)
- [ ] No sensitive data in client-side code
- [ ] API rate limiting active (Cloudflare automatic)
- [ ] Run security scan (optional):
  ```bash
  npm audit
  ```

### 16. Database Health Check
```bash
# Check database size
wrangler d1 info better-together-production

# Verify table structure
wrangler d1 execute better-together-production \
  --command "SELECT name FROM sqlite_master WHERE type='table'"

# Check row counts
wrangler d1 execute better-together-production \
  --command "SELECT COUNT(*) as count FROM relationships"
```

- [ ] Database responding correctly
- [ ] Tables created properly
- [ ] Indexes in place
- [ ] No orphaned data

---

## Monitoring & Observability Setup

### 17. Enable Cloudflare Analytics
- [ ] Visit Cloudflare Pages dashboard
- [ ] Enable Web Analytics
- [ ] Configure analytics settings
- [ ] Install analytics snippet (if needed)
- [ ] Verify events being tracked

### 18. Set Up Alerts (Optional)
- [ ] Configure Cloudflare Notifications:
  - [ ] Deployment failures
  - [ ] Error rate spikes
  - [ ] Traffic anomalies
- [ ] Set up uptime monitoring:
  - [ ] Use Cloudflare Health Checks, or
  - [ ] External service (UptimeRobot, Pingdom)
- [ ] Configure alert destinations (email, Slack, etc.)

### 19. Documentation & Runbooks
- [ ] Update README.md with production URL
- [ ] Document deployment process
- [ ] Create incident response runbook
- [ ] Document rollback procedure
- [ ] Share access credentials with team (securely)

---

## Environment Configuration

### 20. Set Production Environment Variables (If Needed)
```bash
# Example: Setting up email service
wrangler pages secret put SENDGRID_API_KEY --project-name better-together
wrangler pages secret put EMAIL_FROM_ADDRESS --project-name better-together

# Example: Analytics
wrangler pages secret put GOOGLE_ANALYTICS_ID --project-name better-together
```

- [ ] Review `ENV_VARIABLES.md` for required secrets
- [ ] Set all necessary production secrets
- [ ] Verify secrets in Cloudflare dashboard
- [ ] Test features requiring secrets

---

## Final Checks

### 21. Quality Assurance
- [ ] All user flows tested end-to-end
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile testing (iOS and Android)
- [ ] Accessibility testing (screen reader compatible)
- [ ] Load testing (simulate 100+ concurrent users)
- [ ] Error handling tested (network failures, etc.)

### 22. Legal & Compliance
- [ ] Privacy policy page accessible
- [ ] Terms of service page accessible
- [ ] Cookie consent implemented (if required)
- [ ] GDPR compliance verified (if EU users)
- [ ] Data retention policies documented

### 23. Business Readiness
- [ ] Marketing site updated with launch info
- [ ] Social media announcements prepared
- [ ] Support email/system configured
- [ ] User documentation available
- [ ] Onboarding flow tested
- [ ] Pricing page accurate (if applicable)

---

## Rollback Plan

### 24. Prepare Rollback Strategy
```bash
# View deployment history
wrangler pages deployment list --project-name better-together

# Rollback to previous deployment
wrangler pages deployment tail better-together
# Then promote previous deployment in dashboard
```

- [ ] Document current deployment ID
- [ ] Know how to rollback (Cloudflare dashboard or CLI)
- [ ] Test rollback procedure in staging (if available)
- [ ] Communication plan for rollback scenario

---

## Launch Day

### 25. Go Live
- [ ] Final smoke test of all features
- [ ] Merge final changes to `main`
- [ ] Wait for CI/CD deployment to complete
- [ ] Verify production deployment successful
- [ ] Monitor Cloudflare Analytics for first hour
- [ ] Watch for error spikes or anomalies
- [ ] Test from multiple devices/locations
- [ ] Announce launch to users
- [ ] Monitor support channels for issues

### 26. Post-Launch Monitoring (First 24 Hours)
- [ ] Check error rates every 2 hours
- [ ] Monitor performance metrics
- [ ] Review user feedback and bug reports
- [ ] Track key metrics:
  - [ ] User registrations
  - [ ] API response times
  - [ ] Database query performance
  - [ ] Page load times
- [ ] Be ready to rollback if critical issues arise

---

## Success Criteria

Your deployment is successful when:
- ✅ Application accessible at production URL
- ✅ All core features working correctly
- ✅ Performance meets targets (Lighthouse > 90)
- ✅ Security checks passed
- ✅ CI/CD pipeline functioning
- ✅ Monitoring and alerts configured
- ✅ No critical bugs reported
- ✅ Users can successfully register and use app

---

## Maintenance Tasks

### Regular Maintenance (Weekly)
- [ ] Review Cloudflare Analytics for anomalies
- [ ] Check for npm dependency updates
- [ ] Review error logs
- [ ] Monitor database size and performance

### Monthly Maintenance
- [ ] Rotate API tokens and secrets
- [ ] Review and optimize database queries
- [ ] Performance audit with Lighthouse
- [ ] Security audit with `npm audit`
- [ ] Backup database (if not using Cloudflare backup)

### Quarterly Maintenance
- [ ] Major dependency updates
- [ ] Feature usage analysis
- [ ] Cost optimization review
- [ ] Disaster recovery test
- [ ] Security penetration testing

---

## Support & Resources

- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/
- **Hono Framework**: https://hono.dev/
- **Project Repository**: https://github.com/your-username/better-together
- **Issue Tracker**: https://github.com/your-username/better-together/issues

---

**Deployment Estimated Time**: 2-4 hours (first time)
**Last Updated**: 2024-12-17
**Version**: 1.0
