# Design System — Better Together & Jesus Entered the Chat

Comprehensive UI/UX design system for both brands, defining color palettes, typography, component libraries, and key screen specifications. Designed for implementation in Paper.dev and direct code usage.

---

## Table of Contents

1. [Better Together — Brand Identity](#better-together--brand-identity)
2. [Jesus Entered the Chat — Brand Identity](#jesus-entered-the-chat--brand-identity)
3. [Shared Foundations](#shared-foundations)
4. [Component Library](#component-library)
5. [Key Screens — Better Together](#key-screens--better-together)
6. [Key Screens — JETC](#key-screens--jetc)
7. [Design Tokens Reference](#design-tokens-reference)
8. [Exportable Assets](#exportable-assets)

---

## Better Together — Brand Identity

### Brand Personality
- **Warm** — approachable, comforting, emotionally intelligent
- **Modern** — clean interfaces, polished micro-interactions
- **Playful** — emoji-driven expressions, gamified elements, celebration moments
- **Trustworthy** — professional enough for coaching, personal enough for couples

### Logo & Mark
- **Wordmark**: "Better Together" in Inter 700 weight
- **Icon**: 💕 (two hearts) — used as favicon, nav icon, and loading state
- **Tagline**: "Your AI-powered relationship intelligence platform"

### Color Palette

| Token                | Hex       | Usage                              |
|----------------------|-----------|------------------------------------|
| `--bt-pink-50`       | `#fdf2f8` | Background tints, hover states     |
| `--bt-pink-100`      | `#fce7f3` | Light card backgrounds             |
| `--bt-pink-500`      | `#ec4899` | Primary brand color, CTAs          |
| `--bt-pink-600`      | `#db2777` | Primary hover, active states       |
| `--bt-pink-700`      | `#be185d` | Pressed states, emphasis           |
| `--bt-pink-800`      | `#9d174d` | Dark accents                       |
| `--bt-purple-500`    | `#8b5cf6` | Secondary brand, gradients         |
| `--bt-purple-600`    | `#7c3aed` | Secondary hover                    |
| `--bt-purple-700`    | `#6d28d9` | Secondary emphasis                 |
| `--bt-blue-500`      | `#3b82f6` | Tertiary accent, links             |
| `--bt-coral`         | `#FF6B9D` | Warm accent, paywall hero          |
| `--bt-success`       | `#10b981` | Success states, streaks            |
| `--bt-warning`       | `#f59e0b` | Warnings, streak fire              |
| `--bt-error`         | `#ef4444` | Error states, destructive actions  |

**Signature Gradient**: `linear-gradient(135deg, #FF6B9D 0%, #8B5CF6 50%, #3B82F6 100%)`
**Subtle Background**: `linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%)`
**Scrollbar / Accent Gradient**: `linear-gradient(to bottom, #ec4899, #8b5cf6)`

### Typography

| Role         | Font              | Weight | Size         | Line Height |
|-------------|-------------------|--------|--------------|-------------|
| Display     | Inter             | 800    | 48px / 3rem  | 1.1         |
| H1          | Inter             | 700    | 36px / 2.25rem | 1.2       |
| H2          | Inter             | 700    | 30px / 1.875rem | 1.3     |
| H3          | Inter             | 600    | 24px / 1.5rem | 1.4       |
| Body        | Inter             | 400    | 16px / 1rem  | 1.6         |
| Body Small  | Inter             | 400    | 14px / 0.875rem | 1.5     |
| Caption     | Inter             | 500    | 12px / 0.75rem | 1.4      |
| Button      | Inter             | 600    | 16px / 1rem  | 1           |

**Gradient Text**: `.text-gradient` — pink-to-purple gradient clip for headlines

### Iconography
- **Library**: Font Awesome 6 (solid/regular)
- **Emoji**: System emoji for mood states, celebrations, gamification
- **Size Scale**: 16px (inline), 20px (buttons), 24px (cards), 32px (features)

### Elevation & Shadows

| Level    | CSS Value                                      | Usage               |
|----------|------------------------------------------------|---------------------|
| Flat     | `none`                                         | Inline elements     |
| Low      | `0 1px 3px rgba(0,0,0,0.1)`                   | Subtle cards        |
| Medium   | `0 4px 6px rgba(0,0,0,0.1)`                   | Cards, buttons      |
| High     | `0 10px 30px rgba(0,0,0,0.1)`                 | Hover states        |
| Glow     | `0 0 30px rgba(236,72,153,0.5)`               | CTA emphasis        |
| Glass    | `0 25px 45px -12px rgba(0,0,0,0.1)`           | Liquid glass panels |

### Motion & Animation

| Animation         | Duration | Easing               | Usage                    |
|-------------------|----------|----------------------|--------------------------|
| fade-in-up        | 800ms    | ease-out             | Page entrance            |
| fade-in-left/right| 800ms    | ease-out             | Staggered content        |
| scale-in          | 600ms    | ease-out             | Modal/card entrance      |
| float             | 6s       | ease-in-out infinite | Decorative elements      |
| glow              | 2s       | ease-in-out infinite | CTA pulse                |
| gradient-shift    | 3s       | ease infinite        | Background animation     |
| hover-lift        | 300ms    | ease                 | Card hover (translateY -5px, scale 1.02) |

### Spacing Scale
Uses Tailwind default 4px base: 1 (4px), 2 (8px), 3 (12px), 4 (16px), 6 (24px), 8 (32px), 12 (48px), 16 (64px), 20 (80px), 24 (96px)

### Border Radius
- **Small**: 8px (`rounded-lg`)
- **Medium**: 12px (`rounded-xl`)
- **Large**: 16px (`rounded-2xl`)
- **Pill**: 9999px (`rounded-full`)

---

## Jesus Entered the Chat — Brand Identity

### Brand Personality
- **Reverent** — respectful of faith, scripture-centered
- **Welcoming** — inclusive, conversational, non-judgmental
- **Contemporary** — modern tech meets timeless wisdom
- **Community-driven** — connection, shared reading, group prayer

### Logo & Mark
- **Wordmark**: "Jesus Entered the Chat" in Inter 700
- **Icon**: Cross or dove motif (minimal, geometric)
- **Tagline**: "Faith, conversation, community"

### Color Palette

| Token                | Hex       | Usage                              |
|----------------------|-----------|------------------------------------|
| `--jetc-gold-50`     | `#FFFBEB` | Background tints                   |
| `--jetc-gold-100`    | `#FEF3C7` | Light card backgrounds             |
| `--jetc-gold-400`    | `#FBBF24` | Accent, highlights                 |
| `--jetc-gold-500`    | `#F59E0B` | Primary gold accent                |
| `--jetc-indigo-50`   | `#EEF2FF` | Light background                   |
| `--jetc-indigo-500`  | `#6366F1` | Primary brand color                |
| `--jetc-indigo-600`  | `#4F46E5` | Primary hover                      |
| `--jetc-indigo-700`  | `#4338CA` | Active/pressed                     |
| `--jetc-indigo-900`  | `#312E81` | Deep accents, dark mode primary    |
| `--jetc-sky-100`     | `#E0F2FE` | Info backgrounds                   |
| `--jetc-sky-500`     | `#0EA5E9` | Secondary accent, links            |
| `--jetc-warm-50`     | `#FFF7ED` | Warm background variant            |
| `--jetc-warm-500`    | `#F97316` | Warm accent (community)            |
| `--jetc-sage-100`    | `#DCFCE7` | Success/growth                     |
| `--jetc-sage-500`    | `#22C55E` | Completed states                   |
| `--jetc-slate-800`   | `#1E293B` | Dark mode background               |
| `--jetc-slate-900`   | `#0F172A` | Darkest background                 |

**Signature Gradient**: `linear-gradient(135deg, #6366F1 0%, #0EA5E9 50%, #F59E0B 100%)`
**Subtle Background**: `linear-gradient(135deg, #EEF2FF 0%, #E0F2FE 50%, #FFFBEB 100%)`
**Faith Gradient**: `linear-gradient(135deg, #312E81 0%, #4F46E5 100%)` (for dark/reverent sections)

### Typography

| Role         | Font              | Weight | Size           | Line Height |
|-------------|-------------------|--------|----------------|-------------|
| Display     | Inter             | 800    | 48px / 3rem    | 1.1         |
| H1          | Inter             | 700    | 36px / 2.25rem | 1.2         |
| H2          | Inter             | 700    | 30px / 1.875rem| 1.3         |
| H3          | Inter             | 600    | 24px / 1.5rem  | 1.4         |
| Body        | Inter             | 400    | 16px / 1rem    | 1.7         |
| Scripture   | Inter             | 300    | 18px / 1.125rem| 1.8         |
| Caption     | Inter             | 500    | 12px / 0.75rem | 1.4         |
| Button      | Inter             | 600    | 16px / 1rem    | 1           |

**Note**: Scripture text uses lighter weight (300) and slightly larger size with generous line height for readability and reverence.

### Iconography
- **Library**: Lucide React (consistent with shadcn/ui), Radix Icons
- **Style**: Outlined, 1.5px stroke, rounded caps
- **Faith Icons**: Cross, dove, book (Bible), flame (Holy Spirit), hands (prayer)
- **Size Scale**: 16px (inline), 20px (buttons), 24px (cards), 32px (features)

### Elevation & Shadows (Glassmorphism)

JETC uses a glassmorphism design language inspired by visionOS:

| Level       | CSS                                              | Usage               |
|-------------|--------------------------------------------------|---------------------|
| Glass Light | `blur(20px) saturate(200%); rgba(255,255,255,0.25)` | Light cards       |
| Glass Base  | `blur(40px) saturate(180%); rgba(255,255,255,0.1)`  | Standard panels   |
| Glass Dark  | `blur(40px) saturate(180%); rgba(0,0,0,0.3)`        | Dark mode panels  |
| Glass Hover | `translateY(-4px) scale(1.01)` + enhanced shadow    | Interactive cards |
| Glass Border| `1px solid rgba(255,255,255,0.18)`                   | All glass elements|

### Motion & Animation

| Animation    | Duration | Easing                  | Usage                    |
|-------------|----------|-------------------------|--------------------------|
| shadow-slide | 4s      | linear alternate infinite| Background decorations   |
| accordion    | 200ms   | ease-out                | Expandable sections      |
| glass-hover  | 400ms   | cubic-bezier(0.4,0,0.2,1)| Card interactions     |
| fade-in      | 600ms   | ease-out                | Page transitions         |

---

## Shared Foundations

### Design Principles
1. **Mobile-first**: Design for 375px, enhance for larger screens
2. **Accessible**: WCAG 2.1 AA minimum — 4.5:1 contrast for text, 3:1 for large text
3. **Performance**: CDN-loaded assets, minimal custom CSS, system font fallbacks
4. **Consistent spacing**: 4px grid system (Tailwind default)
5. **Progressive disclosure**: Show essential info first, details on interaction

### Breakpoints

| Name   | Min Width | Tailwind Prefix |
|--------|-----------|-----------------|
| Mobile | 0px       | (default)       |
| SM     | 640px     | `sm:`           |
| MD     | 768px     | `md:`           |
| LG     | 1024px    | `lg:`           |
| XL     | 1280px    | `xl:`           |
| 2XL    | 1536px    | `2xl:`          |

### Shared Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Shared Icon Libraries
- Font Awesome 6 (Better Together)
- Lucide React / Radix Icons (JETC)

---

## Component Library

### Buttons

#### Better Together
| Variant    | Classes / Styles                                                  |
|-----------|-------------------------------------------------------------------|
| Primary   | `bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg` hover: `bg-pink-700 scale-105` |
| Secondary | `bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 shadow-md` |
| Ghost     | `text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg`           |
| Gradient  | `bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold shadow-xl` |
| Danger    | `bg-red-500 text-white px-6 py-3 rounded-lg`                    |

#### JETC
| Variant    | Classes / Styles                                                  |
|-----------|-------------------------------------------------------------------|
| Primary   | `bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg` hover: `bg-indigo-700` |
| Secondary | `bg-white text-indigo-700 px-6 py-3 rounded-lg border border-indigo-200` |
| Ghost     | `text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg`      |
| Gold      | `bg-gradient-to-r from-amber-400 to-yellow-500 text-indigo-900 px-8 py-4 rounded-xl font-bold` |
| Faith     | `bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-6 py-3 rounded-xl` |

### Cards

#### Better Together
- **Standard Card**: `bg-white rounded-2xl shadow-lg` → hover: `shadow-2xl translate-y-[-4px]`
- **Feature Card**: `bg-white rounded-2xl p-8 shadow-lg` → hover: `shadow-xl translate-y-[-4px]`
- **Glass Card**: `bg-white/95 backdrop-blur-[20px] rounded-2xl shadow-lg`
- **Gradient Card**: `bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl p-6`
- **Streak Banner**: `bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white`

#### JETC
- **Glass Container**: `glass-container` — full glassmorphism with blur(40px), border, hover transform
- **Glass Card Light**: `glass-card-light` — lighter glass variant for overlays
- **Scripture Card**: `bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl p-6` — left-bordered for Bible verses
- **Reading Plan Card**: `bg-white rounded-2xl shadow-md p-6 border border-indigo-100`
- **Community Card**: `bg-gradient-to-br from-indigo-600 to-sky-500 text-white rounded-2xl p-6`

### Form Inputs

#### Shared Patterns
- **Text Input**: `w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-{brand}-500 focus:ring-2 focus:ring-{brand}-200 transition`
- **Textarea**: Same as input + `resize-none min-h-[100px]`
- **Select**: Styled native select with custom arrow
- **Checkbox/Radio**: Custom styled with brand colors
- **Slider** (BT mood): Custom `-webkit-slider-thumb` with brand gradient track

### Navigation

#### Better Together
- **Top Nav**: `bg-white shadow-sm border-b sticky top-0 z-50` — logo left, links center, auth right
- **Mobile Hamburger**: Hidden on md+, slide-in drawer on mobile
- **Back Button**: `text-gray-600 hover:text-pink-600` with left arrow icon

#### JETC
- **Top Nav**: Glassmorphism header with blur backdrop
- **Sidebar** (desktop): Glass panel with icon-based navigation
- **Bottom Tab Bar** (mobile): Fixed bottom with 5 tabs (Home, Bible, Chat, Plans, Profile)

### Modals & Overlays
- **Backdrop**: `bg-black/50 backdrop-blur-sm`
- **Modal Panel**: `bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto`
- **Toast**: Bottom-right floating, auto-dismiss 3-5s, brand-colored left border

### Loading States
- **Spinner**: CSS `spin` animation, 20px circle with brand-colored `border-top`
- **Skeleton**: `bg-gray-200 rounded animate-pulse` — placeholder for loading content
- **Progress Bar**: `bg-gradient-to-r from-{brand-start} to-{brand-end} rounded-full h-2`

---

## Key Screens — Better Together

### 1. Onboarding Flow
- **Background**: Subtle pink-to-purple gradient
- **Steps**: Name → Relationship status → Love languages → Partner invite
- **Progress indicator**: Dots or segmented bar with pink fill
- **Illustration style**: Emoji-based (💕 🤝 💪 🎯)
- **CTA**: Gradient button ("Continue", "Get Started")

### 2. Daily Check-in
- **Background**: `linear-gradient(135deg, #fdf2f8, #fce7f3, #f5f3ff)`
- **Mood selector**: 5 emoji buttons (😢 😕 😐 🙂 😊) with scale-on-select
- **Connection score**: Custom range slider with pink-purple gradient track
- **Glass cards**: `bg-white/95 backdrop-blur rounded-2xl shadow-lg`
- **Streak banner**: Amber-to-orange gradient with fire emoji

### 3. Couples Dashboard
- **Layout**: 2-column on desktop, stacked on mobile
- **Stat cards**: White cards with icon containers (gradient backgrounds)
- **Relationship health**: Circular progress indicator with pink gradient
- **Activity feed**: Timeline with avatar pairs, timestamps
- **Quick actions**: Grid of icon buttons (Check-in, Goals, Activities, Chat)

### 4. Coaching Sessions (AI Coach)
- **Chat interface**: Message bubbles — user (pink bg, right-aligned), AI (gray bg, left-aligned)
- **Input area**: Glass card at bottom with text input + send button
- **Session topics**: Tag pills with gradient backgrounds
- **Premium badge**: Gold/amber accent for premium coaching features

### 5. Subscription Flow
- **Hero section**: Full-width gradient background (`#FF6B9D → #8B5CF6 → #3B82F6`)
- **Floating hearts**: Animated emoji decoration
- **Plan cards**: White cards with pink/purple accents
  - "Try It Out": $30/mo — bordered card
  - "Better Together": $240/yr ($20/mo) — featured card with gradient border + "BEST VALUE" badge
- **Feature comparison**: Checkmark list with pink checks
- **CTA**: Full-width gradient button with glow animation

---

## Key Screens — JETC

### 1. Bible Chat
- **Layout**: Full-screen chat interface with glass panels
- **Background**: Deep indigo gradient (`#312E81 → #4F46E5`) or light mode indigo-50
- **Message bubbles**: User (indigo glass), AI (lighter glass with gold accent)
- **Scripture references**: Inline cards with book/chapter/verse, gold left border
- **Input**: Glass input bar at bottom with send + attachment icons

### 2. Daily Verse
- **Hero card**: Large glassmorphism card centered on screen
- **Verse text**: Inter 300 weight, 18px, generous line-height (1.8)
- **Reference**: Gold-accented caption below verse
- **Background**: Subtle gradient with ambient animation
- **Actions**: Share, Save, Reflect buttons below card
- **Verse of the day banner**: Gold-to-amber gradient strip

### 3. Reading Plans
- **Plan grid**: 2-column responsive grid of plan cards
- **Plan card**: White/glass card with cover image, title, progress bar
- **Progress bar**: Indigo-to-sky gradient, rounded-full
- **Active plan view**: Day-by-day checklist with scripture references
- **Completion celebration**: Confetti animation + gold badge

### 4. Community Hub
- **Layout**: Feed-style with group cards and discussion threads
- **Group cards**: Glass containers with member count, topic tags
- **Prayer requests**: Warm-toned cards (orange/amber accents)
- **Discussion threads**: Nested comment UI with indigo accents
- **Live events**: Sky-blue accent cards with countdown timers

### 5. Subscription Flow
- **Hero section**: Indigo-to-sky gradient background
- **Plan cards**: Glass cards with gold accent for premium
  - "Seeker": Free tier — basic features
  - "Disciple": Monthly — full access
  - "Ministry": Annual — best value + community leadership tools
- **Feature list**: Checkmarks with indigo checks
- **CTA**: Gold gradient button for premium, indigo for standard

---

## Design Tokens Reference

All tokens are defined as CSS custom properties in `public/static/design-tokens.css` and can be imported into any page or component.

### Token Naming Convention
```
--{brand}-{category}-{variant}

Brands: bt (Better Together), jetc (Jesus Entered the Chat)
Categories: color, font, space, radius, shadow, animation
```

### Usage in Tailwind
Tokens map to Tailwind's `theme.extend.colors` configuration for use with utility classes.

### Usage in Paper.dev
Import the design tokens CSS file and reference variables directly in Paper.dev component styles. Each component should specify which brand context it renders in.

---

## Exportable Assets

### For Paper.dev
1. **`design-tokens.css`** — All CSS custom properties for both brands
2. **`/design-system` route** — Live, browseable component showcase
3. **Color swatches** — Hex values in this document for direct Paper.dev input
4. **Typography specimens** — Font family, weights, and sizes defined above

### File Locations
- Design tokens: `public/static/design-tokens.css`
- Design system page: `src/design-system.ts` (accessible at `/design-system`)
- This document: `docs/DESIGN_SYSTEM.md`

### Brand Asset Checklist
- [x] Color palette — both brands
- [x] Typography scale — both brands
- [x] Component library — buttons, cards, forms, navigation
- [x] Key screen specifications — 5 screens per brand
- [x] Animation/motion specs
- [x] Elevation/shadow system
- [x] Spacing & layout grid
- [x] Design tokens CSS file
- [x] Live design system page
