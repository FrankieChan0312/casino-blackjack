import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser', testMatch: '**/*.spec.ts', fullyParallel: false,
  workers: 1, retries: 0, reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium', reducedMotion: 'reduce', viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium' }],
  webServer: { command: 'npm run dev -- --mode e2e --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
});
