import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 60_000,
  workers: 1,
  use: {
    ...devices['Pixel 7'],
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
    baseURL: 'http://127.0.0.1:4173/resonance/',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/resonance/',
    reuseExistingServer: !process.env.CI,
  },
});
