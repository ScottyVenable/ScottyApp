# ScottyApp — Feature Reference

## Journal
- Create/edit entries with real-time Markdown
- Three view modes: **Edit** (raw MD), **Split** (side-by-side), **Preview**
- Formatting toolbar: Bold, Italic, Heading, List, Quote, Code
- Search across all entries
- Pin entries to the top
- Word count displayed per entry
- Tags for organisation

## Tasks (Gamified)
- Priority levels: Urgent / High / Medium / Low (each with XP reward: 50 / 30 / 15 / 5)
- Categories: Work, Personal, Health, Learning, Creative, Other
- **XP system**: earn points for completing tasks
- **Level progression**: 10+ levels with quadratic XP thresholds
- **Streak tracking**: consecutive days with at least one completion
- **Achievements**: 8 unlockable (First Steps, Week Warrior, Iron Will, Power User, etc.)
- Swipe to complete; long-press to delete
- Filter by status / category / priority

## Focus Timer (Pomodoro)
- Configurable focus (default 25m), short break (5m), long break (15m)
- Visual session indicator dots
- Automatic mode switching after session ends
- Session history with daily focus minutes
- Current task label

## Habit Tracker
- Daily / Weekday / Weekend frequency options
- Custom colour per habit
- 7-day completion grid visualisation
- Current streak + longest streak
- Weekly completion progress bar
- XP reward per check-in (configurable)

## Audio Notes
- Record voice memos (mic permission required)
- Playback with duration display
- Optional transcript field
- Tap to rename after recording

## Mood Tracker
- 5-level scale: Rough / Low / Okay / Good / Great
- Optional text note per check-in
- History view with date/time

## Code Snippets
- Save code with title + language label
- Monospace preview in list
- Language filter: TypeScript, JS, Python, Bash, SQL, CSS, HTML, JSON

## Reading List
- Save titles + optional URLs
- Mark as read (strikethrough)
- One-tap add from anywhere

## Blog (Social)
- Public posts with Markdown content
- Like + comment counts
- Write new posts with Markdown editor

## Messaging
- 1-on-1 conversations
- Real-time via Supabase (when cloud sync enabled)
- Unread badge count

## Theme Creator
- **3 appearance modes**: Light / Dark / Auto (follows system)
- **8 accent colour presets**: Violet, Blue, Teal, Amber, Rose, Green, Indigo, Orange
- **3 font styles**: System (default), Inter, JetBrains Mono
- **5 font size steps**: XS / S / M / L / XL
- Live preview card

## Dev Menu (Developer Mode)
Access: toggle switch on Home screen (only visible in `__DEV__` builds)

- **Feature Flags**: toggle AI, Blog, Messaging, Voice Transcription, Cloud Sync
- **Logs**: real-time log buffer (INFO / WARN / ERROR), clearable
- **App Info**: version, build type, bundle ID, OS, device model

## Additional Ideas Implemented
- **Quick stats dashboard** on Home (XP, streak, tasks, habits)
- **Greeting** personalised by time of day
- **Guest mode** (no account required)
