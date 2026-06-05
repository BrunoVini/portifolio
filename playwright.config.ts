/// <reference types="node" />
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Unit tests live in tests/unit and run under Vitest (*.test.ts). Restrict
  // Playwright to *.spec.ts so the two runners never pick up each other's files.
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4321' },
  expect: {
    // Hand-drawn rotations + web fonts mean a handful of antialiased pixels
    // shift between renders. Allow a small ratio so snapshots aren't brittle.
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    url: 'http://localhost:4321/portifolio/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'mobile-360', use: { viewport: { width: 360, height: 640 } } },
    { name: 'tablet-768', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'desktop-1440', use: { viewport: { width: 1440, height: 900 } } },
  ],
});
