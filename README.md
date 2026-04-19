# ScottyApp

> An all-in-one personal multi-tool app — everything Scotty needs, day to day, in one place.

[![React Native](https://img.shields.io/badge/React%20Native-0.85-blue?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Private-red)]()
[![Platform](https://img.shields.io/badge/Platform-Android-green?logo=android)](https://developer.android.com/)

---

## What Is ScottyApp?

ScottyApp is a **React Native Android application** that combines everyday productivity tools into a single, beautifully themed experience. Rather than juggling a dozen separate apps, ScottyApp brings together task management, journaling, habit tracking, focus timers, audio notes, mood tracking, code snippets, a reading list, social blogging, and much more — all with a gamified XP/levelling system to keep you motivated.

## ✨ Key Features

| Feature | Description |
|---|---|
| **📋 Tasks (Gamified)** | Create tasks with priority levels, earn XP on completion, track streaks, and unlock achievements |
| **📓 Journal** | Write Markdown entries with live preview, split view, formatting toolbar, search, tags, and word count |
| **⏱️ Focus Timer** | Pomodoro-style timer with configurable work/break intervals and session history |
| **✅ Habit Tracker** | Daily/weekday/weekend habits with 7-day grid, streak tracking, and XP rewards |
| **🎙️ Audio Notes** | Record voice memos, play them back, and optionally add transcripts |
| **😊 Mood Tracker** | Quick 5-level mood check-ins with notes and history view |
| **💻 Code Snippets** | Save and browse code snippets with language labels and monospace preview |
| **📖 Reading List** | Track books and articles with read/unread status and optional URLs |
| **📝 Blog (Social)** | Write and share Markdown blog posts with likes and comments |
| **💬 Messaging** | Real-time 1-on-1 conversations powered by Supabase |
| **🎨 Theme Creator** | Light/Dark/Auto modes, 8 accent colour presets, 3 font families, 5 font size steps |
| **🏠 Dashboard** | At-a-glance XP, streaks, task counts, habits, and a time-of-day greeting |
| **🛠️ Dev Menu** | Feature flags, real-time log viewer, and device info (debug builds only) |

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native 0.85.1 (New Architecture — Fabric + JSI) |
| **Language** | TypeScript 5 (strict mode) |
| **State Management** | Zustand 5 |
| **Local Storage** | react-native-mmkv (synchronous JSI storage) |
| **Navigation** | React Navigation 7 (native stack + bottom tabs) |
| **Backend** | Supabase (auth, real-time, cloud storage) |
| **Icons** | Phosphor React Native |
| **Animations** | React Native Reanimated 3 |
| **Lists** | @shopify/flash-list |
| **Build** | Gradle 8 + Android SDK 36 |

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 22.11.0
- **Java** 21 (OpenJDK)
- **Android SDK** (API 36) + NDK 27.1.12297006
- **Gradle** 8.x (bundled via wrapper)

### Installation

```bash
git clone https://github.com/ScottyVenable/ScottyApp.git
cd ScottyApp
npm install
```

### Running

```bash
# Start the Metro bundler
npm start

# Launch on a connected Android device or emulator
npm run android

# Build a debug APK
npm run build:android:debug
```

### Environment Variables

Create a `.env` file in the project root (not committed to Git):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 📁 Project Structure

```
ScottyApp/
├── App.tsx                  # Root component — providers + navigation
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Button, Card, Input, Badge, EmptyState, ProgressBar
│   │   └── layout/          # ScreenWrapper, Header
│   ├── screens/             # Feature screens (one folder per domain)
│   │   ├── home/            # Dashboard
│   │   ├── tasks/           # Task list, detail, create, XP/level
│   │   ├── journal/         # Journal list, editor, entry viewer
│   │   ├── focus/           # Pomodoro focus timer
│   │   ├── habits/          # Habit list, detail, create
│   │   ├── audio/           # Audio notes list + detail
│   │   ├── mood/            # Mood tracker + history
│   │   ├── snippets/        # Code snippet list, detail, create
│   │   ├── reading/         # Reading list + item detail
│   │   ├── social/          # Blog feed, post, editor, messaging
│   │   ├── tools/           # Tools hub (gateway to focus, habits, etc.)
│   │   ├── profile/         # Profile screen
│   │   ├── settings/        # Settings + Theme Creator
│   │   ├── auth/            # Login + Signup
│   │   └── dev/             # Dev Menu (debug builds)
│   ├── navigation/          # RootNavigator, MainNavigator, tab + stack configs
│   ├── store/               # Zustand stores (one per domain)
│   ├── services/            # Supabase client, auth, error service, MMKV storage
│   ├── hooks/               # useTheme, useHaptic, useDebounce
│   ├── theme/               # Palette, semantic tokens, typography, spacing
│   ├── types/               # TypeScript interfaces per domain
│   └── utils/               # Pure utility functions
├── docs/                    # Extended documentation
│   ├── ARCHITECTURE.md      # App architecture deep-dive
│   ├── DEVELOPMENT.md       # Developer setup & workflow
│   ├── FEATURES.md          # Feature reference
│   ├── TESTING.md           # Testing guide
│   ├── THEME_SYSTEM.md      # Theme system reference
│   ├── CONTRIBUTING.md      # Contribution guidelines
│   ├── CHANGELOG.md         # Version history
│   └── TASK_LIST.md         # Comprehensive roadmap & task list
└── __tests__/               # Root-level test config
```

## 🧪 Testing

```bash
npm test                # Run all Jest unit tests
npm run test:coverage   # Unit tests with coverage report
npm run test:watch      # Watch mode
npm run test:playwright # Playwright web component tests
npm run test:e2e        # Detox end-to-end tests (requires emulator)
```

## 🔧 Linting & Formatting

```bash
npm run lint            # ESLint check
npm run lint:fix        # ESLint auto-fix
npm run format          # Prettier write
npm run format:check    # Prettier check
npm run typecheck       # TypeScript type check (tsc --noEmit)
```

## 📚 Documentation

Detailed documentation lives in the [`docs/`](./docs/) directory:

| Document | Description |
|---|---|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture, tech stack, data flow, state management |
| [DEVELOPMENT.md](./docs/DEVELOPMENT.md) | Developer setup, build commands, CI/CD, adding new features |
| [FEATURES.md](./docs/FEATURES.md) | Complete feature reference with details on every tool |
| [TESTING.md](./docs/TESTING.md) | Test stack, structure, patterns, and coverage |
| [THEME_SYSTEM.md](./docs/THEME_SYSTEM.md) | Theme tokens, accent presets, consuming the theme |
| [CONTRIBUTING.md](./docs/CONTRIBUTING.md) | How to contribute, code style, PR process |
| [CHANGELOG.md](./docs/CHANGELOG.md) | Version history and release notes |
| [TASK_LIST.md](./docs/TASK_LIST.md) | Comprehensive roadmap, planned features, and future ideas |

## 🗺️ Roadmap

See the full **[Task List & Roadmap](./docs/TASK_LIST.md)** for planned features including:

- 🔔 Notifications & reminders
- 📊 Analytics dashboard with charts
- ☁️ Full cloud sync with conflict resolution
- 🤖 AI-powered suggestions and voice transcription
- 💰 Budget/finance tracker
- 🏋️ Fitness & workout logger
- 📅 Calendar integration
- 🔒 Biometric app lock
- …and much more

## 📄 License

This is a **private project** — not currently open for public distribution.

---

*Built with ❤️ by [Scotty Venable](https://github.com/ScottyVenable)*
