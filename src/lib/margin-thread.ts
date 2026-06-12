/**
 * Living margin thread — drives src/components/ui/MarginThread.astro.
 *
 * The red pen line in the page gutter inks itself down as the reader scrolls.
 * Line progress is pure CSS where scroll-driven animations are supported
 * (`.thread-css`, animation-timeline: scroll(root)); otherwise a passive,
 * rAF-throttled scroll listener writes `--thread-progress` (`.thread-js`).
 * Doodle marks are placed at each section anchor (measured once at init and
 * again on resize / content growth — never per scroll frame) and ink in via
 * IntersectionObserver as the pen reaches their section.
 *
 * Reduced motion: the thread is never "armed" — the line renders as a static,
 * fully drawn stroke and all marks are placed already inked. Zero motion.
 */

interface AnchorMark {
  mark: HTMLElement;
  section: HTMLElement;
}

/** How far up the viewport a section must rise before its mark inks in. */
const REACH = 0.45;

const collectAnchors = (thread: HTMLElement): AnchorMark[] =>
  Array.from(thread.querySelectorAll<HTMLElement>('[data-thread-mark]')).flatMap((mark) => {
    const section = document.getElementById(mark.dataset.threadMark ?? '');
    return section ? [{ mark, section }] : [];
  });

const placeMarks = (anchors: AnchorMark[]): void => {
  const doc = document.documentElement;
  const vh = window.innerHeight;
  const maxScroll = Math.max(1, doc.scrollHeight - vh);
  anchors.forEach(({ mark, section }) => {
    const top = section.getBoundingClientRect().top + window.scrollY;
    const progress = Math.min(1, Math.max(0, (top - vh * REACH) / maxScroll));
    mark.style.setProperty('--mark-top', `${(progress * 100).toFixed(2)}%`);
    mark.classList.add('is-placed');
  });
};

const rafDebounce = (fn: () => void): (() => void) => {
  let queued = false;
  return () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn();
    });
  };
};

const watchLayout = (replace: () => void): void => {
  window.addEventListener('resize', replace, { passive: true });
  window.addEventListener('load', replace, { once: true });
  if ('ResizeObserver' in window) {
    new ResizeObserver(replace).observe(document.body);
  }
};

const observeMarks = (anchors: AnchorMark[]): void => {
  if (!('IntersectionObserver' in window)) {
    anchors.forEach(({ mark }) => mark.classList.add('is-inked'));
    return;
  }
  // Any change in a mark's truth means some section crossed the trigger line,
  // which always fires an IO entry — so the callback recomputes every mark
  // from one batched read pass (no per-frame scroll work, no stale marks on
  // anchor jumps or fast scrolls where IO skips intermediate sections).
  const inkReached = (): void => {
    const line = window.innerHeight * (1 - REACH);
    const reached = anchors.map(({ section }) => section.getBoundingClientRect().top <= line);
    anchors.forEach(({ mark }, i) => mark.classList.toggle('is-inked', reached[i]));
  };
  const io = new IntersectionObserver(inkReached, {
    rootMargin: `0px 0px -${Math.round(REACH * 100)}% 0px`,
    threshold: 0,
  });
  anchors.forEach(({ section }) => io.observe(section));
};

const armProgressFallback = (thread: HTMLElement): void => {
  let maxScroll = 1;
  const remeasure = (): void => {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };
  remeasure();
  window.addEventListener('resize', rafDebounce(remeasure), { passive: true });
  const update = rafDebounce(() => {
    const p = Math.min(1, window.scrollY / maxScroll);
    thread.style.setProperty('--thread-progress', p.toFixed(4));
  });
  window.addEventListener('scroll', update, { passive: true });
  update();
};

export const supportsScrollProgress = (): boolean =>
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports('animation-timeline: scroll()');

export const initMarginThread = (): void => {
  if (typeof document === 'undefined') return;
  const thread = document.querySelector<HTMLElement>('[data-margin-thread]');
  if (!thread) return;

  const anchors = collectAnchors(thread);
  const replace = rafDebounce(() => placeMarks(anchors));
  placeMarks(anchors);
  watchLayout(replace);

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if (reduce) {
    // Static drawing: full line (base CSS state) + every mark already inked.
    anchors.forEach(({ mark }) => mark.classList.add('is-inked'));
    return;
  }

  thread.classList.add('thread-armed');
  if (supportsScrollProgress()) {
    thread.classList.add('thread-css');
  } else {
    thread.classList.add('thread-js');
    armProgressFallback(thread);
  }
  observeMarks(anchors);
};
