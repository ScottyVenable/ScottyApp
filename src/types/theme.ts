import {FontFamily} from '../theme/typography';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  mode: ThemeMode;
  accentColor: string;
  accentLight: string;
  accentMuted: string;
  fontFamily: FontFamily;
  baseFontSize: number;
  useSystemFont: boolean;
  reducedMotion: boolean;
  hapticFeedback: boolean;
}

export const defaultThemeConfig: ThemeConfig = {
  mode: 'dark',
  accentColor: '#7C3AED',
  accentLight: '#8B5CF6',
  accentMuted: '#2E1065',
  fontFamily: 'system',
  baseFontSize: 15,
  useSystemFont: true,
  reducedMotion: false,
  hapticFeedback: true,
};
