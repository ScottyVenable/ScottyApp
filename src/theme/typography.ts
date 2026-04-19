export const fontFamilies = {
  // System fonts (no download needed)
  system: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    mono: 'monospace',
  },
  // Preset font stacks (add .ttf files to android/app/src/main/assets/fonts/)
  inter: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    mono: 'monospace',
  },
  jetbrains: {
    regular: 'JetBrainsMono-Regular',
    medium: 'JetBrainsMono-Medium',
    semibold: 'JetBrainsMono-SemiBold',
    bold: 'JetBrainsMono-Bold',
    mono: 'JetBrainsMono-Regular',
  },
} as const;

export type FontFamily = keyof typeof fontFamilies;

export const fontSizeScale = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export type FontSizeToken = keyof typeof fontSizeScale;

export const lineHeightScale = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export interface TypographyConfig {
  fontFamily: FontFamily;
  baseSize: number;
}

export const typographyPresets = [
  {name: 'System (Default)', value: 'system' as FontFamily},
  {name: 'Inter', value: 'inter' as FontFamily},
  {name: 'JetBrains Mono', value: 'jetbrains' as FontFamily},
];
