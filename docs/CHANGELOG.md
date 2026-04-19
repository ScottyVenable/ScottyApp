# Changelog

All notable changes to ScottyApp will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Expanded README with comprehensive project overview, tech stack, and feature table
- Contributing guide (`docs/CONTRIBUTING.md`) with code style, commit conventions, and PR process
- This changelog (`docs/CHANGELOG.md`)
- Comprehensive task list and roadmap (`docs/TASK_LIST.md`)

---

## [0.1.0-alpha] — 2025-01-01

### Added
- **Core infrastructure**: React Native 0.85.1 with New Architecture (Fabric + JSI)
- **Navigation**: React Navigation 7 with root, auth, main, and nested stack navigators
- **State management**: Zustand 5 stores for all domains with MMKV persistence
- **Theme system**: Light/Dark/Auto modes, 8 accent presets, font family and size controls, live preview
- **Authentication**: Supabase auth with login, signup, and guest mode
- **Home dashboard**: XP stats, streak count, task/habit summary, time-of-day greeting
- **Tasks (Gamified)**: Task CRUD, priority levels, XP rewards, level progression, streak tracking, 8 achievements
- **Journal**: Markdown editor with Edit/Split/Preview modes, formatting toolbar, search, tags, word count
- **Focus Timer**: Pomodoro timer with configurable intervals, session indicator, mode switching, session history
- **Habit Tracker**: Daily/weekday/weekend habits, 7-day grid, streak calc, weekly progress, XP rewards
- **Audio Notes**: Voice recording, playback, duration display, transcript field, renaming
- **Mood Tracker**: 5-level mood scale with notes and history view
- **Code Snippets**: Snippet CRUD with language labels, monospace preview, language filter
- **Reading List**: Title + URL tracking with read/unread status
- **Blog (Social)**: Markdown blog posts with likes and comments
- **Messaging**: 1-on-1 conversations with real-time Supabase sync
- **Theme Creator**: Appearance mode, accent colour, font family, font size, live preview
- **Dev Menu**: Feature flags, real-time log viewer, app/device info (debug builds only)
- **UI components**: Button, Card, Input, Badge, EmptyState, ProgressBar, Header, ScreenWrapper
- **Services**: Supabase client, auth service, error service, MMKV storage wrapper
- **Hooks**: useTheme, useHaptic, useDebounce
- **Testing**: Jest + React Testing Library unit tests, Playwright config, Detox E2E config
- **CI/CD**: GitHub Actions workflow for debug APK builds on push
- **Developer experience**: ESLint, Prettier, TypeScript strict mode, path aliases
