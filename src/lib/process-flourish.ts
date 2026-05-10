/**
 * Drives the "How I work" card flourish animations on touch devices.
 * Desktop uses :hover directly. Touch has no real hover, so:
 *   - When each panel scrolls into view, briefly play its flourish (cascaded).
 *   - Tap on a panel re-plays the flourish.
 * The flourish state is mirrored in CSS via .is-flourishing.
 */
const PLAY_MS = 2400;
const STAGGER_MS = 220;

export const initProcessFlourish = (): void => {
  if (typeof document === 'undefined') return;
  const hasHover = window.matchMedia?.('(hover: hover)').matches ?? false;
  if (hasHover) return;

  const panels = Array.from(document.querySelectorAll<HTMLElement>('#process .panel'));
  if (panels.length === 0) return;

  const play = (el: HTMLElement) => {
    el.classList.add('is-flourishing');
    window.setTimeout(() => el.classList.remove('is-flourishing'), PLAY_MS);
  };

  panels.forEach((panel) => {
    panel.addEventListener('click', () => {
      if (panel.classList.contains('is-flourishing')) return;
      play(panel);
    });
  });

  if (!('IntersectionObserver' in window)) return;
  let cascadeStarted = false;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (cascadeStarted) {
          play(e.target as HTMLElement);
          io.unobserve(e.target);
          return;
        }
        cascadeStarted = true;
        panels.forEach((p, i) => {
          window.setTimeout(() => play(p), i * STAGGER_MS);
        });
        panels.forEach((p) => io.unobserve(p));
      });
    },
    { threshold: 0.4 },
  );
  panels.forEach((p) => io.observe(p));
};
