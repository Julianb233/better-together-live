# iOS Deployment Quick Start Guide

## Prerequisites Checklist

Before running any build commands, ensure you have:

- [ ] App icon created: `/mobile/assets/icon.png` (1024x1024)
- [ ] Splash screen created: `/mobile/assets/splash.png` (2048x2732)
- [ ] Apple Developer Program membership ($99/year)
- [ ] Apple Team ID from developer.apple.com
- [ ] App created in App Store Connect
- [ ] App Store Connect App ID (10-digit number)

## Step 1: Install and Authenticate EAS CLI

```bash
# EAS CLI is already installed at /usr/bin/eas
# Authenticate with Expo account
eas login

# Initialize project (generates Expo project ID)
eas project:init
```

## Step 2: Configure Apple Developer Credentials

```bash
# Configure Apple credentials
eas credentials

# Follow prompts to:
# 1. Select iOS platform
# 2. Choose "Set up ad hoc provisioning profile" or "Distribution certificate"
# 3. Enter Apple ID: julian@aiacrobatics.com
# 4. Follow authentication flow
```

## Step 3: Update eas.json

Update the placeholder values in `/mobile/eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "julian@aiacrobatics.com",
        "ascAppId": "YOUR_10_DIGIT_APP_ID",     // Get from App Store Connect
        "appleTeamId": "YOUR_TEAM_ID"           // Get from developer.apple.com
      }
    }
  }
}
```

## Step 4: Build for iOS

### Development Build (for testing with Expo Go)
```bash
cd /root/github-repos/better-together-live/mobile
eas build --profile development --platform ios
```

### Production Build (for TestFlight/App Store)
```bash
cd /root/github-repos/better-together-live/mobile
eas build --profile production --platform ios
```

Build will take 15-20 minutes. Monitor progress at the provided URL.

## Step 5: Submit to TestFlight

### Option A: Automatic Submission via EAS
```bash
eas submit --platform ios --profile production
```

### Option B: Manual Upload via Xcode
1. Download the .ipa file from build completion email
2. Open Xcode > Xcode menu > Open Developer Tool > Transporter
3. Sign in with Apple ID: julian@aiacrobatics.com
4. Drag and drop .ipa file
5. Click "Deliver"

## Step 6: Configure TestFlight in App Store Connect

1. Go to appstoreconnect.apple.com
2. Navigate to your app
3. Go to TestFlight tab
4. Wait for build to process (5-15 minutes)
5. Add internal testers
6. Distribute build to testers

## Common Commands Reference

```bash
# Check EAS authentication status
eas whoami

# List previous builds
eas build:list --platform ios

# View build logs
eas build:view [BUILD_ID]

# Configure secrets/environment variables
eas secret:create

# Update credentials
eas credentials

# Check project configuration
eas config

# Cancel a running build
eas build:cancel [BUILD_ID]
```

## Troubleshooting

### "No development team found"
- Run `eas credentials` to configure Apple Developer account
- Ensure you're logged in with correct Apple ID
- Verify Team ID is correct in eas.json

### "Asset not found: ./assets/icon.png"
- Create icon.png in /mobile/assets/ directory
- Must be exactly 1024x1024 pixels
- PNG format, no transparency

### "Build failed: Invalid bundle identifier"
- Verify bundle ID matches in both app.json and eas.json
- Check that bundle ID is registered in App Store Connect
- Bundle ID: com.bettertogether.app

### "Provisioning profile error"
- Run `eas credentials` and select "Remove provisioning profile"
- Then select "Set up provisioning profile" to regenerate
- Ensure Apple Developer membership is active

## Build Time Expectations

- **Development build:** 10-15 minutes
- **Production build:** 15-20 minutes
- **Queue time:** 0-30 minutes (variable)
- **TestFlight processing:** 5-15 minutes after upload

## Next Steps After TestFlight

1. **Internal Testing (3-5 days)**
   - Invite 5-10 team members
   - Test all critical flows
   - Fix blocking bugs

2. **External Testing (1-2 weeks)**
   - Invite 20-50 beta users
   - Collect feedback
   - Iterate on UX issues

3. **App Store Submission**
   - Complete metadata in App Store Connect
   - Upload screenshots (5 per device size)
   - Submit for review
   - Typical review time: 1-3 days

## Support and Resources

- **EAS Documentation:** https://docs.expo.dev/build/introduction/
- **App Store Connect:** https://appstoreconnect.apple.com
- **Apple Developer:** https://developer.apple.com
- **Expo Status:** https://status.expo.dev

## Current Status

**Readiness:** 65%
**Blockers:**
- Missing app icon and splash screen
- Apple Developer credentials not configured
- Accessibility implementation incomplete

**See full report:** `IOS_DEPLOYMENT_READINESS_REPORT.md`
