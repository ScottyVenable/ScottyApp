# Testing Guide

## Test Stack

| Tool | Purpose |
|---|---|
| Jest + @react-native/jest-preset | Unit & integration tests |
| @testing-library/react-native | Component rendering tests |
| Playwright | Web view / component story tests |
| Detox | E2E native Android tests |

## Running Tests

```bash
npm test                          # all Jest tests
npm run test:coverage             # with coverage report
npm run test:playwright           # Playwright web tests
npm run test:e2e                  # Detox (requires emulator)
```

## Unit Test Structure

```
src/__tests__/
├── unit/
│   ├── tasks.test.ts      XP system, level thresholds, priority XP
│   ├── taskStore.test.ts  Task CRUD, XP awarding, filtering
│   ├── journal.test.ts    Entry CRUD, word count, search filtering
│   └── id.test.ts         ID generator uniqueness
└── playwright/
    └── app.spec.ts        Playwright placeholder (native = Detox)
```

## Mocks

All mocks are in `src/__mocks__/`:

| Mock | Replaces |
|---|---|
| `react-native-mmkv.ts` | In-memory MMKV for tests |
| `react-native-haptic-feedback.ts` | jest.fn() trigger |
| `react-native-device-info.ts` | Static device info |
| `fileMock.js` | Image/asset imports |

## Writing Tests

### Store test pattern

```typescript
jest.mock('react-native-mmkv');  // always mock storage first

import { useMyStore } from '../../store/myStore';

describe('My Store', () => {
  beforeEach(() => {
    useMyStore.setState({ /* reset to defaults */ });
  });

  test('does something', () => {
    useMyStore.getState().doAction();
    expect(useMyStore.getState().result).toBe(expected);
  });
});
```

### Component test pattern

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from '../../components/ui/MyComponent';

test('renders correctly', () => {
  const { getByText } = render(<MyComponent label="Test" onPress={jest.fn()} />);
  expect(getByText('Test')).toBeTruthy();
});
```

## Coverage

Coverage is collected from `src/**/*.{ts,tsx}` excluding:
- Type declaration files
- Index re-exports
- Test files themselves

Run `npm run test:coverage` and view `coverage/lcov-report/index.html`.
