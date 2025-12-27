# Better Together Mobile - App Store Submission Checklist

## Visual Assets ✓ COMPLETE

All required visual assets have been generated and are ready for submission:

- ✅ **icon.png** (1024×1024) - App Store icon
- ✅ **splash.png** (2048×2732) - Launch screen
- ✅ **adaptive-icon.png** (1024×1024) - Android adaptive icon
- ✅ **favicon.png** (256×256) - Web favicon
- ✅ **app.json** - Already configured to reference all assets

**Total file size**: ~46 KB (very efficient!)

---

## Next Steps for App Store Submission

### 1. Test Assets on Simulators/Emulators

#### iOS Testing
```bash
cd /root/github-repos/better-together-live/mobile
npx expo run:ios
```

**Check:**
- [ ] App icon appears correctly on home screen
- [ ] Splash screen displays on app launch
- [ ] Icon looks good on iPhone (various models)
- [ ] Icon looks good on iPad
- [ ] No visual glitches or artifacts

#### Android Testing
```bash
npx expo run:android
```

**Check:**
- [ ] Adaptive icon renders with correct background
- [ ] Icon masks properly (circle, rounded square, squircle)
- [ ] Splash screen displays correctly
- [ ] Icon looks good across different Android launchers

#### Web Testing
```bash
npx expo start --web
```

**Check:**
- [ ] Favicon appears in browser tab
- [ ] Icon looks good when bookmarked
- [ ] PWA icon displays correctly

### 2. Create App Store Screenshots

You'll need screenshots for both iOS and Android:

#### iOS App Store Requirements
- **6.5" Display** (iPhone 14 Pro Max, iPhone 13 Pro Max, etc.)
  - 1284 × 2778 pixels
  - Portrait orientation
  - At least 3-5 screenshots

- **5.5" Display** (iPhone 8 Plus, iPhone 7 Plus)
  - 1242 × 2208 pixels
  - Portrait orientation
  - At least 3-5 screenshots

#### iPad Screenshots
- **12.9" iPad Pro** (3rd gen and later)
  - 2048 × 2732 pixels
  - Portrait orientation
  - At least 3-5 screenshots

#### Screenshot Ideas
1. **Onboarding/Welcome Screen**
   - Show the beautiful intro flow
   - Highlight key features

2. **Daily Check-in Interface**
   - Demonstrate the check-in flow
   - Show partner connection

3. **Goals Dashboard**
   - Display shared goals
   - Show progress tracking

4. **AI Coaching Interface**
   - Demonstrate AI relationship advice
   - Show conversation UI

5. **Activity Planner**
   - Display activity suggestions
   - Show calendar/planning view

### 3. Google Play Store Requirements

#### Feature Graphic
- **Size**: 1024 × 500 pixels
- **Format**: PNG or JPEG
- **Purpose**: Banner at top of Play Store listing

#### Phone Screenshots
- **Minimum**: 2 screenshots
- **Recommended**: 4-8 screenshots
- **Size**: 320-3840 pixels on longest edge
- **Aspect ratio**: Between 16:9 and 9:16

#### Tablet Screenshots (optional but recommended)
- **Size**: 1200-7680 pixels on longest edge
- **Aspect ratio**: Between 16:9 and 9:16

### 4. App Store Metadata

#### iOS App Store
- [ ] App Name: "Better Together"
- [ ] Subtitle: "Relationship & Couples Companion"
- [ ] Description: Compelling app description (max 4000 characters)
- [ ] Keywords: relationship, couples, love, dating, marriage, communication, goals
- [ ] Category: Lifestyle > Health & Fitness
- [ ] Age Rating: 12+ (or appropriate rating)
- [ ] Privacy Policy URL
- [ ] Support URL
- [ ] Marketing URL (optional)

#### Google Play Store
- [ ] App Name: "Better Together"
- [ ] Short Description: 80 characters max
- [ ] Full Description: 4000 characters max
- [ ] Category: Lifestyle
- [ ] Content Rating: Everyone, Teen, or Mature
- [ ] Privacy Policy URL
- [ ] Developer email
- [ ] Developer website

### 5. Build the App for Production

#### Create Production Build
```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

#### Submit to App Stores
```bash
# Submit to iOS App Store
eas submit --platform ios

# Submit to Google Play Store
eas submit --platform android
```

### 6. Pre-Submission Checklist

#### Technical Requirements
- [ ] App builds successfully without errors
- [ ] All features work as expected
- [ ] No crashes or critical bugs
- [ ] Performance is acceptable (no lag, fast loading)
- [ ] App works offline (if applicable)
- [ ] Proper error handling implemented
- [ ] Loading states implemented
- [ ] Authentication works correctly
- [ ] Data persistence works
- [ ] Push notifications work (if implemented)

#### Content Requirements
- [ ] No copyrighted material without permission
- [ ] No offensive or inappropriate content
- [ ] Privacy policy in place
- [ ] Terms of service in place
- [ ] Age-appropriate content
- [ ] Accurate app description
- [ ] Screenshots match actual app

#### Legal Requirements
- [ ] Privacy policy URL in app.json
- [ ] GDPR compliance (if applicable)
- [ ] COPPA compliance (if targeting children)
- [ ] Data collection disclosure
- [ ] Third-party API compliance
- [ ] Copyright notices

### 7. App Store Optimization (ASO)

#### Keywords Research
Recommended keywords for Better Together:
- relationship app
- couples app
- dating app
- marriage app
- love app
- relationship goals
- couples communication
- relationship coaching
- date ideas
- couples activities

#### App Title Strategy
- **iOS**: "Better Together - Couples App"
- **Android**: "Better Together: Relationship & Couples Companion"

#### Description Tips
- Lead with key benefit (strengthen relationships)
- List top 5 features
- Include social proof (if available)
- Call to action at the end
- Use keywords naturally

### 8. Post-Submission

#### Monitor
- [ ] App review status
- [ ] User reviews and ratings
- [ ] Crash reports
- [ ] Analytics (user acquisition, retention)
- [ ] Support requests

#### Prepare for Launch
- [ ] Marketing materials ready
- [ ] Social media posts scheduled
- [ ] Press release (if applicable)
- [ ] Beta tester feedback collected
- [ ] Support email monitored
- [ ] FAQs prepared

---

## Asset Preview

To view all assets visually, open in browser:
```bash
open /root/github-repos/better-together-live/mobile/assets/preview.html
```

Or start a simple HTTP server:
```bash
cd /root/github-repos/better-together-live/mobile/assets
python3 -m http.server 8000
# Then visit: http://localhost:8000/preview.html
```

---

## Regenerating Assets

If you need to update colors or design:

1. Update colors in `src/utils/constants.ts`
2. Run the generator:
   ```bash
   cd /root/github-repos/better-together-live/mobile
   python3 generate-assets.py
   ```
3. Test on all platforms
4. Re-submit if already published

---

## Important Notes

### iOS Specific
- App review typically takes 1-2 days
- Have TestFlight build ready for expedited review
- Provide demo account if login required
- Explain use of permissions (camera, photo library)

### Android Specific
- Review is typically faster (few hours)
- Use internal testing track before production
- Provide clear release notes
- Set up staged rollout (recommended)

### Common Rejection Reasons
- Crashes on launch
- Broken features in screenshots
- Privacy policy missing
- Misleading screenshots
- Incomplete metadata
- Copyright violations
- Missing required disclosures

---

## Support Resources

- **Expo Documentation**: https://docs.expo.dev/
- **iOS App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play Guidelines**: https://play.google.com/about/developer-content-policy/
- **EAS Build Documentation**: https://docs.expo.dev/build/introduction/
- **EAS Submit Documentation**: https://docs.expo.dev/submit/introduction/

---

## Contact

For questions or assistance with submission:
- Check Expo documentation first
- Reach out to Better Together development team
- Consider hiring ASO expert for optimization

---

**Generated**: December 27, 2025
**Version**: 1.0.0
**Status**: Ready for Testing → Screenshots → Submission
