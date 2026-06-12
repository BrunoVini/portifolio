/**
 * Self-drawing ink primitive.
 *
 * Any inline SVG (or a group/shape inside one) marked with `data-ink` gets its
 * strokes measured (getTotalLength → `--ink-len`) so they can ink themselves
 * in via the keyframes/utilities in src/styles/animations.css.
 *
 * Modes (the attribute value):
 * - `data-ink` / `data-ink="enter"` — draws once when entering the viewport
 *   (IntersectionObserver).
 * - `data-ink="scroll"` — stroke progress is scrubbed by scroll position
 *   (CSS scroll-driven animations, `view-timeline` on the owning <svg>).
 *   Falls back to the enter behaviour where unsupported.
 *
 * Stagger (enter mode only):
 * - `data-ink-delay="400"` on the root — base delay in ms for every stroke.
 * - `data-ink-stagger` (optionally `="150"`) on the root — auto-stagger
 *   strokes in DOM order by the given step (defaults to the `--ink-stagger`
 *   token).
 * - `data-ink-order="3"` on a shape or group — explicit stagger index,
 *   overriding DOM order.
 *
 * Reduced motion: init is a no-op, so strokes render fully drawn (the hidden
 * state only exists behind JS classes + a no-preference media query).
 */

const SHAPES = 'path, circle, rect, line, ellipse, polyline, polygon';
const FALLBACK_LEN = 1000;
const DEFAULT_STAGGER_MS = 120;

type InkRoot = SVGElement;

const measure = (el: SVGGeometryElement): number => {
  try {
    const len = el.getTotalLength();
    return Number.isFinite(len) && len > 0 ? len : FALLBACK_LEN;
  } catch {
    return FALLBACK_LEN;
  }
};

const hasVisibleStroke = (el: SVGGeometryElement): boolean => {
  try {
    const stroke = getComputedStyle(el).stroke;
    return stroke !== 'none';
  } catch {
    return true;
  }
};

const collectStrokes = (root: InkRoot): SVGGeometryElement[] => {
  const shapes = root.matches(SHAPES)
    ? [root as unknown as SVGGeometryElement]
    : Array.from(root.querySelectorAll<SVGGeometryElement>(SHAPES));
  return shapes.filter(hasVisibleStroke);
};

const parseMs = (raw: string | null | undefined): number | undefined => {
  if (raw === null || raw === undefined || raw.trim() === '') return undefined;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : undefined;
};

const tokenStaggerMs = (): number => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--ink-stagger');
  return parseMs(raw) ?? DEFAULT_STAGGER_MS;
};

const strokeOrder = (stroke: SVGGeometryElement, root: InkRoot): number | undefined => {
  const holder = stroke.closest<SVGElement>('[data-ink-order]');
  if (!holder || (!root.contains(holder) && holder !== root)) return undefined;
  const n = Number.parseInt(holder.getAttribute('data-ink-order') ?? '', 10);
  return Number.isFinite(n) ? n : undefined;
};

export const supportsScrollDraw = (): boolean =>
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports('animation-timeline: view()');

const armEnter = (root: InkRoot, strokes: SVGGeometryElement[], defaultStep: number): void => {
  const baseDelay = parseMs(root.getAttribute('data-ink-delay')) ?? 0;
  const autoStagger = root.hasAttribute('data-ink-stagger');
  const step = parseMs(root.getAttribute('data-ink-stagger')) ?? defaultStep;
  strokes.forEach((stroke, i) => {
    const order = strokeOrder(stroke, root) ?? (autoStagger ? i : 0);
    stroke.style.setProperty('--ink-delay', `${baseDelay + order * step}ms`);
  });
};

const armScrub = (root: InkRoot, strokes: SVGGeometryElement[]): void => {
  const host = root instanceof SVGSVGElement ? root : (root.ownerSVGElement ?? root);
  host.classList.add('ink-view-host');
  strokes.forEach((stroke) => stroke.classList.add('ink-scrub'));
};

export const initInkDraw = (): void => {
  if (typeof document === 'undefined') return;
  const roots = document.querySelectorAll<InkRoot>('[data-ink]');
  if (roots.length === 0) return;

  // Reduced motion: leave everything fully drawn — no classes, no observers.
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if (reduce) return;

  const scrubOk = supportsScrollDraw();
  const hasIO = 'IntersectionObserver' in window;
  const defaultStep = tokenStaggerMs();
  const strokesByRoot = new WeakMap<Element, SVGGeometryElement[]>();

  const io = hasIO
    ? new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            strokesByRoot.get(entry.target)?.forEach((s) => s.classList.add('ink-play'));
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
      )
    : null;

  roots.forEach((root) => {
    const wantsScroll = root.getAttribute('data-ink') === 'scroll';
    const mode = wantsScroll && scrubOk ? 'scroll' : 'enter';
    // Without any animation path available, leave the strokes fully drawn.
    if (mode === 'enter' && !io) return;

    const strokes = collectStrokes(root);
    if (strokes.length === 0) return;

    strokes.forEach((stroke) => {
      stroke.style.setProperty('--ink-len', String(Math.ceil(measure(stroke))));
      stroke.classList.add('ink-stroke');
    });

    if (mode === 'scroll') {
      armScrub(root, strokes);
    } else {
      armEnter(root, strokes, defaultStep);
      strokesByRoot.set(root, strokes);
      io?.observe(root);
    }
  });
};
