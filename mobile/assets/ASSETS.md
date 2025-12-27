# Better Together Mobile - Visual Assets

## Overview
This directory contains all visual assets required for App Store and Play Store submission.

## Brand Identity

### Color Palette
- **Primary**: `#FF6B9D` - Vibrant Pink (main brand color)
- **Secondary**: `#C44569` - Deep Rose (supporting color)
- **Accent**: `#FFA07A` - Coral/Salmon (highlight color)
- **Background**: `#FFFFFF` - White (clean background)

### Design Concept
Two interlocking hearts symbolizing:
- Connection between partners
- Love and togetherness
- Support and unity
- Shared journey

The hearts overlap to represent the interconnected nature of a healthy relationship.

## Asset Specifications

### 1. App Icon (`icon.png`)
- **Size**: 1024 × 1024 pixels
- **Format**: PNG, RGB (no alpha channel)
- **Purpose**: Primary app icon for iOS App Store
- **Design**: Two interlocking hearts with gradient from pink to coral
- **Background**: White
- **Notes**: iOS automatically applies rounded corners; keep important elements centered

### 2. Splash Screen (`splash.png`)
- **Size**: 2048 × 2732 pixels (iPad Pro 12.9" portrait)
- **Format**: PNG, RGB
- **Purpose**: Loading screen shown when app launches
- **Design**: Centered logo with "Better Together" text
- **Background**: White
- **Notes**: Designed to work across all iOS device sizes with `resizeMode: "contain"`

### 3. Adaptive Icon (`adaptive-icon.png`)
- **Size**: 1024 × 1024 pixels
- **Format**: PNG with alpha channel (RGBA)
- **Purpose**: Android adaptive icon foreground layer
- **Design**: Hearts only (no background)
- **Background**: Transparent (Android applies white background from app.json)
- **Notes**: Android will mask this to various shapes (circle, squircle, rounded square)

### 4. Favicon (`favicon.png`)
- **Size**: 256 × 256 pixels
- **Format**: PNG, RGB
- **Purpose**: Web browser favicon
- **Design**: Simplified version of app icon
- **Background**: White
- **Notes**: Used when running as PWA or in web browsers

## File Sizes
- `icon.png`: ~6.4 KB
- `splash.png`: ~31 KB
- `adaptive-icon.png`: ~7.5 KB
- `favicon.png`: ~1.1 KB

Total: ~46 KB (very efficient!)

## App Store Guidelines Compliance

### iOS App Store
✓ Icon is exactly 1024×1024 pixels
✓ No alpha channel in app icon
✓ No rounded corners (iOS applies automatically)
✓ Splash screen works across all device sizes
✓ Colors are vibrant and recognizable at small sizes

### Google Play Store
✓ Adaptive icon foreground is 1024×1024
✓ Adaptive icon uses transparency correctly
✓ Background color specified in app.json (#ffffff)
✓ Icon scales well to various Android masks

### Web
✓ Favicon is high-resolution (256×256)
✓ Works in light and dark browser themes
✓ Recognizable at small sizes (16×16, 32×32)

## Regenerating Assets

To regenerate all assets (if brand colors change):

```bash
cd /root/github-repos/better-together-live/mobile
python3 generate-assets.py
```

The script reads colors from `src/utils/constants.ts` and generates all assets programmatically.

## Testing Assets

### iOS Simulator
```bash
npx expo run:ios
```
Check that:
- App icon appears correctly on home screen
- Splash screen displays properly on launch
- Icon looks good at various sizes (iPhone, iPad)

### Android Emulator
```bash
npx expo run:android
```
Check that:
- Adaptive icon renders correctly with device theme
- Icon masks properly (circle, rounded square, squircle)
- Splash screen displays properly

### Web Browser
```bash
npx expo start --web
```
Check that:
- Favicon appears in browser tab
- Icon looks good in bookmarks

## Design Notes

### Why Interlocking Hearts?
- Instantly recognizable relationship/couples app
- Conveys connection and togetherness
- Simple enough to be recognizable at 16×16 pixels
- Distinctive from other relationship apps
- Warm, inviting, and positive

### Color Psychology
- **Pink (#FF6B9D)**: Love, romance, warmth, compassion
- **Coral (#FFA07A)**: Friendship, happiness, energy, optimism
- **White (#FFFFFF)**: Purity, clarity, simplicity, peace

The gradient from pink to coral creates a warm, welcoming feel that encourages connection.

### Accessibility
- High contrast with white background
- Colors are distinguishable for most color vision types
- Simple shapes are easy to recognize
- No small text in icon (follows best practices)

## App Store Screenshots
For complete App Store submission, you'll also need:
- iPhone screenshots (6.5" and 5.5" displays)
- iPad screenshots (12.9" and 11" displays)
- Android screenshots (phone and tablet)

These should showcase:
- Daily check-ins
- Goal tracking
- AI coaching
- Activity planning

## Brand Usage
These assets represent the Better Together brand. When creating additional marketing materials:
- Use the same color palette
- Maintain the interlocking hearts motif
- Keep backgrounds clean (white or subtle gradients)
- Use fonts that complement the modern, friendly aesthetic

## Contact
For design updates or questions:
- Update colors in `src/utils/constants.ts`
- Regenerate assets with `generate-assets.py`
- Test on all platforms before submission

## Version History
- **v1.0.0** (2025-12-27): Initial asset creation
  - App icon (interlocking hearts design)
  - Splash screen with logo and text
  - Android adaptive icon
  - Web favicon
  - All assets optimized for App Store submission
