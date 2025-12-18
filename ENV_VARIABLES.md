# Environment Variables Configuration

## Overview
Better Together uses Cloudflare Pages and Workers with minimal environment configuration. Most features work out-of-the-box without environment variables, but optional integrations require specific secrets.

---

## Required GitHub Secrets (CI/CD)

These secrets must be configured in your GitHub repository settings under **Settings > Secrets and variables > Actions**.

### `CLOUDFLARE_API_TOKEN`
**Required for:** Automated deployments via GitHub Actions

**How to create:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template
4. Add the following permissions:
   - Account > Cloudflare Pages > Edit
   - Account > D1 > Edit
   - Zone > Workers Routes > Edit (if using custom domains)
5. Limit to your account
6. Create token and copy the value

**Example:**
```
CLOUDFLARE_API_TOKEN=your_token_here_abc123xyz789
```

**Add to GitHub:**
```bash
gh secret set CLOUDFLARE_API_TOKEN --body "your_token_here"
```

---

### `CLOUDFLARE_ACCOUNT_ID`
**Required for:** Automated deployments via GitHub Actions

**How to find:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Copy the Account ID from the right sidebar or URL
4. URL format: `https://dash.cloudflare.com/{ACCOUNT_ID}/pages`

**Example:**
```
CLOUDFLARE_ACCOUNT_ID=abc123def456ghi789
```

**Add to GitHub:**
```bash
gh secret set CLOUDFLARE_ACCOUNT_ID --body "your_account_id"
```

---

## Optional Environment Variables

### Email Service Integration (Future)
When implementing partner invitation emails:

**`SENDGRID_API_KEY`** or **`RESEND_API_KEY`**
```bash
# For SendGrid
wrangler pages secret put SENDGRID_API_KEY --project-name better-together

# For Resend
wrangler pages secret put RESEND_API_KEY --project-name better-together
```

**`EMAIL_FROM_ADDRESS`**
```bash
wrangler pages secret put EMAIL_FROM_ADDRESS --project-name better-together
# Example: noreply@better-together.app
```

---

### Analytics Integration (Optional)

**`GOOGLE_ANALYTICS_ID`**
```bash
wrangler pages secret put GOOGLE_ANALYTICS_ID --project-name better-together
# Example: G-XXXXXXXXXX
```

**`POSTHOG_API_KEY`** (if using PostHog for analytics)
```bash
wrangler pages secret put POSTHOG_API_KEY --project-name better-together
wrangler pages secret put POSTHOG_HOST --project-name better-together
```

---

### Payment Processing (Future Premium Features)

**`STRIPE_SECRET_KEY`**
```bash
wrangler pages secret put STRIPE_SECRET_KEY --project-name better-together
# Use test key: sk_test_... or live key: sk_live_...
```

**`STRIPE_WEBHOOK_SECRET`**
```bash
wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name better-together
# From Stripe Dashboard > Webhooks
```

---

## Local Development Configuration

### `.dev.vars` File
Create this file in the project root for local development secrets (never commit this file):

```bash
# .dev.vars
# Local development environment variables

# Database (handled automatically by wrangler)
# DB binding is configured in wrangler.jsonc

# Optional: Local testing of email services
SENDGRID_API_KEY=your_test_key_here
EMAIL_FROM_ADDRESS=dev@localhost

# Optional: Analytics testing
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

**Note:** The `.dev.vars` file is already in `.gitignore` and will never be committed.

---

## Environment-Specific Configuration

### Development
- Uses local D1 database via `.wrangler/state/v3/d1`
- No external API calls required
- Mock data for testing

**Run dev server:**
```bash
npm run dev
```

### Production
- Uses production D1 database (configured in wrangler.jsonc)
- SSL/TLS automatically enabled
- Custom domain: `better-together.app`
- Secrets stored in Cloudflare

**Deploy to production:**
```bash
npm run deploy:prod
```

---

## Setting Cloudflare Secrets

### Using Wrangler CLI

**Set a secret:**
```bash
wrangler pages secret put SECRET_NAME --project-name better-together
# You'll be prompted to enter the value securely
```

**List all secrets:**
```bash
wrangler pages secret list --project-name better-together
```

**Delete a secret:**
```bash
wrangler pages secret delete SECRET_NAME --project-name better-together
```

### Using Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages > better-together > Settings**
3. Scroll to **Environment Variables**
4. Click **Add variable**
5. Choose environment: Production, Preview, or both
6. Enter name and value
7. Click **Save**

---

## Security Best Practices

### Secret Management
- **Never commit** `.dev.vars`, `.env`, or `.env.production` files
- **Rotate secrets** regularly (every 90 days minimum)
- **Use environment-specific** secrets (separate test/prod keys)
- **Limit permissions** on API tokens to minimum required
- **Monitor usage** of API tokens in respective dashboards

### GitHub Actions
- Use GitHub's encrypted secrets (never plain text in workflows)
- Limit repository access to trusted collaborators
- Use environment protection rules for production deployments
- Enable branch protection on `main` branch

### Cloudflare Workers
- Use Cloudflare's encrypted environment variables
- Never log secret values in application code
- Use service bindings for inter-worker communication
- Enable rate limiting on sensitive endpoints

---

## Troubleshooting

### "API Token Invalid" Error
1. Verify token has not expired
2. Check token permissions include Cloudflare Pages and D1
3. Ensure token is for the correct Cloudflare account
4. Try creating a new token

### "Account ID Not Found" Error
1. Double-check the account ID format (32-character hex string)
2. Verify you're using the account ID, not zone ID
3. Check you have access to the Cloudflare account

### Local Development Not Working
1. Ensure `.dev.vars` exists if you need secrets locally
2. Run `wrangler dev` instead of `npm run dev` for full Workers simulation
3. Check `.wrangler/state/v3/d1` for local database

### Secrets Not Available in Production
1. Verify secrets are set for the "Production" environment
2. Redeploy after setting new secrets
3. Check secret names match code exactly (case-sensitive)
4. View deployment logs for any error messages

---

## Environment Variable Checklist

### Initial Setup (Required)
- [ ] `CLOUDFLARE_API_TOKEN` - Added to GitHub Secrets
- [ ] `CLOUDFLARE_ACCOUNT_ID` - Added to GitHub Secrets
- [ ] Production D1 database ID - Updated in `wrangler.jsonc`

### Email Features (When Implementing)
- [ ] `SENDGRID_API_KEY` or `RESEND_API_KEY`
- [ ] `EMAIL_FROM_ADDRESS`

### Analytics (Optional)
- [ ] `GOOGLE_ANALYTICS_ID`
- [ ] `POSTHOG_API_KEY` and `POSTHOG_HOST`

### Payments (When Implementing)
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PUBLISHABLE_KEY` (client-side)

---

## Quick Reference Commands

```bash
# Local development with secrets
npm run dev

# Deploy with automatic CI/CD (push to main)
git push origin main

# Manual deployment with secrets
npm run deploy:prod

# Set production secret
wrangler pages secret put SECRET_NAME --project-name better-together

# View GitHub secrets (requires gh CLI)
gh secret list

# Test API token
wrangler whoami
```

---

**Last Updated:** 2024-12-17
**Maintained by:** DevOps Team
**Questions?** Open an issue in the GitHub repository
