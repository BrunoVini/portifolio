import { test, expect } from '@playwright/test';
import { settlePage, seedLocale } from '../support/page-state';

// Baselines are platform-specific (font hinting + antialiasing differ across
// OSes). These are intended to run locally against committed baselines, not in
// CI on a different renderer. Regenerate with `npm run test:visual:update`.
const routes = [
  { name: 'en-home', locale: 'en' as const, path: '/portifolio/' },
  { name: 'pt-home', locale: 'pt' as const, path: '/portifolio/pt/' },
];

for (const route of routes) {
  test(`${route.name} full page matches snapshot`, async ({ page }) => {
    await seedLocale(page, route.locale);
    await page.goto(route.path);
    await settlePage(page);

    await expect(page).toHaveScreenshot(`${route.name}.png`, { fullPage: true });
  });
}
