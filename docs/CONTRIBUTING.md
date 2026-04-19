# Contributing to ScottyApp

Thank you for your interest in contributing to ScottyApp! This guide covers the conventions, workflow, and expectations for working on this project.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Branch Strategy](#branch-strategy)
3. [Commit Messages](#commit-messages)
4. [Code Style](#code-style)
5. [Pull Request Process](#pull-request-process)
6. [Adding a New Feature](#adding-a-new-feature)
7. [Writing Tests](#writing-tests)
8. [Documentation](#documentation)

---

## Getting Started

1. Clone the repository and install dependencies (see [DEVELOPMENT.md](./DEVELOPMENT.md)).
2. Make sure you can run the app locally with `npm start` and `npm run android`.
3. Run the full test suite with `npm test` to confirm everything passes before making changes.

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable release branch — always deployable |
| `feature/<name>` | New features (e.g. `feature/budget-tracker`) |
| `fix/<name>` | Bug fixes (e.g. `fix/task-xp-calculation`) |
| `docs/<name>` | Documentation-only changes |
| `refactor/<name>` | Refactoring without changing functionality |

Create your branch from `main`:

```bash
git checkout main
git pull origin main
git checkout -b feature/my-feature
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | When to Use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semicolons, etc. (no code logic change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, tooling |
| `perf` | Performance improvements |

### Examples

```
feat(tasks): add swipe-to-delete gesture
fix(journal): correct word count for empty entries
docs: expand README with feature table
test(habits): add streak calculation edge cases
chore: upgrade React Native to 0.85.1
```

## Code Style

### TypeScript

- **Strict mode** is enabled — no `any` types unless absolutely necessary.
- Use **functional components** with hooks (no class components).
- Use **named exports** for components; **default exports** only for screens.
- Prefer `const` over `let`; never use `var`.
- Use path aliases (`@components/`, `@store/`, etc.) instead of relative imports.

### Formatting

- **Prettier** handles all formatting. Run `npm run format` before committing.
- **ESLint** enforces code quality. Run `npm run lint` and fix all issues.
- **TypeScript** must pass `npm run typecheck` with zero errors.

### File Naming

| Type | Convention | Example |
|---|---|---|
| Screen | `PascalCase` + `Screen` suffix | `TaskListScreen.tsx` |
| Component | `PascalCase` | `Button.tsx`, `Card.tsx` |
| Store | `camelCase` + `Store` suffix | `taskStore.ts` |
| Service | `camelCase` + `Service` suffix | `authService.ts` |
| Hook | `camelCase` with `use` prefix | `useTheme.ts` |
| Type file | `camelCase` | `tasks.ts`, `journal.ts` |
| Test file | Mirror source + `.test` suffix | `taskStore.test.ts` |

### Component Structure

```typescript
// 1. Imports (external → internal → types → styles)
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import type { AppTheme } from '@types/theme';

// 2. Props interface
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

// 3. Component
export function MyComponent({ title, onPress }: MyComponentProps) {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text>{title}</Text>
    </View>
  );
}

// 4. Styles (if using StyleSheet)
```

## Pull Request Process

1. **Ensure your branch is up to date** with `main`.
2. **Run all checks** before opening a PR:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```
3. **Open a PR** against `main` with a clear title and description.
4. **Fill out the PR template** (if one exists), including:
   - What changed and why
   - Screenshots (for UI changes)
   - How to test the change
5. **Address review feedback** promptly.
6. **Squash and merge** when approved.

## Adding a New Feature

Follow the established pattern (see also [DEVELOPMENT.md](./DEVELOPMENT.md)):

1. **Types** — Define interfaces in `src/types/<feature>.ts`
2. **Store** — Create a Zustand store in `src/store/<feature>Store.ts`
3. **Screens** — Add screen(s) to `src/screens/<feature>/`
4. **Navigation** — Register the screen in the appropriate navigator
5. **Route types** — Add the route to `src/navigation/types.ts`
6. **Tests** — Add unit tests in `src/__tests__/unit/`
7. **Docs** — Update `docs/FEATURES.md` with the new feature's details

## Writing Tests

- Every new store should have unit tests covering CRUD operations and edge cases.
- Every new component should have at least a render test.
- Follow the patterns in [TESTING.md](./TESTING.md).
- Always mock `react-native-mmkv` at the top of store tests.
- Aim for meaningful coverage, not 100% line coverage — focus on business logic.

## Documentation

- **Code comments**: Add JSDoc-style comments to public interfaces, complex functions, and non-obvious logic. Don't comment obvious code.
- **README**: If your change adds a visible feature, update the feature table in `README.md`.
- **Feature reference**: Update `docs/FEATURES.md` with details for any new or changed features.
- **Task list**: When completing a planned task, check it off in `docs/TASK_LIST.md`.

---

Questions? Open an issue or reach out to [@ScottyVenable](https://github.com/ScottyVenable).
