/**
 * Returns the flip strength to use given viewport + motion preferences.
 * - Above 980px → full 95° page-turn (700ms)
 * - 600–980px   → softer 70° flip (520ms)
 * - Below 600px → gentle 35° hint (380ms) — works on phones without nausea
 * - prefers-reduced-motion → null (no flip; smooth scroll only)
 */
export type FlipStrength = { angle: number; duration: number };

export const flipStrengthFor = (
  innerWidth: number,
  prefersReducedMotion: boolean,
): FlipStrength | null => {
  if (prefersReducedMotion) return null;
  if (innerWidth >= 980) return { angle: 95, duration: 700 };
  if (innerWidth >= 600) return { angle: 70, duration: 520 };
  return { angle: 35, duration: 380 };
};

export const canFlip = (innerWidth: number, prefersReducedMotion: boolean): boolean =>
  flipStrengthFor(innerWidth, prefersReducedMotion) !== null;

export const attachPageFlip = (selector = 'a[href^="#"]'): void => {
  if (typeof document === 'undefined') return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  document.querySelectorAll<HTMLAnchorElement>(selector).forEach((a) => {
    if (!reduce) {
      a.addEventListener('pointerenter', () => {
        const id = a.getAttribute('href')?.slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        const card = target?.closest('[data-page-card]') as HTMLElement | null;
        if (!card) return;
        card.animate(
          [
            { transform: 'rotateX(0deg)' },
            { transform: 'rotateX(-6deg)' },
            { transform: 'rotateX(0deg)' },
          ],
          { duration: 360, easing: 'cubic-bezier(0.4,0,0.2,1)' },
        );
      });
    }
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      const strength = flipStrengthFor(window.innerWidth, reduce);
      if (!strength) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      const card = target.closest('[data-page-card]') as HTMLElement | null;
      if (!card) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      e.preventDefault();
      const easing = 'cubic-bezier(0.4,0,0.2,1)';
      const out = card.animate(
        [{ transform: 'rotateX(0deg)' }, { transform: `rotateX(-${strength.angle}deg)` }],
        { duration: strength.duration, easing, fill: 'forwards' },
      );
      out.onfinish = () => {
        target.scrollIntoView({ behavior: 'auto' });
        card.animate(
          [{ transform: `rotateX(-${strength.angle}deg)` }, { transform: 'rotateX(0deg)' }],
          { duration: strength.duration, easing, fill: 'forwards' },
        );
      };
    });
  });
};
