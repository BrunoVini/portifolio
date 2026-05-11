/**
 * Drives the "How I work" card flourish animations on touch devices.
 * Desktop uses :hover directly. Touch has no real hover, so:
 *   - When each panel/tool-card scrolls into view, briefly play its flourish (cascaded).
 *   - Tap on a panel/tool-card re-plays the flourish.
 * The flourish state is mirrored in CSS via .is-flourishing.
 */
const PLAY_MS = 2400;
const STAGGER_MS = 220;
const TOOLS_PLAY_MS = 1200;
const TOOLS_STAGGER_MS = 90;

const play = (el: HTMLElement, durationMs: number) => {
  el.classList.add('is-flourishing');
  window.setTimeout(() => el.classList.remove('is-flourishing'), durationMs);
};

const setupCascadeGroup = (
  elements: HTMLElement[],
  duration: number,
  stagger: number,
  threshold: number,
) => {
  if (elements.length === 0) return;

  elements.forEach((el) => {
    el.addEventListener('click', () => {
      if (el.classList.contains('is-flourishing')) return;
      play(el, duration);
    });
  });

  if (!('IntersectionObserver' in window)) return;
  let cascadeStarted = false;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (cascadeStarted) {
          play(e.target as HTMLElement, duration);
          io.unobserve(e.target);
          return;
        }
        cascadeStarted = true;
        elements.forEach((el, i) => {
          window.setTimeout(() => play(el, duration), i * stagger);
        });
        elements.forEach((el) => io.unobserve(el));
      });
    },
    { threshold },
  );
  elements.forEach((el) => io.observe(el));
};

export const initProcessFlourish = (): void => {
  if (typeof document === 'undefined') return;
  const hasHover = window.matchMedia?.('(hover: hover)').matches ?? false;
  if (hasHover) return;

  const panels = Array.from(document.querySelectorAll<HTMLElement>('#process .panel'));
  setupCascadeGroup(panels, PLAY_MS, STAGGER_MS, 0.4);

  const toolCards = Array.from(document.querySelectorAll<HTMLElement>('#process .tool-card'));
  setupCascadeGroup(toolCards, TOOLS_PLAY_MS, TOOLS_STAGGER_MS, 0.3);
};
