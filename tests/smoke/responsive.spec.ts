import { test, expect } from '@playwright/test';

test('home renders without horizontal overflow', async ({ page }) => {
  await page.goto('/portifolio/');
  await expect(page.locator('h1.title')).toContainText(/Code as|Código/);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow).toBe(false);
});

test('PT route renders Portuguese title', async ({ page, context }) => {
  // Pre-seed locale so the auto-detect island does not redirect us to /portifolio/.
  await context.addInitScript(() => {
    window.localStorage.setItem('bruno.locale', 'pt');
  });
  await page.goto('/portifolio/pt/');
  await expect(page.locator('h1.title')).toContainText('Código');
});

test('navigation contains expected anchors', async ({ page }) => {
  await page.goto('/portifolio/');
  await expect(page.locator('nav a[href="#about"]').first()).toBeAttached();
  await expect(page.locator('nav a[href="#work"]').first()).toBeAttached();
  await expect(page.locator('nav a[href="#skills"]').first()).toBeAttached();
  await expect(page.locator('nav a[href="#contact"]').first()).toBeAttached();
});

test('sections present on home', async ({ page }) => {
  await page.goto('/portifolio/');
  for (const id of ['about', 'experience', 'work', 'skills', 'contact']) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
});
