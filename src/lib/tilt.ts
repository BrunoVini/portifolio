/**
 * Subtle 3D tilt that follows the pointer for [data-tilt] elements.
 * Disabled on touch devices (no fine pointer) and when reduced motion is preferred.
 */

const MAX_DEG = 8;

export const tiltAngles = (
  pointerX: number,
  pointerY: number,
  rect: { left: number; top: number; width: number; height: number },
): { rx: number; ry: number } => {
  const dx = (pointerX - (rect.left + rect.width / 2)) / (rect.width / 2);
  const dy = (pointerY - (rect.top + rect.height / 2)) / (rect.height / 2);
  const ry = Math.max(-1, Math.min(1, dx)) * MAX_DEG;
  const rx = Math.max(-1, Math.min(1, -dy)) * MAX_DEG;
  return { rx, ry };
};

export const initTilt = (selector = '[data-tilt]'): void => {
  if (typeof document === 'undefined') return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const fine = window.matchMedia?.('(pointer: fine)').matches ?? false;
  if (reduce || !fine) return;

  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';
    const parent = el.parentElement;
    if (parent) parent.style.perspective = parent.style.perspective || '900px';

    const layers = Array.from(el.querySelectorAll<HTMLElement>('.tilt-layer'));
    const baseLayerTransforms = new WeakMap<HTMLElement, string>();
    layers.forEach((l) => {
      const t = getComputedStyle(l).transform;
      baseLayerTransforms.set(l, t === 'none' ? '' : t);
    });

    let baseTransform = '';

    el.addEventListener('pointerenter', () => {
      baseTransform = getComputedStyle(el).transform;
      if (baseTransform === 'none') baseTransform = '';
    });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const { rx, ry } = tiltAngles(e.clientX, e.clientY, r);
      el.style.transform = `${baseTransform} rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      layers.forEach((l) => {
        const depth = Number(l.dataset.depth ?? '1');
        const tx = ry * 0.6 * depth;
        const ty = rx * 0.4 * depth;
        const tz = 12 * depth;
        const base = baseLayerTransforms.get(l) ?? '';
        l.style.transform = `${base} translate3d(${tx}px, ${ty}px, ${tz}px)`;
      });
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
      layers.forEach((l) => {
        l.style.transform = baseLayerTransforms.get(l) ?? '';
      });
    });
  });
};
