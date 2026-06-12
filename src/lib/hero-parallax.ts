/**
 * Hero micro-parallax — the collage pieces (vitruvian sketch, polaroid,
 * diary sticker, gear, sticky note) drift a few pixels against the pointer,
 * giving the opening spread physical depth without ever moving content.
 *
 * - Stage: `[data-hero-parallax]`; layers: anything inside with `data-depth`
 *   (0–3; deeper numbers sit "closer" and move more).
 * - Max shift is ±8px at the deepest layer — restrained, never under copy.
 * - Uses the standalone `translate` property so it composes with each
 *   piece's own `transform` (rotations, jiggle keyframes) untouched.
 * - Disabled entirely for prefers-reduced-motion and coarse pointers.
 */

const MAX_SHIFT_PX = 8;

export const initHeroParallax = (): void => {
  if (typeof document === 'undefined') return;
  const stage = document.querySelector<HTMLElement>('[data-hero-parallax]');
  if (!stage) return;

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const fine = window.matchMedia?.('(pointer: fine)').matches ?? false;
  if (reduce || !fine) return;

  const layers = Array.from(stage.querySelectorAll<HTMLElement>('[data-depth]'));
  if (layers.length === 0) return;

  const depths = layers.map((l) => {
    const d = Number.parseFloat(l.dataset.depth ?? '1');
    return Number.isFinite(d) ? d : 1;
  });
  const maxDepth = Math.max(...depths, 1);

  let nx = 0;
  let ny = 0;
  let queued = false;

  const apply = (): void => {
    queued = false;
    layers.forEach((layer, i) => {
      const k = (depths[i] / maxDepth) * MAX_SHIFT_PX;
      layer.style.translate = `${(nx * k).toFixed(1)}px ${(ny * k).toFixed(1)}px`;
    });
  };
  const queue = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  };

  stage.addEventListener(
    'pointermove',
    (e) => {
      const r = stage.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      queue();
    },
    { passive: true },
  );
  stage.addEventListener('pointerleave', () => {
    nx = 0;
    ny = 0;
    queue();
  });
};
