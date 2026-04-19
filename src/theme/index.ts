import {ColorScheme, lightColors, darkColors} from './colors';
import {fontFamilies, fontSizeScale, FontFamily} from './typography';
import {spacing, borderRadius, shadows} from './spacing';

export interface AppTheme {
  colors: ColorScheme;
  fonts: typeof fontFamilies.system;
  fontSizes: typeof fontSizeScale;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  isDark: boolean;
}

export function buildTheme(
  isDark: boolean,
  accentColor: string,
  accentLight: string,
  accentMuted: string,
  fontFamily: FontFamily,
): AppTheme {
  const baseColors = isDark ? darkColors : lightColors;
  return {
    colors: {
      ...baseColors,
      accent: accentColor,
      accentLight: accentLight,
      accentMuted: accentMuted,
    },
    fonts: fontFamilies[fontFamily] ?? fontFamilies.system,
    fontSizes: fontSizeScale,
    spacing,
    borderRadius,
    shadows,
    isDark,
  };
}

export {lightColors, darkColors, fontFamilies, fontSizeScale, spacing, borderRadius, shadows};
export type {ColorScheme, FontFamily};
