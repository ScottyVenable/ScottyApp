import {create} from 'zustand';
import {Appearance} from 'react-native';
import {ThemeConfig, defaultThemeConfig, ThemeMode} from '../types/theme';
import {buildTheme, AppTheme} from '../theme';
import {FontFamily} from '../theme/typography';
import {storage} from '../services/storage';

const THEME_KEY = 'app_theme_config';

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'auto') {
    return Appearance.getColorScheme() === 'dark';
  }
  return mode === 'dark';
}

interface ThemeStore {
  config: ThemeConfig;
  theme: AppTheme;
  setMode: (mode: ThemeMode) => void;
  setAccent: (color: string, light: string, muted: string) => void;
  setFontFamily: (font: FontFamily) => void;
  setBaseFontSize: (size: number) => void;
  setHapticFeedback: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  loadFromStorage: () => void;
  reset: () => void;
}

function makeTheme(config: ThemeConfig): AppTheme {
  return buildTheme(
    resolveIsDark(config.mode),
    config.accentColor,
    config.accentLight,
    config.accentMuted,
    config.fontFamily,
  );
}

export const useThemeStore = create<ThemeStore>(set => ({
  config: defaultThemeConfig,
  theme: makeTheme(defaultThemeConfig),

  setMode: mode => {
    set(state => {
      const config = {...state.config, mode};
      storage.set(THEME_KEY, JSON.stringify(config));
      return {config, theme: makeTheme(config)};
    });
  },

  setAccent: (accentColor, accentLight, accentMuted) => {
    set(state => {
      const config = {...state.config, accentColor, accentLight, accentMuted};
      storage.set(THEME_KEY, JSON.stringify(config));
      return {config, theme: makeTheme(config)};
    });
  },

  setFontFamily: fontFamily => {
    set(state => {
      const config = {...state.config, fontFamily};
      storage.set(THEME_KEY, JSON.stringify(config));
      return {config, theme: makeTheme(config)};
    });
  },

  setBaseFontSize: baseFontSize => {
    set(state => {
      const config = {...state.config, baseFontSize};
      storage.set(THEME_KEY, JSON.stringify(config));
      return {config, theme: makeTheme(config)};
    });
  },

  setHapticFeedback: hapticFeedback => {
    set(state => {
      const config = {...state.config, hapticFeedback};
      storage.set(THEME_KEY, JSON.stringify(config));
      return {config, theme: makeTheme(config)};
    });
  },

  setReducedMotion: reducedMotion => {
    set(state => {
      const config = {...state.config, reducedMotion};
      storage.set(THEME_KEY, JSON.stringify(config));
      return {config, theme: makeTheme(config)};
    });
  },

  loadFromStorage: () => {
    const raw = storage.getString(THEME_KEY);
    if (raw) {
      try {
        const config = JSON.parse(raw) as ThemeConfig;
        set({config, theme: makeTheme(config)});
      } catch {
        // use defaults on parse error
      }
    }
  },

  reset: () => {
    storage.delete(THEME_KEY);
    set({config: defaultThemeConfig, theme: makeTheme(defaultThemeConfig)});
  },
}));
