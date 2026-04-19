import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', {outputFolder: 'test-results/playwright-report'}]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'Mobile Chrome',
      use: {...devices['Pixel 5']},
    },
  ],
  outputDir: 'test-results/playwright',
});
