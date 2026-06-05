import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { settlePage, seedLocale } from '../support/page-state';

// Each viewport project (mobile-360 / tablet-768 / desktop-1440) runs this file,
// so a single describe covers responsive a11y across all three breakpoints.
const routes = [
  { name: 'EN home', locale: 'en' as const, path: '/portifolio/' },
  { name: 'PT home', locale: 'pt' as const, path: '/portifolio/pt/' },
];

for (const route of routes) {
  test(`${route.name} has no WCAG 2 A/AA violations`, async ({ page }) => {
    await seedLocale(page, route.locale);
    await page.goto(route.path);
    await settlePage(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
