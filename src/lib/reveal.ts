/**
 * Adds `.is-revealed` to `[data-reveal]` elements as they enter the viewport.
 * Siblings sharing a parent get a staggered transition-delay so cascades feel
 * rhythmic rather than snapping all at once. Cap at 6 steps (480ms) so a
 * 12-badge grid never feels sluggish.
 */
const STAGGER_MS = 80;
const STAGGER_CAP = 6;

const tagSiblingStagger = (el: HTMLElement) => {
  const parent = el.parentElement;
  if (!parent) return;
  const peers = Array.from(parent.querySelectorAll<HTMLElement>(':scope > [data-reveal]'));
  const idx = peers.indexOf(el);
  if (idx <= 0) return;
  const step = Math.min(idx, STAGGER_CAP);
  el.style.transitionDelay = `${step * STAGGER_MS}ms`;
};

export const initReveal = (): void => {
  if (typeof document === 'undefined') return;
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (els.length === 0) return;

  els.forEach((el) => tagSiblingStagger(el));

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('is-revealed');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
  );

  els.forEach((el) => io.observe(el));
};
