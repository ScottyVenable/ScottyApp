# ScottyApp — Task List & Roadmap

> A comprehensive list of tasks, planned features, improvements, and future ideas.
> Items are organised by category and priority. Check off items as they are completed.

---

## Table of Contents

1. [Current Status (v0.1.0-alpha)](#current-status-v010-alpha)
2. [High Priority — Core Improvements](#high-priority--core-improvements)
3. [Medium Priority — Feature Enhancements](#medium-priority--feature-enhancements)
4. [New Feature Ideas](#new-feature-ideas)
5. [UI/UX Improvements](#uiux-improvements)
6. [Performance & Technical Debt](#performance--technical-debt)
7. [Testing & Quality](#testing--quality)
8. [Documentation](#documentation)
9. [Infrastructure & DevOps](#infrastructure--devops)
10. [Long-Term / Ambitious Ideas](#long-term--ambitious-ideas)

---

## Current Status (v0.1.0-alpha)

The following core features are implemented and functional:

- [x] Project scaffolding with React Native 0.85 New Architecture
- [x] TypeScript strict mode with path aliases
- [x] Zustand state management with MMKV persistence
- [x] React Navigation 7 (root, auth, main, nested stacks, bottom tabs)
- [x] Supabase integration (auth, real-time, storage)
- [x] Theme system (light/dark/auto, 8 accent presets, font controls)
- [x] Home dashboard with XP stats and greeting
- [x] Task management with gamified XP/level/streak/achievements
- [x] Journal with Markdown editor (edit/split/preview modes)
- [x] Focus Timer (Pomodoro) with session history
- [x] Habit Tracker with daily grid and streaks
- [x] Audio Notes (recording + playback)
- [x] Mood Tracker (5-level scale + history)
- [x] Code Snippets (CRUD + language filter)
- [x] Reading List (title, URL, read status)
- [x] Blog (social posts with likes and comments)
- [x] Messaging (1-on-1 conversations)
- [x] Theme Creator screen
- [x] Dev Menu (feature flags, logs, device info)
- [x] Guest mode (no account required)
- [x] UI component library (Button, Card, Input, Badge, EmptyState, ProgressBar)
- [x] CI/CD with GitHub Actions (debug APK builds)
- [x] Unit tests for task store, journal store, and XP system

---

## High Priority — Core Improvements

These are critical items to stabilise and polish the existing app:

### Data & Sync
- [ ] Implement full cloud sync with Supabase for all stores (tasks, journal, habits, etc.)
- [ ] Add offline-first data queue — buffer mutations when offline and replay when connected
- [ ] Implement conflict resolution strategy for cloud sync (last-write-wins or merge)
- [ ] Add data export functionality (JSON/CSV export of all user data)
- [ ] Add data import functionality (restore from backup)
- [ ] Implement data migration system for store schema changes between app versions

### Authentication & Security
- [ ] Add biometric app lock (fingerprint/face unlock via react-native-biometrics)
- [ ] Implement PIN/passcode lock as a fallback
- [ ] Add "Remember me" / auto-login functionality
- [ ] Implement proper token refresh flow for Supabase auth
- [ ] Add password reset / forgot password flow
- [ ] Add account deletion functionality (GDPR compliance)
- [ ] Secure sensitive data with encrypted storage

### Error Handling & Stability
- [ ] Add global error boundary with crash recovery UI
- [ ] Implement crash reporting (Sentry or Bugsnag integration)
- [ ] Add retry logic for failed network requests
- [ ] Improve error messages — replace generic errors with user-friendly guidance
- [ ] Add connectivity status indicator (online/offline banner)

---

## Medium Priority — Feature Enhancements

Improvements to existing features:

### Tasks
- [ ] Add due dates and time-based reminders for tasks
- [ ] Add recurring tasks (daily, weekly, monthly, custom)
- [ ] Add subtasks / checklists within a task
- [ ] Add task templates for common workflows
- [ ] Add drag-and-drop reordering on task list
- [ ] Add task categories as custom user-defined labels (not just preset)
- [ ] Add task notes / description field with Markdown support
- [ ] Add bulk actions (complete all, delete completed, archive)
- [ ] Add task sharing / assignment to other users
- [ ] Add daily/weekly task review summary
- [ ] Add calendar view for tasks with due dates
- [ ] Add "My Day" view — focus on today's tasks only

### Journal
- [ ] Add image attachments to journal entries
- [ ] Add entry templates (daily reflection, gratitude, weekly review)
- [ ] Add mood tagging per journal entry (link to mood tracker)
- [ ] Add voice-to-text for journal entries
- [ ] Add entry encryption for private entries
- [ ] Add PDF export for individual entries or date ranges
- [ ] Add journal prompts / writing suggestions
- [ ] Add calendar heat map showing entry frequency
- [ ] Add "On this day" — view past entries from the same date in prior years

### Focus Timer
- [ ] Add ambient background sounds (rain, forest, café, white noise)
- [ ] Add focus session statistics (daily/weekly/monthly charts)
- [ ] Add customizable timer presets beyond Pomodoro (52/17, 90/20, custom)
- [ ] Add "Do Not Disturb" mode integration during focus sessions
- [ ] Add task linking — associate a focus session with a specific task
- [ ] Add focus streak tracking (consecutive days with at least one session)
- [ ] Add group focus sessions (social Pomodoro with friends)

### Habit Tracker
- [ ] Add habit reminders / push notifications at custom times
- [ ] Add monthly and yearly streak visualizations (GitHub-style contribution grid)
- [ ] Add habit categories / grouping
- [ ] Add flexible frequency options (e.g., 3x per week, every other day)
- [ ] Add habit notes — log a note when checking in
- [ ] Add habit analytics — completion rate, best day, trends over time
- [ ] Add habit templates for common habits (exercise, reading, meditation)

### Audio Notes
- [ ] Implement voice-to-text transcription (on-device or via API)
- [ ] Add folder/tagging organisation for audio notes
- [ ] Add playback speed control (0.5x, 1x, 1.5x, 2x)
- [ ] Add waveform visualisation during recording and playback
- [ ] Add audio trimming / editing
- [ ] Add share audio note as file

### Mood Tracker
- [ ] Add mood trends graph (line chart over 7/30/90 days)
- [ ] Add correlation insights (mood vs. habits, sleep, tasks completed)
- [ ] Add custom mood factors / tags (sleep, exercise, social, weather)
- [ ] Add mood reminders at configurable times
- [ ] Add weekly mood summary in dashboard

### Code Snippets
- [ ] Add syntax highlighting in snippet preview
- [ ] Add copy-to-clipboard button
- [ ] Add snippet folders / collections
- [ ] Add search within snippets
- [ ] Add import/export snippets (Gist integration)
- [ ] Add more language options (Rust, Go, C++, Swift, Kotlin, etc.)

### Reading List
- [ ] Add reading progress tracking (page number or percentage)
- [ ] Add categories / shelves (Currently Reading, Want to Read, Finished)
- [ ] Add book cover images (manual upload or API lookup)
- [ ] Add notes per book
- [ ] Add reading goals (books per month/year)
- [ ] Add ISBN/barcode scanning for quick book adding

### Blog & Messaging
- [ ] Add rich text editor for blog posts (beyond raw Markdown)
- [ ] Add image uploads in blog posts
- [ ] Add user profiles with avatar and bio
- [ ] Add follow/unfollow users
- [ ] Add post bookmarking
- [ ] Add group conversations in messaging
- [ ] Add message reactions (emoji)
- [ ] Add push notifications for new messages and blog comments

---

## New Feature Ideas

Entirely new tools and features to add to the app:

### 💰 Budget & Finance Tracker
- [ ] Add income and expense tracking with categories
- [ ] Add monthly budget goals and progress
- [ ] Add visual spending breakdown (pie/bar charts)
- [ ] Add recurring transaction support
- [ ] Add bill reminders
- [ ] Add savings goals with progress tracking
- [ ] Add multi-currency support

### 📅 Calendar & Scheduling
- [ ] Add full calendar view integrating tasks, habits, events, and journal entries
- [ ] Add event creation with date, time, location, and reminders
- [ ] Add weekly and daily agenda views
- [ ] Add sync with device calendar (Google Calendar, Samsung Calendar)
- [ ] Add time blocking / schedule builder

### 🏋️ Fitness & Workout Logger
- [ ] Add workout logging (exercises, sets, reps, weight)
- [ ] Add preset workout templates
- [ ] Add exercise library with descriptions
- [ ] Add workout history with progress charts
- [ ] Add body weight / measurement tracking
- [ ] Add rest timer between sets
- [ ] Add integration with health data (Google Fit / Health Connect)

### 💤 Sleep Tracker
- [ ] Add manual sleep logging (bedtime, wake time, quality)
- [ ] Add sleep goal setting
- [ ] Add sleep trends graph
- [ ] Add correlation with mood and productivity

### 🍽️ Meal Planner & Nutrition
- [ ] Add meal logging with basic nutrition info
- [ ] Add recipe saving with ingredients and instructions
- [ ] Add weekly meal plan builder
- [ ] Add grocery list generation from meal plans
- [ ] Add water intake tracking with daily goal

### 📒 Notes & Quick Capture
- [ ] Add a quick-capture widget / floating action button for instant notes
- [ ] Add pinned notes on dashboard
- [ ] Add checklists within notes
- [ ] Add Markdown support in notes (lighter-weight than journal)

### 🔑 Password Manager (Basic)
- [ ] Add encrypted password storage with master password
- [ ] Add password generator
- [ ] Add auto-fill integration (Android Autofill API)
- [ ] Add secure notes for non-password sensitive info

### 📍 Location & Places
- [ ] Add favourite places list with notes
- [ ] Add location-based reminders (remind me when I arrive at…)
- [ ] Add travel packing list templates

### 🧮 Utilities & Calculators
- [ ] Add unit converter (length, weight, temperature, currency)
- [ ] Add tip calculator
- [ ] Add quick math / scientific calculator
- [ ] Add countdown timers for events ("days until…")
- [ ] Add stopwatch

### 🎯 Goals & Vision Board
- [ ] Add long-term goal setting with milestones
- [ ] Add vision board with images and affirmations
- [ ] Add progress tracking toward each goal
- [ ] Add goal categories (career, health, personal, financial)

### 📊 Analytics Dashboard
- [ ] Add unified analytics screen showing trends across all tools
- [ ] Add weekly/monthly summary reports
- [ ] Add productivity score based on tasks, focus time, and habits
- [ ] Add charts (line, bar, pie) using react-native-chart-kit or Victory Native
- [ ] Add streak leaderboard (personal bests)

### 🤖 AI-Powered Features
- [ ] Add AI task suggestions based on patterns and history
- [ ] Add AI journal prompts personalised to mood and recent activity
- [ ] Add AI-powered voice transcription for audio notes
- [ ] Add AI summary of weekly activity
- [ ] Add smart search across all app data
- [ ] Add AI chatbot assistant for productivity tips

---

## UI/UX Improvements

### Design & Polish
- [ ] Add onboarding flow for first-time users (feature tour / walkthrough)
- [ ] Add splash screen with app branding
- [ ] Add animated transitions between screens (shared element transitions)
- [ ] Add skeleton loading screens for data-heavy views
- [ ] Add pull-to-refresh on all list screens
- [ ] Add swipe gestures for common actions (swipe to delete, archive, complete)
- [ ] Add empty state illustrations for each feature (currently text-only)
- [ ] Add haptic feedback tuning (different patterns for different actions)
- [ ] Add toast notifications for success/error feedback (not just alerts)
- [ ] Add bottom sheet modals for quick actions
- [ ] Add floating action button (FAB) on key screens for quick add

### Accessibility
- [ ] Audit all screens for accessibility labels and roles
- [ ] Add screen reader support and testing
- [ ] Ensure minimum touch target sizes (48x48dp)
- [ ] Add high contrast mode
- [ ] Add reduced motion support (honour system preference)
- [ ] Add dynamic type support (follow system font size beyond app setting)

### Navigation
- [ ] Add search bar in navigation header for global search
- [ ] Add recently accessed items / quick links on home screen
- [ ] Add customisable bottom tab bar (choose which 5 tabs to show)
- [ ] Add gesture-based navigation between related screens

---

## Performance & Technical Debt

### Performance
- [ ] Profile and optimise render performance on low-end devices
- [ ] Add list virtualisation everywhere (ensure FlashList is used consistently)
- [ ] Lazy-load screens with React.lazy + Suspense
- [ ] Optimise image loading and caching
- [ ] Add memoisation to expensive computed values in stores
- [ ] Audit and reduce bundle size (tree-shaking, removing unused deps)

### Technical Debt
- [ ] Standardise error handling pattern across all stores and services
- [ ] Add input validation to all forms (task create, journal editor, habit create, etc.)
- [ ] Replace magic strings with enums/constants
- [ ] Add proper loading states to all async operations
- [ ] Refactor navigation types to be fully type-safe (no `as any`)
- [ ] Add proper TypeScript generics to shared UI components
- [ ] Audit all `any` types and replace with proper types
- [ ] Add prop validation / default props to all components
- [ ] Consolidate shared styles into the theme system
- [ ] Decouple Supabase from stores — use a repository pattern

### Dependencies
- [ ] Set up Dependabot or Renovate for automated dependency updates
- [ ] Audit all dependencies for security vulnerabilities
- [ ] Remove unused dependencies from package.json
- [ ] Pin dependency versions for reproducible builds

---

## Testing & Quality

### Unit Tests
- [ ] Add unit tests for all Zustand stores (habit, focus, audio, mood, snippets, reading, auth, dev)
- [ ] Add unit tests for all utility functions
- [ ] Add unit tests for all custom hooks
- [ ] Add unit tests for theme builder and colour generation
- [ ] Achieve >80% code coverage on business logic

### Component Tests
- [ ] Add render tests for all UI components (Button, Card, Input, Badge, etc.)
- [ ] Add interaction tests for form components
- [ ] Add snapshot tests for screen layouts

### Integration Tests
- [ ] Add integration tests for navigation flows
- [ ] Add integration tests for auth flow (login, signup, guest, logout)
- [ ] Add integration tests for data persistence (store → MMKV → restore)

### End-to-End Tests
- [ ] Set up Detox E2E test suite with baseline scenarios
- [ ] Add E2E test for task creation and completion flow
- [ ] Add E2E test for journal entry creation
- [ ] Add E2E test for authentication flow
- [ ] Add E2E test for theme switching

### Quality Automation
- [ ] Add pre-commit hooks (Husky + lint-staged) for lint, format, typecheck
- [ ] Add CI check that blocks merge on test failures
- [ ] Add CI coverage reporting (Codecov or similar)
- [ ] Add visual regression testing for UI components

---

## Documentation

- [x] Expand README with comprehensive project overview
- [x] Create CONTRIBUTING.md with code style and PR guidelines
- [x] Create CHANGELOG.md for version tracking
- [x] Create this TASK_LIST.md roadmap
- [ ] Add JSDoc comments to all public interfaces in `src/types/`
- [ ] Add JSDoc comments to all store actions
- [ ] Add JSDoc comments to all service functions
- [ ] Add JSDoc comments to all custom hooks
- [ ] Add inline code comments for complex business logic (XP calculations, streak logic)
- [ ] Add API documentation for Supabase schema and RLS policies
- [ ] Create a SECURITY.md with vulnerability reporting instructions
- [ ] Create a FAQ.md for common development questions
- [ ] Add architecture decision records (ADRs) for key design choices
- [ ] Add diagrams (navigation flow, data flow, state architecture) using Mermaid or draw.io
- [ ] Add screenshot gallery to README showing each feature

---

## Infrastructure & DevOps

### CI/CD
- [ ] Add CI job for running unit tests on every PR
- [ ] Add CI job for lint + typecheck on every PR
- [ ] Add CI job for building release APK with signing
- [ ] Add automated versioning (semantic-release or standard-version)
- [ ] Add release notes generation from commit history
- [ ] Add APK size tracking across builds
- [ ] Add CI caching for node_modules and Gradle

### Deployment
- [ ] Set up Google Play Console for app distribution
- [ ] Add internal testing track on Google Play
- [ ] Set up Fastlane for automated builds and deployment
- [ ] Add OTA update support (CodePush or EAS Updates)

### Monitoring
- [ ] Add analytics tracking (Firebase Analytics or PostHog)
- [ ] Add performance monitoring (Firebase Performance)
- [ ] Add error tracking in production (Sentry)
- [ ] Add feature flag management for gradual rollouts

---

## Long-Term / Ambitious Ideas

These are bigger ideas for the future — no timeline, just aspirations:

- [ ] **iOS support** — Expand to iOS (React Native already supports it, but builds and testing need setup)
- [ ] **Web app** — React Native Web or a companion Next.js web dashboard
- [ ] **Tablet/foldable layout** — Responsive layouts for tablets and foldable devices
- [ ] **Widget support** — Android home screen widgets (today's tasks, habit grid, focus timer)
- [ ] **Wear OS companion** — Quick habit check-ins and focus timer from a smartwatch
- [ ] **Plugin/extension system** — Allow users to add custom tools via a plugin API
- [ ] **Multi-user / family plan** — Shared task lists, family habits, household budget
- [ ] **Gamification expansion** — Badges, titles, avatar customisation, daily challenges, XP multipliers
- [ ] **Social features** — Public profiles, follow feeds, community challenges, shared journals
- [ ] **Themeable icon packs** — Custom icons for bottom tabs and tool cards
- [ ] **Localisation (i18n)** — Multi-language support starting with Spanish, French, German
- [ ] **Full accessibility certification** — Achieve WCAG 2.1 AA compliance across the entire app (builds on items in UI/UX Improvements → Accessibility)
- [ ] **Offline-only mode** — Option to never connect to cloud, fully local-first
- [ ] **Open source** — Consider open-sourcing the app in the future

---

*Last updated: April 2026*
