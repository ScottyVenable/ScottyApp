import {useThemeStore} from '../store/themeStore';

export function useTheme() {
  return useThemeStore(s => s.theme);
}

export function useThemeConfig() {
  return useThemeStore(s => s.config);
}

export function useThemeActions() {
  const {setMode, setAccent, setFontFamily, setBaseFontSize, setHapticFeedback, setReducedMotion, reset} =
    useThemeStore();
  return {setMode, setAccent, setFontFamily, setBaseFontSize, setHapticFeedback, setReducedMotion, reset};
}
