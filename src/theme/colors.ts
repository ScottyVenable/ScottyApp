export const palette = {
  // Neutrals
  neutral0: '#FFFFFF',
  neutral50: '#F9FAFB',
  neutral100: '#F3F4F6',
  neutral200: '#E5E7EB',
  neutral300: '#D1D5DB',
  neutral400: '#9CA3AF',
  neutral500: '#6B7280',
  neutral600: '#4B5563',
  neutral700: '#374151',
  neutral800: '#1F2937',
  neutral900: '#111827',
  neutral950: '#030712',

  // Accent presets
  violet: '#7C3AED',
  violetLight: '#8B5CF6',
  blue: '#2563EB',
  blueLight: '#3B82F6',
  teal: '#0D9488',
  tealLight: '#14B8A6',
  amber: '#D97706',
  amberLight: '#F59E0B',
  rose: '#E11D48',
  roseLight: '#F43F5E',
  green: '#16A34A',
  greenLight: '#22C55E',
  indigo: '#4338CA',
  indigoLight: '#6366F1',
  orange: '#EA580C',
  orangeLight: '#F97316',

  // Status colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // XP / gamification
  xpGold: '#FFD700',
  xpSilver: '#C0C0C0',
  xpBronze: '#CD7F32',
  streak: '#FF6B35',
  level: '#9333EA',
} as const;

export type ColorToken = keyof typeof palette;

export interface ColorScheme {
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  accent: string;
  accentLight: string;
  accentMuted: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  overlay: string;
}

export const lightColors: ColorScheme = {
  background: palette.neutral0,
  backgroundSecondary: palette.neutral50,
  backgroundTertiary: palette.neutral100,
  surface: palette.neutral0,
  surfaceElevated: palette.neutral0,
  border: palette.neutral200,
  borderSubtle: palette.neutral100,
  text: palette.neutral900,
  textSecondary: palette.neutral600,
  textTertiary: palette.neutral400,
  textInverse: palette.neutral0,
  accent: palette.violet,
  accentLight: palette.violetLight,
  accentMuted: '#EDE9FE',
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  info: palette.info,
  overlay: 'rgba(0,0,0,0.5)',
};

export const darkColors: ColorScheme = {
  background: palette.neutral950,
  backgroundSecondary: palette.neutral900,
  backgroundTertiary: palette.neutral800,
  surface: '#18181B',
  surfaceElevated: '#27272A',
  border: palette.neutral700,
  borderSubtle: palette.neutral800,
  text: palette.neutral50,
  textSecondary: palette.neutral400,
  textTertiary: palette.neutral600,
  textInverse: palette.neutral900,
  accent: palette.violetLight,
  accentLight: '#A78BFA',
  accentMuted: '#2E1065',
  success: palette.greenLight,
  warning: palette.amberLight,
  error: '#F87171',
  info: '#60A5FA',
  overlay: 'rgba(0,0,0,0.7)',
};

export const accentPresets = [
  {name: 'Violet', color: palette.violet, light: palette.violetLight, muted: '#EDE9FE'},
  {name: 'Blue', color: palette.blue, light: palette.blueLight, muted: '#EFF6FF'},
  {name: 'Teal', color: palette.teal, light: palette.tealLight, muted: '#F0FDFA'},
  {name: 'Amber', color: palette.amber, light: palette.amberLight, muted: '#FFFBEB'},
  {name: 'Rose', color: palette.rose, light: palette.roseLight, muted: '#FFF1F2'},
  {name: 'Green', color: palette.green, light: palette.greenLight, muted: '#F0FDF4'},
  {name: 'Indigo', color: palette.indigo, light: palette.indigoLight, muted: '#EEF2FF'},
  {name: 'Orange', color: palette.orange, light: palette.orangeLight, muted: '#FFF7ED'},
] as const;
