# ScottyApp — Architecture

## Overview

ScottyApp is a React Native 0.85 Android multi-tool app built with TypeScript and the New Architecture (Fabric + JSI).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.85.1 (New Arch) |
| Language | TypeScript 5 (strict) |
| State | Zustand 5 |
| Local storage | MMKV (JSI) |
| Navigation | React Navigation 7 |
| Icons | Phosphor React Native |
| Animations | React Native Reanimated 3 |
| Lists | @shopify/flash-list |
| Backend | Supabase (auth, realtime, storage) |
| Build | Gradle 8 + Android SDK 36 |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Atoms: Button, Card, Input, Badge, EmptyState, ProgressBar
│   └── layout/       # Screen wrappers, Header
├── screens/          # Feature screens (one folder per domain)
├── navigation/       # Stack + tab navigators + types
├── store/            # Zustand slices (one per domain)
├── services/         # Supabase, auth, error logger, MMKV storage
├── hooks/            # useTheme, useHaptic, useDebounce
├── theme/            # Palette, semantic tokens, buildTheme()
├── types/            # TypeScript interfaces per domain
└── utils/            # Pure utility functions (id generator, etc.)
```

## Navigation

```
RootNavigator
├── AuthNavigator     ← Login / Signup (when unauthenticated)
└── MainNavigator     ← Bottom Tabs (when authenticated)
    ├── Home
    ├── Tasks (stack)
    ├── Journal (stack)
    ├── Tools (stack — Focus, Habits, Audio, Mood, Snippets, Reading)
    └── Profile (stack — Settings, ThemeCreator, Blog, Messages, DevMenu)
```

## State Architecture

Each Zustand slice owns its data and persists to MMKV synchronously.  
No cross-store direct references — shared logic goes in custom hooks.

```
themeStore    → theme config, buildTheme()
journalStore  → entries, CRUD, search/filter
taskStore     → tasks, XP/level/streak, achievements
habitStore    → habits, completion dates, streak calc
focusStore    → Pomodoro timer, sessions, config
audioStore    → recording state, saved notes metadata
authStore     → user session, Supabase auth state
devStore      → dev mode flag, feature flags, log buffer
```

## Data Flow

```
User Action
  → Zustand optimistic update
  → MMKV persist (synchronous)
  → [online] Supabase upsert (async background)
```

## Error Handling

All errors route through `src/services/errorService.ts`:
- Captured to `devStore.logs` (visible in Dev Menu)
- Printed to console in `__DEV__` builds
- User-facing errors surfaced via component state (no silent swallowing)
