import {test, expect} from '@playwright/test';

test.describe('ScottyApp Web Layer', () => {
  test('placeholder — web layer not applicable for RN', async ({page}) => {
    // Playwright is configured for any web views or Storybook component testing.
    // Native screen testing uses Detox (see e2e/ directory).
    // This file validates the Playwright config is working.
    expect(true).toBe(true);
  });
});
