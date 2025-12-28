/**
 * Jest Setup File
 * Configures test environment with necessary mocks and polyfills
 */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    multiRemove: jest.fn(() => Promise.resolve()),
    multiSet: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    clear: jest.fn(() => Promise.resolve()),
  },
}))

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}))

jest.mock('@react-navigation/native-stack', () => ({
  ...jest.requireActual('@react-navigation/native-stack'),
  createNativeStackNavigator: () => ({
    Navigator: jest.fn(),
    Screen: jest.fn(),
  }),
}))

jest.mock('@react-navigation/bottom-tabs', () => ({
  ...jest.requireActual('@react-navigation/bottom-tabs'),
  createBottomTabNavigator: () => ({
    Navigator: jest.fn(),
    Screen: jest.fn(),
  }),
}))

// Mock Expo modules
jest.mock('expo', () => ({
  SplashScreen: {
    hideAsync: jest.fn(),
  },
}))

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
  usePathname: () => '/',
}))

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getLastNotificationResponseAsync: jest.fn(() => Promise.resolve(null)),
  getNotificationChannelsAsync: jest.fn(() => Promise.resolve([])),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
}))

jest.mock('expo-device', () => ({
  isDevice: false,
}))

jest.mock('expo-linear-gradient', () => ({
  __esModule: true,
  default: 'LinearGradient',
}))

jest.mock('expo-blur', () => ({
  __esModule: true,
  BlurView: 'BlurView',
}))

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Circle: 'Circle',
  Ellipse: 'Ellipse',
  G: 'G',
  LinearGradient: 'LinearGradient',
  RadialGradient: 'RadialGradient',
  Line: 'Line',
  Polygon: 'Polygon',
  Polyline: 'Polyline',
  Path: 'Path',
  Rect: 'Rect',
  Use: 'Use',
  Image: 'Image',
  Symbol: 'Symbol',
  Defs: 'Defs',
  Stop: 'Stop',
  ClipPath: 'ClipPath',
  Pattern: 'Pattern',
  Mask: 'Mask',
  Text: 'Text',
  TSpan: 'TSpan',
  TextPath: 'TextPath',
  Marker: 'Marker',
}))

// Mock zustand
jest.mock('zustand', () => ({
  __esModule: true,
  default: (fn) => {
    const store = {}
    fn(store, () => undefined, store)
    return () => store
  },
}))

// Suppress console errors during tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Animated:') ||
        args[0].includes('Non-serializable values') ||
        args[0].includes('RCTBridge required dispatch_sync'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Mock fetch globally
global.fetch = jest.fn()

// Mock XMLHttpRequest
global.XMLHttpRequest = jest.fn()

// Set up test timeout
jest.setTimeout(10000)
