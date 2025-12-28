// Better Together Mobile: Enhanced Profile Screen
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  Modal,
  Switch,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useAuth } from '../hooks/useAuth'
import { apiClient } from '../api/client'
import { COLORS, SPACING, FONT_SIZES, GRADIENTS, GLASSMORPHISM, SHADOWS } from '../utils/constants'

const { width } = Dimensions.get('window')

const LOVE_LANGUAGES = [
  { id: 'words_of_affirmation', label: 'Words of Affirmation', icon: 'chatbubble-ellipses', color: '#FF6B9D' },
  { id: 'quality_time', label: 'Quality Time', icon: 'time', color: '#9B6BFF' },
  { id: 'receiving_gifts', label: 'Receiving Gifts', icon: 'gift', color: '#FFB86B' },
  { id: 'acts_of_service', label: 'Acts of Service', icon: 'hand-left', color: '#6BB5FF' },
  { id: 'physical_touch', label: 'Physical Touch', icon: 'heart', color: '#FF8E53' },
]

const MENU_SECTIONS = [
  {
    title: 'Relationship',
    items: [
      { id: 'partner', label: 'Partner Settings', icon: 'people', route: 'PartnerSettings' },
      { id: 'anniversary', label: 'Anniversary & Dates', icon: 'calendar-outline', route: 'Dates' },
      { id: 'goals', label: 'Relationship Goals', icon: 'flag', route: 'Goals' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', label: 'Notifications', icon: 'notifications-outline', hasToggle: true },
      { id: 'reminders', label: 'Daily Reminders', icon: 'alarm-outline', hasToggle: true },
      { id: 'privacy', label: 'Privacy Settings', icon: 'lock-closed-outline', route: 'Privacy' },
    ]
  },
  {
    title: 'Support',
    items: [
      { id: 'help', label: 'Help & FAQ', icon: 'help-circle-outline', route: 'Help' },
      { id: 'feedback', label: 'Send Feedback', icon: 'chatbox-outline', route: 'Feedback' },
      { id: 'about', label: 'About Better Together', icon: 'information-circle-outline', route: 'About' },
    ]
  }
]

const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showLoveLanguageModal, setShowLoveLanguageModal] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [editNickname, setEditNickname] = useState(user?.nickname || '')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    )
  }

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name is required')
      return
    }

    setSaving(true)
    try {
      const { data, error } = await apiClient.updateProfile(user?.id || '', {
        name: editName.trim(),
        nickname: editNickname.trim() || null,
      })

      if (data && !error) {
        updateUser?.({ ...user, name: editName, nickname: editNickname })
        setShowEditModal(false)
        Alert.alert('Success', 'Profile updated successfully')
      } else {
        Alert.alert('Error', 'Failed to update profile')
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile')
    }
    setSaving(false)
  }

  const handleSelectLoveLanguage = async (languageId: string, isPrimary: boolean) => {
    try {
      const updates = isPrimary
        ? { primary_love_language: languageId }
        : { secondary_love_language: languageId }

      const { data, error } = await apiClient.updateProfile(user?.id || '', updates)

      if (data && !error) {
        updateUser?.({
          ...user,
          ...(isPrimary
            ? { primaryLoveLanguage: languageId }
            : { secondaryLoveLanguage: languageId }),
        })
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update love language')
    }
  }

  const getLoveLanguageLabel = (id: string | undefined) => {
    if (!id) return 'Not set'
    return LOVE_LANGUAGES.find(l => l.id === id)?.label || 'Not set'
  }

  const renderMenuItem = (item: any, isLast: boolean) => {
    if (item.hasToggle) {
      const isEnabled = item.id === 'notifications' ? notificationsEnabled : remindersEnabled
      const setEnabled = item.id === 'notifications' ? setNotificationsEnabled : setRemindersEnabled

      return (
        <View key={item.id} style={[styles.menuItem, !isLast && styles.menuItemBorder]}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIcon, { backgroundColor: `${COLORS.primary}15` }]}>
              <Ionicons name={item.icon} size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuItemLabel}>{item.label}</Text>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={setEnabled}
            trackColor={{ false: COLORS.border, true: `${COLORS.primary}50` }}
            thumbColor={isEnabled ? COLORS.primary : '#f4f3f4'}
          />
        </View>
      )
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.menuItem, !isLast && styles.menuItemBorder]}
        onPress={() => item.route && navigation.navigate(item.route)}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: `${COLORS.primary}15` }]}>
            <Ionicons name={item.icon} size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.menuItemLabel}>{item.label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
        style={styles.headerGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>

            <View style={styles.profileCard}>
              <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
                {user?.profilePhotoUrl ? (
                  <Image source={{ uri: user.profilePhotoUrl }} style={styles.avatar} />
                ) : (
                  <LinearGradient
                    colors={['#FFB6C1', '#FF69B4']}
                    style={styles.avatarPlaceholder}
                  >
                    <Text style={styles.avatarInitial}>
                      {user?.name?.charAt(0).toUpperCase() || '?'}
                    </Text>
                  </LinearGradient>
                )}
                <View style={styles.editAvatarBadge}>
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              {user?.nickname && (
                <Text style={styles.userNickname}>"{user.nickname}"</Text>
              )}
              <Text style={styles.userEmail}>{user?.email}</Text>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setShowEditModal(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="pencil" size={16} color={COLORS.primary} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Love Languages Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Love Languages</Text>
            <TouchableOpacity
              style={[styles.loveLanguageCard, GLASSMORPHISM.light, SHADOWS.card]}
              onPress={() => setShowLoveLanguageModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.loveLanguageRow}>
                <View style={styles.loveLanguageItem}>
                  <Text style={styles.loveLanguageLabel}>Primary</Text>
                  <View style={styles.loveLanguageValue}>
                    <Ionicons name="heart" size={16} color="#FF6B9D" />
                    <Text style={styles.loveLanguageText}>
                      {getLoveLanguageLabel(user?.primaryLoveLanguage)}
                    </Text>
                  </View>
                </View>
                <View style={styles.loveLanguageDivider} />
                <View style={styles.loveLanguageItem}>
                  <Text style={styles.loveLanguageLabel}>Secondary</Text>
                  <View style={styles.loveLanguageValue}>
                    <Ionicons name="heart-outline" size={16} color="#9B6BFF" />
                    <Text style={styles.loveLanguageText}>
                      {getLoveLanguageLabel(user?.secondaryLoveLanguage)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.loveLanguageArrow}>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Menu Sections */}
          {MENU_SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={[styles.menuCard, GLASSMORPHISM.light, SHADOWS.card]}>
                {section.items.map((item, index) =>
                  renderMenuItem(item, index === section.items.length - 1)
                )}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text style={styles.versionText}>Better Together v1.0.0</Text>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          <View style={[styles.modalContent, SHADOWS.card]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nickname (optional)</Text>
              <TextInput
                style={styles.input}
                value={editNickname}
                onChangeText={setEditNickname}
                placeholder="Enter a nickname"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
              disabled={saving}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Love Language Modal */}
      <Modal
        visible={showLoveLanguageModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowLoveLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          <View style={[styles.modalContent, styles.loveLanguageModalContent, SHADOWS.card]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Love Languages</Text>
              <TouchableOpacity onPress={() => setShowLoveLanguageModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.loveLanguageSectionLabel}>Primary Love Language</Text>
            {LOVE_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={`primary-${lang.id}`}
                style={[
                  styles.languageOption,
                  user?.primaryLoveLanguage === lang.id && styles.languageOptionSelected
                ]}
                onPress={() => handleSelectLoveLanguage(lang.id, true)}
                activeOpacity={0.7}
              >
                <View style={[styles.languageIcon, { backgroundColor: `${lang.color}20` }]}>
                  <Ionicons name={lang.icon as any} size={20} color={lang.color} />
                </View>
                <Text style={styles.languageLabel}>{lang.label}</Text>
                {user?.primaryLoveLanguage === lang.id && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}

            <Text style={[styles.loveLanguageSectionLabel, { marginTop: SPACING.lg }]}>
              Secondary Love Language
            </Text>
            {LOVE_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={`secondary-${lang.id}`}
                style={[
                  styles.languageOption,
                  user?.secondaryLoveLanguage === lang.id && styles.languageOptionSelected
                ]}
                onPress={() => handleSelectLoveLanguage(lang.id, false)}
                activeOpacity={0.7}
              >
                <View style={[styles.languageIcon, { backgroundColor: `${lang.color}20` }]}>
                  <Ionicons name={lang.icon as any} size={20} color={lang.color} />
                </View>
                <Text style={styles.languageLabel}>{lang.label}</Text>
                {user?.secondaryLoveLanguage === lang.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#9B6BFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: SPACING.lg,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userNickname: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    marginTop: 2,
  },
  userEmail: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: SPACING.xs,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  editButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  loveLanguageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  loveLanguageRow: {
    flex: 1,
    flexDirection: 'row',
  },
  loveLanguageItem: {
    flex: 1,
  },
  loveLanguageLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  loveLanguageValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  loveLanguageText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  loveLanguageDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  loveLanguageArrow: {
    marginLeft: SPACING.sm,
  },
  menuCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: '#FFEEEE',
    gap: SPACING.sm,
  },
  logoutText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#FF4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl + 20,
  },
  loveLanguageModalContent: {
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  saveButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loveLanguageSectionLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  languageOptionSelected: {
    backgroundColor: `${COLORS.primary}10`,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  languageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  languageLabel: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
})

export default ProfileScreen
