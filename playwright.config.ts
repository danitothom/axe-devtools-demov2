import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/playwright',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3033',
    // Configure tracing/video via environment variables for CI flexibility.
    // Examples:
    //  PW_TRACE=on            -> always collect trace
    //  PW_TRACE=on-first-retry -> collect trace on first retry (default)
    //  PW_VIDEO=retain-on-failure -> retain video only on failure
    trace: process.env.PW_TRACE || 'on-first-retry',
    video: process.env.PW_VIDEO || 'retain-on-failure',
    screenshot: process.env.PW_SCREENSHOT || 'only-on-failure',
  },
  projects: [
    {
      name: 'axe-devtools-apis',
      testDir: './test/playwright/axe-devtools-apis',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'axe-watcher',
      testDir: './test/playwright/axe-watcher',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
