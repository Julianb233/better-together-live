# 🚀 Better Together - Production Deployment Guide

## Overview

This guide covers deploying Better Together to production using Cloudflare Pages with automated CI/CD via GitHub Actions. The application uses:
- **Cloudflare Pages** for hosting
- **Cloudflare Workers** for serverless API
- **D1 Database** for PostgreSQL-compatible data storage
- **GitHub Actions** for automated deployments

---

## Deployment Methods

### Method 1: Automated CI/CD (Recommended)
Push to GitHub and let automation handle everything:
1. Push code to feature branch
2. Create Pull Request → Preview deployment created automatically
3. Merge to `main` → Production deployment triggered automatically

**Best for**: Production use, team collaboration, continuous delivery

### Method 2: Manual Deployment
Deploy directly from your local machine using Wrangler CLI.

**Best for**: Quick testing, initial setup, troubleshooting

---

## Quick Start: Automated Deployment

### Prerequisites
- [ ] Cloudflare account
- [ ] GitHub account and repository
- [ ] Domain name (optional but recommended)

### 1. Initial Setup (One-Time)

**Create Cloudflare API Token:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Add permissions:
   - Account > Cloudflare Pages > Edit
   - Account > D1 > Edit
5. Create token and copy the value

**Create Production Database:**
```bash
# Create D1 database
wrangler d1 create better-together-production

# Copy the database_id from output
# Update wrangler.jsonc with the database_id
```

**Apply Database Migrations:**
```bash
# Apply migrations to production
wrangler d1 migrations apply better-together-production

# Optionally seed with initial data
wrangler d1 execute better-together-production --file=./seed.sql
```

**Configure GitHub Secrets:**
```bash
# Add secrets to your GitHub repository
gh secret set CLOUDFLARE_API_TOKEN --body "your_token_here"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "your_account_id_here"
```

Or via GitHub web interface:
1. Go to repository **Settings > Secrets and variables > Actions**
2. Click "New repository secret"
3. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`

### 2. Deploy to Production

**Automatic via GitHub Actions:**
```bash
# Push to main branch
git add .
git commit -m "Deploy to production"
git push origin main

# GitHub Actions will automatically:
# 1. Run tests and type checking
# 2. Build the application
# 3. Deploy to Cloudflare Pages
# 4. Apply database migrations
# 5. Report deployment status
```

**View deployment progress:**
- Go to repository **Actions** tab
- Watch the "Deploy to Cloudflare Pages" workflow
- Deployment URL will be in the workflow summary

### 3. Custom Domain Setup (Optional)

**Add domain via Wrangler:**
```bash
wrangler pages domain add better-together.app --project-name better-together
```

**Configure DNS (in Cloudflare Dashboard):**
1. Go to your domain's DNS settings
2. Add CNAME records:
   - `@` → `better-together.pages.dev`
   - `www` → `better-together.pages.dev`
3. SSL/TLS certificate automatically provisioned
4. Wait for DNS propagation (usually < 15 minutes)

---

## Manual Deployment Method

### Prerequisites
- [ ] Cloudflare account with API token
- [ ] Wrangler CLI installed (`npm install -g wrangler`)
- [ ] Authenticated with Cloudflare: `wrangler login`

### 1. Cloudflare Configuration
```bash
# Create production D1 database
wrangler d1 create better-together-production

# Update wrangler.jsonc with database_id from above command

# Create Cloudflare Pages project
wrangler pages project create better-together \
  --production-branch main \
  --compatibility-date 2024-01-01
```

### 2. Database Setup
```bash
# Apply migrations to production
wrangler d1 migrations apply better-together-production

# Seed production database (optional)
wrangler d1 execute better-together-production --file=./seed.sql
```

### 3. Deploy Application
```bash
# Build application
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name better-together --branch main

# Set environment variables if needed
wrangler pages secret put EMAIL_API_KEY --project-name better-together
```

---

## CI/CD Pipeline Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`) includes:

### Jobs

**1. Lint and Test**
- Runs on all pushes and pull requests
- Type checking with TypeScript
- Build verification
- Runs in parallel with other jobs for speed

**2. Deploy Preview (Pull Requests)**
- Creates preview deployment for each PR
- Comments preview URL on the PR
- Isolated environment for testing changes
- Automatically cleaned up when PR is closed

**3. Deploy Production (Main Branch)**
- Triggers only on pushes to `main`
- Deploys to production environment
- Applies database migrations
- Creates deployment summary
- Requires all tests to pass first

**4. Notify on Failure**
- Creates GitHub issue if production deployment fails
- Includes deployment details and logs
- Tags with high-priority label

### Environment Protection

Configure environment protection rules in GitHub:
1. Go to **Settings > Environments > production**
2. Add protection rules:
   - Require reviewers before deployment
   - Restrict to `main` branch only
   - Set deployment timeout

---

## Environment Variables

### Required Secrets

See `ENV_VARIABLES.md` for complete documentation.

**GitHub Secrets (Required for CI/CD):**
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages + D1 permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

**Cloudflare Secrets (Optional):**
- `SENDGRID_API_KEY` - For email notifications
- `EMAIL_FROM_ADDRESS` - Sender email address
- `GOOGLE_ANALYTICS_ID` - For analytics tracking
- `STRIPE_SECRET_KEY` - For payment processing (future)

### Setting Cloudflare Secrets

```bash
# Using Wrangler CLI
wrangler pages secret put SECRET_NAME --project-name better-together

# List all secrets
wrangler pages secret list --project-name better-together

# Delete a secret
wrangler pages secret delete SECRET_NAME --project-name better-together
```

---

## Local Development

### Running Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or with Wrangler for full Workers simulation
npm run dev:sandbox
```

### Database Commands
```bash
# Apply migrations locally
npm run db:migrate:local

# Seed local database
npm run db:seed

# Reset local database
npm run db:reset

# Query local database
npm run db:console:local
```

---

## Post-Deployment Verification

### Automated Testing (GitHub Actions)
Each deployment automatically verifies:
- Build completes without errors
- TypeScript type checking passes
- Application starts successfully

### Manual Verification Steps

**1. Test Core Endpoints:**
```bash
# Replace with your actual deployment URL
curl https://better-together.pages.dev/api/challenges
curl https://better-together.pages.dev/api/check-ins
curl https://better-together.pages.dev/api/goals
```

**2. Test User Flows:**
1. Visit your deployment URL
2. Test homepage loading
3. Try user registration
4. Test dashboard features
5. Verify database operations

**3. Performance Check:**
- [ ] Homepage loads < 1 second
- [ ] API responses < 200ms
- [ ] Database queries executing properly
- [ ] Static assets loading from CDN
- [ ] Run Lighthouse audit (target: 90+ scores)

---

## Monitoring & Analytics

### Cloudflare Dashboard
Access real-time metrics:
- **Pages Analytics**: Page views, unique visitors, geographic distribution
- **Workers Analytics**: API request counts, execution time, error rates
- **D1 Analytics**: Database query performance, storage usage

### GitHub Actions Logs
Monitor deployment health:
- View workflow runs in **Actions** tab
- Check deployment summaries
- Review error logs for failed deployments
- Track deployment frequency and success rate

### Setting Up Alerts
```bash
# Example: Monitor for deployment failures
# Cloudflare will automatically create GitHub issues on failure
# Configure email notifications in Cloudflare dashboard
```

## Security Considerations

### API Security
- Rate limiting (Cloudflare automatic)
- Input validation (implemented)
- SQL injection prevention (parameterized queries)
- CORS configuration (API routes only)

### Data Privacy
- User data encryption at rest (Cloudflare D1)
- HTTPS enforcement (automatic)
- No sensitive data logging
- Relationship data isolation

---

## Scaling & Performance

### Automatic Scaling
Cloudflare Pages provides automatic scaling:
- **Global CDN**: Content served from 200+ edge locations
- **Workers**: Auto-scale to handle traffic spikes
- **D1 Database**: Scales with your application
- **No server management**: Completely serverless

### Performance Optimization
```bash
# Check bundle size
npm run build
# Review dist/ folder size

# Optimize images (if needed)
# Consider using Cloudflare Images

# Enable compression (automatic with Cloudflare)
```

### Cost Management
- **Free Tier**: 100,000 requests/day, 25GB D1 storage
- **Monitor usage**: Check Cloudflare dashboard regularly
- **Set budget alerts**: Configure in Cloudflare billing

### Future Enhancements
1. **Authentication**: Add user sessions and JWT
2. **Real-time**: WebSocket notifications for updates
3. **Email**: SendGrid/Resend for partner invitations
4. **Mobile App**: React Native or Progressive Web App
5. **Analytics**: Enhanced tracking with PostHog or Mixpanel

---

## Troubleshooting

### GitHub Actions Issues

**"CLOUDFLARE_API_TOKEN not found"**
- Verify secret is added in repository settings
- Check secret name matches exactly (case-sensitive)
- Re-create token if expired

**"Build failed" in workflow**
- Check TypeScript errors: `npm run build` locally
- Review workflow logs in Actions tab
- Verify all dependencies installed: `npm ci`

**"Deployment failed" error**
- Check Cloudflare dashboard for service status
- Verify API token has correct permissions
- Check account ID is correct

### Database Issues

**"Database not found"**
- Confirm database created: `wrangler d1 list`
- Verify database_id in wrangler.jsonc
- Check D1 binding name is "DB"

**"Migrations failed"**
- Apply manually: `wrangler d1 migrations apply better-together-production`
- Check migration files in `migrations/` directory
- Review migration SQL for syntax errors

### Production Issues

**"Site not loading"**
- Check deployment status in Cloudflare dashboard
- Verify DNS records (if using custom domain)
- Wait for DNS propagation (up to 48 hours)
- Check browser console for errors

**"API returning 500 errors"**
- View Workers logs: Cloudflare dashboard > Workers > Logs
- Check database connectivity
- Verify environment variables set correctly
- Review recent code changes

### Getting Help

- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/
- **Hono Framework**: https://hono.dev/
- **GitHub Issues**: Open issue in repository
- **Cloudflare Community**: https://community.cloudflare.com/

---

## Cost Estimate & Pricing

### Free Tier (Cloudflare)
- **Cloudflare Pages**: Unlimited requests, 500 builds/month
- **Cloudflare Workers**: 100,000 requests/day
- **D1 Database**: 25GB storage, 5 million reads/day
- **SSL/TLS**: Automatic and free
- **CDN**: Global edge network included

**Expected cost for small-scale app**: $0/month

### Paid Features (Optional)
- **Workers Paid** ($5/month): 10M requests/day
- **Additional D1 storage**: $0.75/GB over 25GB
- **Custom domains**: Free on Cloudflare
- **Email (SendGrid)**: 100 emails/day free, then ~$15/month
- **Analytics (PostHog)**: Free tier available

### Scaling Projections
| Users | Requests/Month | Estimated Cost |
|-------|----------------|----------------|
| 0-1,000 | < 3M | $0 (Free tier) |
| 1,000-10,000 | 3M-30M | $5-10/month |
| 10,000-100,000 | 30M-300M | $25-50/month |

---

## Quick Reference

### Essential Commands
```bash
# Deploy to production (automatic via GitHub)
git push origin main

# Manual deployment
npm run deploy:prod

# Check deployment status
wrangler pages deployment list --project-name better-together

# View production logs
wrangler pages deployment tail --project-name better-together

# Database operations
wrangler d1 migrations apply better-together-production
wrangler d1 execute better-together-production --command "SELECT COUNT(*) FROM relationships"

# Manage secrets
wrangler pages secret list --project-name better-together
wrangler pages secret put SECRET_NAME --project-name better-together
```

### Important Links
- **Production URL**: https://better-together.pages.dev (or custom domain)
- **GitHub Repository**: https://github.com/YOUR_USERNAME/better-together
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **GitHub Actions**: Repository > Actions tab

---

## Summary

### Deployment Checklist
- [ ] Cloudflare account created
- [ ] GitHub secrets configured
- [ ] Production D1 database created
- [ ] Database migrations applied
- [ ] Custom domain configured (optional)
- [ ] CI/CD pipeline tested
- [ ] Production deployment verified
- [ ] Monitoring enabled

### Next Steps
1. Review `PRODUCTION_CHECKLIST.md` for comprehensive deployment steps
2. Read `ENV_VARIABLES.md` for environment configuration
3. Set up monitoring and alerts
4. Plan for scaling and feature additions
5. Configure custom domain if desired

---

**Deployment Status**: Production-ready with automated CI/CD
**Estimated Setup Time**: 30-60 minutes (first deployment)
**Last Updated**: 2024-12-17

For detailed deployment steps, see `PRODUCTION_CHECKLIST.md`