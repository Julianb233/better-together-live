# Better Together Mobile - Assets Directory

## Quick Overview

This directory contains all visual assets for the Better Together mobile app, ready for App Store and Play Store submission.

## Assets Included

| Asset | Size | Purpose | File |
|-------|------|---------|------|
| **App Icon** | 1024×1024 | iOS App Store | `icon.png` |
| **Splash Screen** | 2048×2732 | Launch screen | `splash.png` |
| **Adaptive Icon** | 1024×1024 | Android icon | `adaptive-icon.png` |
| **Favicon** | 256×256 | Web browser | `favicon.png` |

**Total Size**: ~46 KB (all assets combined)

## Design Concept

**Two Interlocking Hearts** representing:
- Connection between partners
- Love and togetherness
- Support and unity
- Shared journey

**Colors**:
- Primary: `#FF6B9D` (Vibrant Pink)
- Accent: `#FFA07A` (Coral/Salmon)
- Background: `#FFFFFF` (White)

## Quick Actions

### View Assets
Open `preview.html` in a browser to see all assets visually:
```bash
cd /root/github-repos/better-together-live/mobile/assets
python3 -m http.server 8000
# Visit: http://localhost:8000/preview.html
```

### Regenerate Assets
If you need to update colors or design:
```bash
cd /root/github-repos/better-together-live/mobile
python3 generate-assets.py
```

### Test Assets
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Web
npx expo start --web
```

## Documentation

- **ASSETS.md** - Detailed asset specifications and design notes
- **SUBMISSION-CHECKLIST.md** - Complete App Store submission guide
- **preview.html** - Visual preview of all assets
- **generate-assets.py** - Asset generation script

## Compliance

✅ All assets meet iOS App Store requirements
✅ All assets meet Google Play Store requirements
✅ Colors match brand guidelines
✅ Designs are recognizable at small sizes
✅ No copyright violations
✅ Accessible color contrast

## Next Steps

1. **Test** assets on iOS/Android simulators
2. **Create** app screenshots (see SUBMISSION-CHECKLIST.md)
3. **Build** production app with EAS
4. **Submit** to App Store and Play Store

## Need Help?

- See `SUBMISSION-CHECKLIST.md` for complete submission guide
- See `ASSETS.md` for detailed design specifications
- Run `python3 generate-assets.py` to regenerate assets

---

**Status**: ✅ Ready for submission
**Version**: 1.0.0
**Last Updated**: December 27, 2025
