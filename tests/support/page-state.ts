import type { Page } from '@playwright/test';

/**
 * Force a page into a stable, fully-painted state suitable for axe scans and
 * visual snapshots:
 *  - reveal every `[data-reveal]` element (the IntersectionObserver only fires
 *    them as you scroll, which would leave most of the page at opacity 0);
 *  - wait for web fonts so glyph metrics don't shift mid-screenshot;
 *  - drop the rocket cursor so the synthetic pointer never lands in a frame.
 */
export const settlePage = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    // Kill transitions/animations first so revealing jumps straight to the
    // settled state — otherwise an axe scan can sample a [data-reveal] element
    // mid-fade (opacity < 1), which blends colours lighter and reports phantom
    // contrast failures for the transient frame rather than the final paint.
    const style = document.createElement('style');
    style.textContent = `*, *::before, *::after {
      transition: none !important;
      animation: none !important;
    }`;
    document.head.appendChild(style);

    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-revealed'));
    document.documentElement.classList.remove('rocket-on');
  });
  await page.evaluate(() => document.fonts.ready);
};

/** Seed a locale before navigation so the auto-detect island does not redirect. */
export const seedLocale = async (page: Page, locale: 'en' | 'pt'): Promise<void> => {
  await page.context().addInitScript((value) => {
    window.localStorage.setItem('bruno.locale', value);
  }, locale);
};
