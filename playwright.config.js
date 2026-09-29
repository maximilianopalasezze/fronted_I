import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined }, baseURL: 'http://127.0.0.1:4173/fronted_I/', viewport: { width: 1440, height: 1000 }, locale: 'es-CL', reducedMotion: 'reduce' },
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --port 4173', url: 'http://127.0.0.1:4173/fronted_I/', reuseExistingServer: !process.env.CI },
});
