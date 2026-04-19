# Theme System

## Structure

```
src/theme/
├── colors.ts       palette + semantic ColorScheme + accentPresets
├── typography.ts   fontFamilies, fontSizeScale, fontWeights
├── spacing.ts      4pt grid, borderRadius, shadow presets
└── index.ts        buildTheme() — merges all into AppTheme
```

## AppTheme shape

```typescript
interface AppTheme {
  colors: ColorScheme;        // all semantic color tokens
  fonts: FontStack;           // regular/medium/semibold/bold/mono
  fontSizes: FontSizeScale;   // xs→5xl
  spacing: SpacingScale;      // 0→96
  borderRadius: RadiusScale;
  shadows: ShadowPresets;
  isDark: boolean;
}
```

## Semantic Color Tokens

| Token | Purpose |
|---|---|
| `background` | Main page background |
| `backgroundSecondary` | Slightly elevated surfaces |
| `backgroundTertiary` | Tags, chips, subtle fills |
| `surface` | Cards, sheets |
| `surfaceElevated` | Modals, popovers |
| `border` | Default borders |
| `borderSubtle` | Hairline dividers |
| `text` | Primary text |
| `textSecondary` | Labels, metadata |
| `textTertiary` | Placeholders, disabled |
| `textInverse` | Text on accent backgrounds |
| `accent` | Interactive elements, CTAs |
| `accentLight` | Hover/lighter variant |
| `accentMuted` | Accent-tinted backgrounds |
| `success / warning / error / info` | Status colours |

## Accent Presets

8 presets are defined in `accentPresets`:
Violet, Blue, Teal, Amber, Rose, Green, Indigo, Orange.
Each has a `color`, `light`, and `muted` variant.

## Consuming the Theme

```typescript
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const theme = useTheme(); // returns AppTheme
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.text, fontSize: theme.fontSizes.md }}>
        Hello
      </Text>
    </View>
  );
}
```

## Persisting User Preferences

`themeStore` persists `ThemeConfig` to MMKV on every change.
On app start, `App.tsx` calls `loadFromStorage()` before first render.

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  accentColor: string;
  accentLight: string;
  accentMuted: string;
  fontFamily: FontFamily;
  baseFontSize: number;
  hapticFeedback: boolean;
  reducedMotion: boolean;
}
```
