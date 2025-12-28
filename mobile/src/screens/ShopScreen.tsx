import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, SPACING, FONT_SIZES, GRADIENTS, SHADOWS, BORDER_RADIUS } from '../utils/constants'
import { GradientHeader } from '../components/GradientHeader'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - SPACING.lg * 3) / 2

// Bundle Types
type BundleCategory = 'monthly' | 'special' | 'merchandise'

interface Bundle {
  id: string
  name: string
  subtitle?: string
  emoji: string
  price: number
  originalPrice?: number
  description: string
  items?: string[]
  badge?: string
  badgeType?: 'popular' | 'limited' | 'new'
  category: BundleCategory
}

const MONTHLY_BUNDLES: Bundle[] = [
  { id: 'jan', name: 'January', subtitle: 'Love Goals', emoji: '🎯', price: 49.99, description: 'Start the year with relationship resolutions', category: 'monthly' },
  { id: 'feb', name: 'February', subtitle: "Valentine's Magic", emoji: '💕', price: 59.99, description: 'Love is in the Air Edition', badge: 'MOST POPULAR', badgeType: 'popular', items: ['First Dance Music Box', 'Love Letter Kit', '52 Reasons Cards', 'Massage Oil Set'], category: 'monthly' },
  { id: 'mar', name: 'March', subtitle: 'Spring Renewal', emoji: '🌸', price: 49.99, description: 'Fresh beginnings and new adventures', category: 'monthly' },
  { id: 'apr', name: 'April', subtitle: 'Playful Partners', emoji: '🎮', price: 49.99, description: 'Games, fun activities, and laughter', category: 'monthly' },
  { id: 'may', name: 'May', subtitle: 'Wedding Season', emoji: '💒', price: 49.99, description: 'Celebrate love and commitment', category: 'monthly' },
  { id: 'jun', name: 'June', subtitle: 'Adventure Together', emoji: '🏔️', price: 54.99, description: 'Outdoor activities and exploration', category: 'monthly' },
  { id: 'jul', name: 'July', subtitle: 'Summer Romance', emoji: '☀️', price: 49.99, description: 'Beach dates and warm memories', category: 'monthly' },
  { id: 'aug', name: 'August', subtitle: 'Gratitude & Growth', emoji: '🌻', price: 49.99, description: 'Appreciation and reflection', category: 'monthly' },
  { id: 'oct', name: 'October', subtitle: 'Spooky Couples', emoji: '🎃', price: 49.99, description: 'Halloween fun and cozy movie nights', badge: 'SEASONAL', badgeType: 'new', category: 'monthly' },
  { id: 'nov', name: 'November', subtitle: 'Thankful Hearts', emoji: '🦃', price: 49.99, description: 'Gratitude practices and cozy activities', category: 'monthly' },
  { id: 'dec', name: 'December', subtitle: 'Cozy Nights', emoji: '❄️', price: 59.99, description: 'Winter Warmth Edition', badge: 'BEST SELLER', badgeType: 'popular', items: ['Matching Pajamas', 'Hot Cocoa Set', 'Fireside Candle', 'Holiday Ornament'], category: 'monthly' },
]

const SPECIAL_BUNDLES: Bundle[] = [
  {
    id: 'intimate',
    name: 'Intimate Moments',
    emoji: '💗',
    price: 89.99,
    originalPrice: 120,
    description: 'Deepen your connection',
    badge: 'LIMITED',
    badgeType: 'limited',
    items: ['Silk Sleep Mask Set', 'Premium Candles', 'Massage Oil Set', 'Relationship Journal'],
    category: 'special'
  },
  {
    id: 'platinum',
    name: 'Platinum Collection',
    emoji: '👑',
    price: 199.99,
    originalPrice: 350,
    description: 'Ultimate relationship package',
    badge: 'LIFETIME',
    badgeType: 'popular',
    items: ['Promise Rings', 'Premium Journal', 'Crystal Heart', 'Lifetime App Access'],
    category: 'special'
  },
  {
    id: 'wellness',
    name: 'Wellness Together',
    emoji: '🧘',
    price: 79.99,
    originalPrice: 110,
    description: 'Mind Body Soul Edition',
    badge: 'NEW',
    badgeType: 'new',
    items: ['Matching Yoga Mats', 'Meditation Guide', 'Aromatherapy Set', 'Recipe Cards'],
    category: 'special'
  },
]

const MERCHANDISE: Bundle[] = [
  { id: 'mugs', name: 'Couples Mugs', emoji: '☕', price: 24.99, description: 'Soulmate Fuel, Love Perks', category: 'merchandise' },
  { id: 'shirts', name: 'Matching T-Shirts', emoji: '👕', price: 39.99, description: 'His/Hers, King/Queen', category: 'merchandise' },
  { id: 'hoodies', name: 'Couples Hoodies', emoji: '🧥', price: 59.99, description: 'Cozy matching sets', category: 'merchandise' },
  { id: 'accessories', name: 'Accessories', emoji: '💍', price: 14.99, description: 'Bracelets, keychains', category: 'merchandise' },
]

export default function ShopScreen() {
  const insets = useSafeAreaInsets()
  const [selectedCategory, setSelectedCategory] = useState<BundleCategory>('monthly')

  const handlePurchase = (bundle: Bundle) => {
    Alert.alert(
      'Add to Cart',
      `Add ${bundle.name} ($${bundle.price}) to your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add to Cart', onPress: () => Alert.alert('Added!', 'Item added to cart') }
      ]
    )
  }

  const renderBadge = (badge: string, type?: string) => {
    let colors: readonly [string, string] = GRADIENTS.primary
    if (type === 'limited') colors = ['#f59e0b', '#ef4444'] as const
    if (type === 'new') colors = ['#10b981', '#3b82f6'] as const

    return (
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.badge}
      >
        <Text style={styles.badgeText}>{badge}</Text>
      </LinearGradient>
    )
  }

  const renderMonthlyCard = (bundle: Bundle) => (
    <TouchableOpacity
      key={bundle.id}
      style={styles.monthlyCard}
      onPress={() => handlePurchase(bundle)}
      activeOpacity={0.8}
    >
      <BlurView intensity={80} tint="light" style={styles.cardBlur}>
        {bundle.badge && renderBadge(bundle.badge, bundle.badgeType)}
        <Text style={styles.cardEmoji}>{bundle.emoji}</Text>
        <Text style={styles.cardTitle}>{bundle.name}</Text>
        <Text style={styles.cardSubtitle}>{bundle.subtitle}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{bundle.description}</Text>
        {bundle.items && (
          <View style={styles.itemsList}>
            {bundle.items.slice(0, 2).map((item, idx) => (
              <Text key={idx} style={styles.itemText}>• {item}</Text>
            ))}
            {bundle.items.length > 2 && (
              <Text style={styles.moreItems}>+{bundle.items.length - 2} more</Text>
            )}
          </View>
        )}
        <Text style={styles.price}>${bundle.price}/month</Text>
      </BlurView>
    </TouchableOpacity>
  )

  const renderSpecialCard = (bundle: Bundle) => (
    <TouchableOpacity
      key={bundle.id}
      style={styles.specialCard}
      onPress={() => handlePurchase(bundle)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={bundle.id === 'platinum' ? GRADIENTS.purple : bundle.id === 'wellness' ? ['#10b981', '#059669'] as const : GRADIENTS.pink}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.specialCardHeader}
      >
        {bundle.badge && renderBadge(bundle.badge, bundle.badgeType)}
        <Text style={styles.specialEmoji}>{bundle.emoji}</Text>
        <Text style={styles.specialTitle}>{bundle.name}</Text>
        <Text style={styles.specialSubtitle}>{bundle.description}</Text>
      </LinearGradient>

      <View style={styles.specialCardBody}>
        {bundle.items?.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.itemLabel}>{item}</Text>
          </View>
        ))}
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.specialPrice}>${bundle.price}</Text>
            {bundle.originalPrice && (
              <Text style={styles.originalPrice}>${bundle.originalPrice}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderMerchCard = (bundle: Bundle) => (
    <TouchableOpacity
      key={bundle.id}
      style={styles.merchCard}
      onPress={() => handlePurchase(bundle)}
      activeOpacity={0.8}
    >
      <BlurView intensity={80} tint="light" style={styles.merchBlur}>
        <Text style={styles.merchEmoji}>{bundle.emoji}</Text>
        <Text style={styles.merchTitle}>{bundle.name}</Text>
        <Text style={styles.merchDescription}>{bundle.description}</Text>
        <Text style={styles.merchPrice}>${bundle.price}</Text>
      </BlurView>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#fdf2f8', '#f5f3ff', '#fce7f3']}
        style={StyleSheet.absoluteFill}
      />

      <GradientHeader title="Shop Bundles" subtitle="Curated experiences for couples" />

      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        {(['monthly', 'special', 'merchandise'] as BundleCategory[]).map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.tab, selectedCategory === category && styles.tabActive]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.tabText, selectedCategory === category && styles.tabTextActive]}>
              {category === 'monthly' ? '📦 Monthly' : category === 'special' ? '✨ Special' : '🛍️ Merch'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {selectedCategory === 'monthly' && (
          <>
            <Text style={styles.sectionTitle}>2025 Monthly Themes</Text>
            <Text style={styles.sectionSubtitle}>Subscribe and receive a new themed box every month</Text>
            <View style={styles.monthlyGrid}>
              {MONTHLY_BUNDLES.map(renderMonthlyCard)}
            </View>

            {/* Subscribe CTA */}
            <TouchableOpacity style={styles.subscribeCta} activeOpacity={0.8}>
              <LinearGradient
                colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.subscribeGradient}
              >
                <Text style={styles.subscribeText}>Subscribe Monthly - $49.99/mo</Text>
                <Text style={styles.subscribeSubtext}>Cancel anytime • Free shipping</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {selectedCategory === 'special' && (
          <>
            <Text style={styles.sectionTitle}>Special Edition Bundles</Text>
            <Text style={styles.sectionSubtitle}>Premium curated collections for special occasions</Text>
            {SPECIAL_BUNDLES.map(renderSpecialCard)}

            {/* Custom Wall Art */}
            <View style={styles.wallArtCard}>
              <BlurView intensity={80} tint="light" style={styles.wallArtBlur}>
                <View style={styles.wallArtContent}>
                  <Text style={styles.wallArtBadge}>PERSONALIZED</Text>
                  <Text style={styles.wallArtEmoji}>🖼️</Text>
                  <Text style={styles.wallArtTitle}>Custom Wall Art</Text>
                  <Text style={styles.wallArtDescription}>
                    Create personalized artwork with your names, dates, and meaningful quotes.
                  </Text>
                  <View style={styles.wallArtFeatures}>
                    <Text style={styles.wallArtFeature}>🎨 Multiple designs</Text>
                    <Text style={styles.wallArtFeature}>💕 Custom names & dates</Text>
                    <Text style={styles.wallArtFeature}>🖨️ Premium prints</Text>
                  </View>
                  <View style={styles.wallArtPriceRow}>
                    <Text style={styles.wallArtPrice}>From $39.99</Text>
                    <TouchableOpacity style={styles.createButton}>
                      <Text style={styles.createButtonText}>Create Yours</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </BlurView>
            </View>
          </>
        )}

        {selectedCategory === 'merchandise' && (
          <>
            <Text style={styles.sectionTitle}>Couples Merchandise</Text>
            <Text style={styles.sectionSubtitle}>Show off your love with matching items</Text>
            <View style={styles.merchGrid}>
              {MERCHANDISE.map(renderMerchCard)}
            </View>
          </>
        )}

        {/* Hearts Loyalty Program */}
        <View style={styles.loyaltySection}>
          <LinearGradient
            colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loyaltyCard}
          >
            <Text style={styles.loyaltyEmoji}>💖</Text>
            <Text style={styles.loyaltyTitle}>Hearts Loyalty Program</Text>
            <Text style={styles.loyaltySubtitle}>Earn hearts with every purchase and unlock rewards!</Text>

            <View style={styles.tiersRow}>
              <View style={styles.tier}>
                <Text style={styles.tierEmoji}>💕</Text>
                <Text style={styles.tierName}>New Love</Text>
                <Text style={styles.tierRange}>0-499</Text>
              </View>
              <View style={styles.tier}>
                <Text style={styles.tierEmoji}>💖</Text>
                <Text style={styles.tierName}>Growing</Text>
                <Text style={styles.tierRange}>500-999</Text>
              </View>
              <View style={styles.tier}>
                <Text style={styles.tierEmoji}>💝</Text>
                <Text style={styles.tierName}>Connected</Text>
                <Text style={styles.tierRange}>1000-2499</Text>
              </View>
              <View style={[styles.tier, styles.tierHighlight]}>
                <Text style={styles.tierEmoji}>👑</Text>
                <Text style={styles.tierName}>Soulmates</Text>
                <Text style={styles.tierRange}>2500+</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join Free</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray800,
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  monthlyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  monthlyCard: {
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  cardBlur: {
    padding: SPACING.md,
    minHeight: 180,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.xs,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  cardEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  cardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  itemsList: {
    marginBottom: SPACING.sm,
  },
  itemText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  moreItems: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },
  price: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  specialCard: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.heavy,
  },
  specialCardHeader: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  specialEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  specialTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  specialSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.9)',
  },
  specialCardBody: {
    backgroundColor: '#fff',
    padding: SPACING.lg,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  checkmark: {
    fontSize: FONT_SIZES.md,
    color: COLORS.success,
    marginRight: SPACING.sm,
    fontWeight: '700',
  },
  itemLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray800,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  specialPrice: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  originalPrice: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  buyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  merchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  merchCard: {
    width: CARD_WIDTH,
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  merchBlur: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  merchEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  merchTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.gray900,
    textAlign: 'center',
  },
  merchDescription: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: SPACING.sm,
  },
  merchPrice: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subscribeCta: {
    marginTop: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  subscribeGradient: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  subscribeText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#fff',
  },
  subscribeSubtext: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
  wallArtCard: {
    marginTop: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  wallArtBlur: {
    padding: SPACING.lg,
  },
  wallArtContent: {
    alignItems: 'center',
  },
  wallArtBadge: {
    backgroundColor: COLORS.success,
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
  },
  wallArtEmoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  wallArtTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  wallArtDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: SPACING.md,
  },
  wallArtFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  wallArtFeature: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray800,
  },
  wallArtPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  wallArtPrice: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  loyaltySection: {
    marginTop: SPACING.xl,
  },
  loyaltyCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  loyaltyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  loyaltyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: '#fff',
  },
  loyaltySubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  tiersRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  tier: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.sm,
    alignItems: 'center',
    flex: 1,
  },
  tierHighlight: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tierEmoji: {
    fontSize: 20,
  },
  tierName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    marginTop: 2,
  },
  tierRange: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.8)',
  },
  joinButton: {
    backgroundColor: '#fff',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  joinButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZES.md,
  },
})
