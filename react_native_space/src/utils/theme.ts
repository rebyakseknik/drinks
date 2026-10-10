import { Platform } from 'react-native';

export const COLORS = {
  primary: '#6B21A8',
  primaryLight: '#7C3AED',
  accent: '#D4AF37',
  accentLight: '#E5C565',
  background: '#0D0B14',
  surface: '#1A1726',
  surfaceBorder: '#2A2640',
  text: '#FFFFFF',
  // Okunurluk için açıldı (koyu zeminde yeterli kontrast)
  textSecondary: '#C9C6D8',
  textMuted: '#9C99B3',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  white: '#FFFFFF',
  cardBg: 'rgba(26, 23, 38, 0.85)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Rahat dokunma için en küçük yükseklik */
export const TOUCH = 48;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;


/** Açılır seçim kutusu: iOS'ta tekerlek kendi yüksekliğini alır; web ve Android'de tek satır. */
export const PICKER_STYLE =
  Platform.OS === 'ios'
    ? { color: COLORS.text }
    : { color: COLORS.text, height: 48, backgroundColor: COLORS.surface, borderWidth: 0, paddingHorizontal: 12, fontSize: 16 };
