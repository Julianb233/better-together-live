# App Store Assets Inventory & TODO

**Project:** Better Together Mobile App
**Prepared by:** Fiona-Frontend (UI/UX & Assets Specialist)
**Date:** December 20, 2025
**Status:** Pre-Launch Asset Audit

---

## Executive Summary

**Current Asset Status:** 0% Complete (CRITICAL)

The assets directory exists at `/root/github-repos/better-together-live/mobile/assets/` but is **completely empty**. All visual assets required for App Store submission are missing.

**Total Assets Needed:** 50+ individual files across iOS, Android, and Web platforms

**Estimated Time to Complete:** 5-7 days (with design resources)

---

## 1. Existing Assets Inventory

### Assets Directory Status
**Location:** `/root/github-repos/better-together-live/mobile/assets/`
**Files Found:** 0
**Status:** EMPTY

### Expected Assets (per app.json)
The following assets are configured in `app.json` but **do not exist**:

- `./assets/icon.png` - Main app icon (MISSING)
- `./assets/splash.png` - Splash screen (MISSING)
- `./assets/adaptive-icon.png` - Android adaptive icon foreground (MISSING)
- `./assets/favicon.png` - Web favicon (MISSING)

**Impact:** App will not build or run without these core assets.

### Brand Assets
**Color Palette (from constants.ts):**
- Primary: #FF6B9D (Vibrant Pink)
- Secondary: #C44569 (Deep Rose)
- Accent: #FFA07A (Coral/Salmon)
- Background: #FFFFFF (White)
- Surface: #F5F5F5 (Light Gray)

**Typography:**
- Font Sizes: 12px, 14px, 16px, 18px, 24px, 32px
- Font Weights: 400, 500, 600, 700

**Design Language:** Modern, warm, romantic, approachable

---

## 2. Missing Required Assets - Priority Matrix

### PRIORITY 1: Build-Blocking Assets (Must Have Immediately)

#### 1.1 App Icon - Primary (1024x1024)
**Status:** MISSING - CRITICAL BLOCKER
**Format:** PNG, no transparency, no alpha channel
**Location:** `/assets/icon.png`
**Purpose:** App Store listing, iOS home screen master

**Design Requirements:**
- Square format (iOS applies rounded corners automatically)
- No transparency or alpha channels allowed
- Vibrant and recognizable at small sizes
- Use primary brand color (#FF6B9D)
- Fill entire 1024x1024 canvas

**Design Concept Ideas:**
1. Two overlapping hearts (symbolizing "Better Together")
2. Interlocking rings or circles
3. Heart with subtle "+" or connection symbol
4. Abstract couple silhouette with heart element

**Estimated Design Time:** 4-8 hours

#### 1.2 Splash Screen
**Status:** MISSING - CRITICAL BLOCKER
**Format:** PNG
**Location:** `/assets/splash.png`
**Recommended Size:** 2048x2732 (iPad Pro 12.9" portrait)

**Configuration (from app.json):**
```json
{
  "image": "./assets/splash.png",
  "resizeMode": "contain",
  "backgroundColor": "#ffffff"
}
```

**Design Requirements:**
- Simple branded screen
- App icon or logo centered
- White background (#ffffff) already configured
- Minimal text (app name optional)
- Fast loading consideration

**Estimated Design Time:** 2-4 hours

#### 1.3 Android Adaptive Icon Foreground
**Status:** MISSING - CRITICAL BLOCKER
**Format:** PNG with transparency
**Location:** `/assets/adaptive-icon.png`
**Size:** 432x432px (108dp @ 4x density)

**Configuration (from app.json):**
```json
{
  "foregroundImage": "./assets/adaptive-icon.png",
  "backgroundColor": "#ffffff"
}
```

**Design Requirements:**
- Transparent background (foreground layer only)
- Safe zone: Center 288x288px (72dp)
- Icon elements must fit within safe zone
- Background color (#ffffff) already configured
- Test with circular, rounded square, and squircle masks

**Estimated Design Time:** 2-3 hours (can derive from main icon)

#### 1.4 Web Favicon
**Status:** MISSING - BUILD BLOCKER
**Format:** PNG
**Location:** `/assets/favicon.png`
**Recommended Size:** 256x256px (can scale down)

**Design Requirements:**
- Simplified version of app icon
- Visible at 16x16, 32x32, 64x64
- PNG format (can convert to .ico later)

**Estimated Design Time:** 1 hour (derived from main icon)

**PRIORITY 1 TOTAL TIME:** 9-16 hours

---

### PRIORITY 2: iOS App Store Marketing Assets (Required for Submission)

#### 2.1 iOS App Icon - All Sizes
**Status:** MISSING - SUBMISSION BLOCKER
**Source:** Master 1024x1024 (Priority 1.1)

**Required Sizes:**
- 180x180px - iPhone (@3x)
- 167x167px - iPad Pro
- 152x152px - iPad (@2x)
- 120x120px - iPhone (@2x)
- 87x87px - iPhone (@3x) Settings
- 80x80px - iPad (@2x) Spotlight
- 76x76px - iPad
- 60x60px - iPhone (@2x) Notification
- 58x58px - iPad (@2x) Settings
- 40x40px - iPad Spotlight
- 29x29px - Settings

**Generation Method:** Automated from 1024x1024 master using:
- Xcode Asset Catalog (recommended)
- Online tools (appicon.co, makeappicon.com)
- Script/automation

**Estimated Time:** 30 minutes (automated process)

#### 2.2 iOS Screenshots - Device-Specific Sets
**Status:** MISSING - SUBMISSION BLOCKER

**Required Device Sizes:**

| Device | Resolution | Orientation | Qty Needed |
|--------|------------|-------------|------------|
| iPhone 6.9" (16 Pro Max) | 1320x2868 | Portrait | 5-10 |
| iPhone 6.7" (15 Plus) | 1290x2796 | Portrait | 5-10 |
| iPhone 6.5" (XS Max) | 1242x2688 | Portrait | 5-10 |
| iPhone 5.5" (8 Plus) | 1242x2208 | Portrait | 5-10 |
| iPad Pro 12.9" (6th) | 2048x2732 | Portrait | 5-10 |
| iPad Pro 12.9" (2nd) | 2048x2732 | Portrait | 5-10 |

**Minimum Required:** 3 screenshots per device size
**Recommended:** 5 curated screenshots per size

**Screenshot Content Plan (5-Screenshot Strategy):**

**Screenshot 1: Dashboard (Hero Shot)**
- Screen: DashboardScreen with populated relationship data
- Caption: "See Your Relationship at a Glance"
- Key Elements: Days together, health score, goals, activities
- Visual Treatment: Subtle background gradient in brand colors

**Screenshot 2: Daily Check-in**
- Screen: CheckinScreen with interactive sliders
- Caption: "Daily Check-ins Build Connection"
- Key Elements: Connection score, mood, gratitude, streak counter
- Visual Treatment: Emphasize simplicity and consistency

**Screenshot 3: AI Coach**
- Screen: AICoachScreen with sample helpful conversation
- Caption: "Get 24/7 Relationship Guidance"
- Key Elements: Chat interface, AI responses, conversation starters
- Sample: "How can we improve communication?" → AI advice

**Screenshot 4: Shared Goals**
- Screen: Dashboard goals section or dedicated goals view
- Caption: "Achieve Goals Together"
- Key Elements: Goal progress bars, variety of goal types
- Visual Treatment: Emphasize progress and achievement

**Screenshot 5: Activities & Planning**
- Screen: ActivitiesScreen or SchedulingScreen
- Caption: "Plan Meaningful Moments"
- Key Elements: Upcoming dates, activity suggestions, calendar
- Visual Treatment: Show organized, exciting plans

**Screenshot Production Workflow:**
1. Populate app with realistic demo relationship data
2. Capture screenshots on physical devices/simulators (highest res)
3. Import into Figma or design tool
4. Add official device frames
5. Add caption overlays with brand typography
6. Export at all required resolutions
7. Test visibility on App Store preview

**Design Tools:**
- Figma (free for basic use)
- Previewed (screenshot mockup generator)
- Apple Device Frames (official)
- AppLaunchpad or similar tools

**Estimated Time:** 16-24 hours (design + production for all sizes)

#### 2.3 App Preview Videos (Optional - Highly Recommended)
**Status:** MISSING - OPTIONAL BUT VALUABLE

**Specifications:**
- Duration: 15-30 seconds per video
- Max videos: 3 per device size
- Orientation: Portrait
- Format: H.264 or HEVC video, AAC audio
- Aspect ratio: Match screenshot dimensions
- Auto-play in App Store (no sound initially)

**Recommended Video Content:**
1. **Video 1: App Tour (30 sec)**
   - Quick walkthrough of daily check-in flow
   - Highlight streak and consistency features

2. **Video 2: AI Coach Demo (20 sec)**
   - Real-time AI conversation demonstration
   - Show helpful advice being given

3. **Video 3: Goal Tracking (15 sec)**
   - Visual of goals being set and progressing
   - Celebration moment when goal is achieved

**Production Requirements:**
- Add subtitles (auto-play is muted)
- Use brand colors for overlays/captions
- Professional editing with smooth transitions
- Include call-to-action at end

**Tools:**
- Screen recording (iOS Simulator/physical device)
- iMovie, Final Cut Pro, or Adobe Premiere
- Subtitling tools

**Estimated Time:** 12-20 hours (scripting, recording, editing)

**PRIORITY 2 TOTAL TIME:** 28.5-44.5 hours

---

### PRIORITY 3: Android Play Store Marketing Assets

#### 3.1 Android App Icon - High-Res
**Status:** MISSING - SUBMISSION BLOCKER
**Format:** PNG, 32-bit
**Size:** 512x512px
**Location:** Required for Play Store upload (not in assets directory)

**Design Requirements:**
- Can be same design as iOS 1024x1024, scaled to 512x512
- Must work with adaptive icon's circular mask
- 32-bit PNG with alpha channel allowed

**Estimated Time:** 15 minutes (export from master icon)

#### 3.2 Feature Graphic
**Status:** MISSING - SUBMISSION BLOCKER
**Format:** PNG or JPEG
**Size:** 1024x500px (exact)
**Purpose:** Displayed at top of Play Store listing

**Design Requirements:**
- Landscape orientation
- Include app icon, tagline, key visual element
- Brand colors prominent
- No device frames or borders
- Text must be readable at small sizes

**Suggested Content:**
- App icon (left side)
- Tagline: "Strengthen Your Relationship, Together"
- Visual element: Heart or couple illustration
- Brand gradient background

**Estimated Time:** 4-6 hours

#### 3.3 Android Screenshots
**Status:** MISSING - SUBMISSION BLOCKER

**Required Sizes:**

| Device Type | Min Size | Recommended | Qty Needed |
|-------------|----------|-------------|------------|
| Phone | 320px min dimension | 1080x1920 | 5-8 |
| 7" Tablet | 1024x600 | 1200x1920 | 3-5 |
| 10" Tablet | 1920x1080 | 2560x1600 | 3-5 |

**Play Store Requirements:**
- Minimum: 2 screenshots
- Maximum: 8 screenshots
- Recommended: 5-8 screenshots
- 16:9 or 9:16 aspect ratio

**Content Strategy:**
- Can use same 5-screenshot content plan as iOS
- Adjust device frames to Android devices (Pixel, Galaxy)
- Ensure consistency with iOS screenshots (same captions/order)

**Estimated Time:** 8-12 hours (leveraging iOS screenshot work)

#### 3.4 Promo Video (Optional)
**Status:** MISSING - OPTIONAL
**Format:** YouTube URL
**Duration:** 30 seconds to 2 minutes

**Requirements:**
- Upload to YouTube (public or unlisted)
- Provide URL in Play Console
- Can be same video as iOS App Preview
- Auto-plays in Play Store

**Estimated Time:** 2-4 hours (if reusing iOS videos)

**PRIORITY 3 TOTAL TIME:** 14.25-23.25 hours

---

### PRIORITY 4: Additional Recommended Assets

#### 4.1 App Store Promotional Graphics
**Status:** MISSING - OPTIONAL

**Assets for Marketing:**
- Social media preview card (1200x630px for sharing)
- App Store search ads creative (various sizes)
- Website hero image with app mockup
- Press kit images (high-res app screenshots in devices)

**Estimated Time:** 6-10 hours

#### 4.2 Icon Design Variations
**Status:** MISSING - OPTIONAL

**Recommended:**
- Light mode icon variant (current)
- Dark mode icon variant (for iOS Dark Mode)
- Seasonal/holiday icon variants (for updates)

**Estimated Time:** 3-5 hours per variant

#### 4.3 Onboarding Illustrations
**Status:** MISSING - NICE TO HAVE

**Purpose:** Enhance in-app onboarding experience
**Quantity:** 3-5 illustrations for onboarding screens
**Style:** Match brand personality (warm, approachable)

**Estimated Time:** 12-20 hours

**PRIORITY 4 TOTAL TIME:** 21-35 hours

---

## 3. Asset Specifications Reference

### File Formats
| Platform | Icon Format | Screenshot Format |
|----------|-------------|-------------------|
| iOS | PNG (no alpha) | PNG or JPEG |
| Android | PNG (32-bit) | PNG or JPEG |
| Web | PNG, ICO | N/A |

### Color Space
- **Required:** sRGB color space for all assets
- **ICC Profile:** Embed sRGB ICC profile (v2 or v4)

### File Size Limits
| Asset Type | Max File Size |
|------------|---------------|
| App Icon | 1 MB |
| Screenshots | 8 MB each |
| App Preview Video | 500 MB |
| Feature Graphic | 1 MB |

### Naming Conventions
**Recommended structure:**
```
/assets/
  icon.png (1024x1024 master)
  icon-512.png (Android Play Store)
  splash.png
  adaptive-icon.png
  favicon.png

/app-store-screenshots/
  /ios/
    /iphone-6.9/
      01-dashboard.png
      02-checkin.png
      03-ai-coach.png
      04-goals.png
      05-activities.png
    /iphone-6.7/
      ...
    /ipad-12.9/
      ...
  /android/
    /phone/
      01-dashboard.png
      ...
    /tablet-7/
      ...
    /tablet-10/
      ...

/feature-graphics/
  android-feature-graphic-1024x500.png
```

---

## 4. Prioritized Action Plan

### Phase 1: Core Assets (Week 1 - Days 1-2)
**Goal:** Enable app to build and run

**Tasks:**
1. Design master app icon (1024x1024)
   - Create 3-5 concept sketches
   - Choose final design
   - Refine and finalize
   - **Deliverable:** `icon.png`

2. Generate adaptive icon foreground
   - Derive from master icon
   - Test with different masks
   - **Deliverable:** `adaptive-icon.png`

3. Design splash screen
   - Simple branded screen
   - Center icon/logo on white
   - **Deliverable:** `splash.png`

4. Create favicon
   - Export simplified icon at 256x256
   - **Deliverable:** `favicon.png`

**Phase 1 Time:** 2 days (16 hours)
**Phase 1 Blockers Removed:** App can build and run

### Phase 2: iOS Screenshot Production (Week 1 - Days 3-5)
**Goal:** Complete iOS App Store submission assets

**Tasks:**
1. Populate app with demo relationship data
   - Create realistic demo couple profile
   - Add sample check-ins, goals, activities
   - Generate meaningful AI coach conversation

2. Capture base screenshots (5 screens)
   - Dashboard, Check-in, AI Coach, Goals, Activities
   - Capture on iPhone simulator at highest resolution

3. Design screenshot overlays in Figma
   - Create device frame template
   - Design caption style (typography, positioning)
   - Apply brand colors and styling

4. Generate all iOS device size variations
   - Export for 6.9", 6.7", 6.5", 5.5" iPhones
   - Export for 12.9" iPad Pro (both gens)
   - Quality check each size

5. Generate all iOS icon sizes from master
   - Use automated tool (appicon.co)
   - Verify all sizes in Xcode Asset Catalog

**Phase 2 Time:** 3 days (24 hours)
**Phase 2 Deliverable:** iOS submission-ready

### Phase 3: Android Assets (Week 2 - Days 1-2)
**Goal:** Complete Android Play Store submission assets

**Tasks:**
1. Create Android feature graphic (1024x500)
   - Design landscape marketing graphic
   - Include icon, tagline, key visual

2. Export Android high-res icon (512x512)
   - Scale from master icon

3. Adapt iOS screenshots to Android
   - Replace iOS device frames with Android frames
   - Adjust aspect ratios if needed
   - Generate phone, 7" tablet, 10" tablet sizes

4. Test adaptive icon on Android
   - Verify with circular, rounded square, squircle masks
   - Test on various Android launchers

**Phase 3 Time:** 2 days (16 hours)
**Phase 3 Deliverable:** Android submission-ready

### Phase 4: Video Content (Week 2 - Days 3-5) - OPTIONAL
**Goal:** Create App Preview videos for higher conversion

**Tasks:**
1. Script 3 app preview videos
   - Video 1: App tour (30 sec)
   - Video 2: AI coach demo (20 sec)
   - Video 3: Goal tracking (15 sec)

2. Record screen captures
   - Use iOS Simulator or physical device
   - Capture smooth interactions

3. Edit and produce videos
   - Add subtitles
   - Add brand overlays
   - Professional transitions
   - Export at App Store specs

4. Upload and configure
   - iOS: Upload to App Store Connect
   - Android: Upload to YouTube, link in Play Console

**Phase 4 Time:** 3 days (20 hours)
**Phase 4 Deliverable:** Premium App Store presence

### Phase 5: Supplemental Assets (Week 3) - OPTIONAL
**Goal:** Enhanced marketing and future-proofing

**Tasks:**
1. Social media assets
2. Press kit
3. Dark mode icon variant
4. Seasonal icon variants
5. Onboarding illustrations

**Phase 5 Time:** 5-7 days (35+ hours)

---

## 5. Resource Requirements

### Design Resources

**Option A: In-House Designer**
- **Time Required:** 5-7 days (40-56 hours)
- **Cost:** Internal resource allocation
- **Pros:** Full brand control, iterative feedback
- **Cons:** Requires dedicated designer bandwidth

**Option B: Freelance Designer**
- **Estimated Cost:** $800-$2,000 (depending on scope)
- **Platforms:** Fiverr, Upwork, Dribbble, 99designs
- **Deliverables:** All Priority 1-3 assets
- **Timeline:** 1-2 weeks
- **Pros:** Professional quality, external perspective
- **Cons:** Less brand familiarity, communication overhead

**Option C: Design Agency**
- **Estimated Cost:** $3,000-$8,000 (full package)
- **Deliverables:** All assets + brand guidelines + variations
- **Timeline:** 2-3 weeks
- **Pros:** Highest quality, comprehensive deliverables
- **Cons:** Most expensive, longer timeline

**Option D: DIY with Templates**
- **Estimated Cost:** $0-$200 (tool subscriptions)
- **Tools:** Figma, Canva, Sketch
- **Templates:** Purchase App Store screenshot templates
- **Time Required:** 7-10 days (self-learning + execution)
- **Pros:** Low cost, full control
- **Cons:** Steeper learning curve, may lack polish

### Development Resources

**Tasks:**
1. Implement generated assets into project
2. Test build with new assets
3. Verify icon generation in Xcode/Android Studio
4. Update app.json if needed
5. Test splash screen timing and appearance

**Time Required:** 2-4 hours (developer time)

### Tools & Software

**Essential (Free):**
- Figma (free tier) - Design and mockups
- Xcode Asset Catalog - Icon generation
- iOS Simulator - Screenshot capture
- Android Studio - Testing adaptive icons

**Recommended (Paid):**
- Previewed ($12/month) - Screenshot mockups
- AppLaunchpad ($29 one-time) - Screenshot generator
- Adobe Creative Suite ($54.99/month) - Professional design

**Optional (Paid):**
- Screenshots.pro ($49-$99) - Screenshot templates
- App Mockup - Device frame generator
- Rotato ($99 one-time) - 3D device mockups

### Testing Devices

**Physical Devices (Recommended):**
- 1x Latest iPhone (iPhone 15/16) - $799-$1,199
- 1x iPad (any model) - $329-$799
- 1x Android Phone (Pixel or Galaxy) - $399-$999

**Alternatives:**
- Use simulators/emulators (free, less accurate)
- Borrow devices from team members
- Use cloud device testing (BrowserStack, Sauce Labs)

---

## 6. Quality Assurance Checklist

### Icon QA
- [ ] Icon is clearly visible at 29x29px (smallest iOS size)
- [ ] Icon works with iOS rounded corner mask
- [ ] Icon works with Android circular mask
- [ ] Icon is recognizable in greyscale
- [ ] Icon has no transparency (iOS 1024x1024)
- [ ] Icon has transparent background (Android adaptive foreground)
- [ ] Icon matches brand colors exactly
- [ ] Icon looks professional on both light and dark backgrounds
- [ ] Icon has been reviewed by stakeholders and approved

### Screenshot QA
- [ ] All required device sizes have 5 screenshots each
- [ ] Screenshots show real, populated data (not lorem ipsum)
- [ ] Text captions are readable and error-free
- [ ] Device frames are official Apple/Google frames
- [ ] Screenshots are in correct orientation (portrait)
- [ ] Screenshots are at correct resolution (no scaling artifacts)
- [ ] Screenshot order tells a coherent story (onboarding → features)
- [ ] Screenshots pass visual review by marketing team
- [ ] Screenshots highlight key differentiating features
- [ ] Screenshots are consistent in style across platforms

### Splash Screen QA
- [ ] Splash screen appears immediately on launch
- [ ] Splash screen uses configured background color
- [ ] Splash screen logo/icon is centered
- [ ] Splash screen transitions smoothly to app
- [ ] Splash screen doesn't stay visible too long (< 2 seconds)
- [ ] Splash screen works on all device sizes
- [ ] Splash screen is optimized for file size

### Video QA (if applicable)
- [ ] Videos are under 30 seconds each
- [ ] Videos have professional subtitles
- [ ] Videos auto-play gracefully (silent initially)
- [ ] Videos highlight key features clearly
- [ ] Videos have brand-consistent styling
- [ ] Videos are exported at correct specifications
- [ ] Videos have been reviewed and approved
- [ ] Videos upload successfully to App Store/YouTube

---

## 7. Risks & Mitigation

### Risk 1: Design Delays
**Impact:** HIGH - Blocks app submission
**Probability:** MEDIUM
**Mitigation:**
- Start icon design immediately (longest lead time)
- Have backup freelance designer identified
- Use template-based approach for screenshots if needed
- Set hard deadline 1 week before intended submission

### Risk 2: Asset Rejection by App Stores
**Impact:** HIGH - Resubmission required
**Probability:** LOW (if following guidelines)
**Mitigation:**
- Follow Apple/Google asset guidelines strictly
- Use official device frames only
- Test assets in TestFlight/Internal Testing before submission
- Have App Store review checklist completed

### Risk 3: Brand Inconsistency
**Impact:** MEDIUM - Professional appearance affected
**Probability:** MEDIUM
**Mitigation:**
- Create brand guidelines document first
- Use design tokens from constants.ts
- Have single designer/team handle all assets
- Get stakeholder approval at concept stage

### Risk 4: Technical Issues with Asset Integration
**Impact:** MEDIUM - Build failures
**Probability:** LOW
**Mitigation:**
- Test build after adding each asset type
- Follow exact naming conventions from app.json
- Verify file formats and sizes
- Have developer review asset specifications before design starts

### Risk 5: Screenshot Content Issues
**Impact:** MEDIUM - User privacy, competitive concerns
**Probability:** LOW
**Mitigation:**
- Use completely fictional demo data
- Don't show real user information
- Avoid copyrighted content in screenshots
- Review App Store screenshot content policies

---

## 8. Success Criteria

### Completion Criteria

**Phase 1 Success (Core Assets):**
- [ ] App builds successfully on both iOS and Android
- [ ] Icon appears correctly on simulator home screen
- [ ] Splash screen displays on app launch
- [ ] No build errors related to missing assets

**Phase 2 Success (iOS Marketing):**
- [ ] 5 high-quality screenshots per iOS device size
- [ ] All iOS icon sizes generated and validated
- [ ] Assets uploaded to App Store Connect without errors
- [ ] Screenshot preview looks professional in App Store listing preview

**Phase 3 Success (Android Marketing):**
- [ ] Feature graphic created and approved
- [ ] 5-8 screenshots per Android device category
- [ ] Adaptive icon tested on multiple launchers
- [ ] Assets uploaded to Play Console without errors

**Overall Success Criteria:**
- [ ] Zero asset-related blockers for App Store submission
- [ ] Professional appearance in both App Store and Play Store
- [ ] Brand consistency across all assets
- [ ] Stakeholder approval on all visual assets
- [ ] Assets ready for submission within 7-day timeline

---

## 9. Next Steps

### Immediate Actions (Today)

1. **Share this document** with:
   - Design team/lead
   - Product manager
   - iOS development lead (Tyler-TypeScript)
   - DevOps lead (Petra-DevOps)

2. **Assign ownership:**
   - Icon design: [ASSIGN DESIGNER]
   - Screenshot production: [ASSIGN DESIGNER/MARKETING]
   - Asset integration: [ASSIGN DEVELOPER]
   - QA review: [ASSIGN QA LEAD]

3. **Schedule kickoff meeting:**
   - Review this document
   - Align on timeline
   - Confirm resource availability
   - Set milestone dates

4. **Create design brief:**
   - Icon design concepts and requirements
   - Screenshot content and messaging
   - Brand guidelines and constraints

### This Week (Priority 1)

- [ ] Day 1: Icon design concepts (3-5 sketches)
- [ ] Day 2: Icon refinement and finalization
- [ ] Day 2: Splash screen and adaptive icon creation
- [ ] Day 3: Generate all icon sizes
- [ ] Day 3: Integrate core assets into project
- [ ] Day 4: Test build with new assets
- [ ] Day 5: Stakeholder review and approval

### Next Week (Priority 2-3)

- [ ] Days 1-3: iOS screenshot production
- [ ] Days 4-5: Android asset production
- [ ] Day 5: Upload assets for internal testing

### Week 3 (Optional Enhancements)

- [ ] App preview video production
- [ ] Social media asset creation
- [ ] Press kit preparation

---

## 10. Appendix: Reference Links

### Official Guidelines

**Apple App Store:**
- App Icon Guidelines: https://developer.apple.com/design/human-interface-guidelines/app-icons
- Screenshots Specifications: https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications
- App Preview Specifications: https://developer.apple.com/help/app-store-connect/reference/app-preview-specifications

**Google Play Store:**
- Graphic Assets Guidelines: https://support.google.com/googleplay/android-developer/answer/9866151
- Feature Graphic Requirements: https://support.google.com/googleplay/android-developer/answer/9866151#feature
- Screenshot Requirements: https://support.google.com/googleplay/android-developer/answer/9866151#screenshots

### Design Tools

**Free Tools:**
- Figma: https://www.figma.com
- appicon.co: https://appicon.co (icon size generator)
- iOS Device Frames: https://developer.apple.com/design/resources/

**Paid Tools:**
- Previewed: https://previewed.app
- Screenshots.pro: https://screenshots.pro
- AppLaunchpad: https://theapplaunchpad.com

### Inspiration

**App Store Examples (Competitor Analysis):**
- Lasting (relationship app)
- Paired (couple's app)
- Raft (relationship coaching)
- Love Nudge (relationship improvement)

**Design Communities:**
- Dribbble: Search "app icon relationship" or "couple app"
- Behance: Search "mobile app branding"
- Mobbin: Mobile app design patterns

---

## 11. Contact & Collaboration

**Asset Tracking:**
Use this document as living checklist. Update completion status in Section 9 as assets are completed.

**Questions or Blockers:**
Tag Fiona-Frontend in swarm communication namespace:
```
namespace: "agents"
key: "fiona-status"
```

**Coordination with:**
- **Tyler-TypeScript:** Asset integration and build testing
- **Petra-DevOps:** App Store Connect and Play Console upload
- **Design Team:** Asset creation and brand consistency

**Status Updates:**
Weekly progress review every Friday until completion.

---

**DELIVERABLE STATUS:** COMPLETE
**NEXT OWNER:** Product Manager / Design Lead
**NEXT ACTION:** Assign asset creation tasks and kickoff meeting

---

**Prepared by:** Fiona-Frontend (Agent ID: agent_1766202412125_5vpk66)
**Swarm:** swarm_1766202395065_5239amnq2
**Track:** iOS Ship
**Date:** December 20, 2025
