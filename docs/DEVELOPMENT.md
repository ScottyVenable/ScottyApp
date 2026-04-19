# Development Guide

## Prerequisites

- Node.js >= 22
- Java 21 (OpenJDK)
- Android SDK (API 36) + NDK 27.1.12297006
- Gradle 8.x (bundled via wrapper)

## Setup

```bash
git clone https://github.com/ScottyVenable/ScottyApp.git
cd ScottyApp
npm install
```

## Running

```bash
# Start Metro bundler
npm start

# Run on Android device/emulator (requires Android SDK)
npm run android

# Build debug APK
npm run build:android:debug
# Output: android/app/build/outputs/apk/debug/app-debug.apk

# Build release APK (requires signing config)
npm run build:android:release
```

## Testing

```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Playwright (web component tests)
npm run test:playwright

# E2E with Detox (requires running emulator)
npm run test:e2e:build
npm run test:e2e
```

## Linting & Formatting

```bash
npm run lint           # check only
npm run lint:fix       # auto-fix
npm run format         # prettier write
npm run format:check   # prettier check
npm run typecheck      # tsc --noEmit
```

## Environment Variables

Create `.env` (not committed) for Supabase:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Path Aliases

All imports use `@/` prefix (configured in tsconfig + babel):

```typescript
import Button from '@components/ui/Button';
import { useTheme } from '@hooks/useTheme';
import { useTaskStore } from '@store/taskStore';
```

## Developer Mode

Toggle the **Developer Mode** switch on the Home screen (visible only in debug builds).
Opens the **Dev Menu** with feature flags, log viewer, and device info.

## CI/CD

GitHub Actions automatically builds a debug APK on every push to `main` or the feature branch.
Download the APK from the **Actions** tab > latest workflow run > **Artifacts**.

For release builds, trigger manually via **Actions** > **Build Android APK** > `release`.
Requires secrets: `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`.

## Adding a New Feature

1. Add types to `src/types/`
2. Add Zustand store to `src/store/`
3. Add screen to `src/screens/<feature>/`
4. Register screen in the appropriate navigator (`src/navigation/`)
5. Add route to `src/navigation/types.ts`
6. Add unit tests to `src/__tests__/unit/`
