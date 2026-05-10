/**
 * Rocket cursor — replaces the native pointer with a tiny rocket SVG that
 * follows the mouse with subtle lag, leaving a fading red trail and
 * sparking on click. The native cursor is hidden via the `.rocket-on` class
 * added to <html>; form inputs restore their natural cursor in CSS.
 *
 * Disabled on coarse pointers (touch) and when prefers-reduced-motion is set
 * — in those cases the native cursor stays untouched.
 */

const ROCKET_SVG = `
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g stroke="#1a1a1a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 16 4 Q 22 10, 22 18 L 22 24 L 10 24 L 10 18 Q 10 10, 16 4 Z" fill="#faf7ee"/>
    <circle cx="16" cy="14" r="2.4" fill="#d63333" stroke="#d63333"/>
    <path d="M 10 22 L 5 26 L 8 30 L 10 24 Z" fill="#d63333" stroke="#d63333"/>
    <path d="M 22 22 L 27 26 L 24 30 L 22 24 Z" fill="#d63333" stroke="#d63333"/>
  </g>
</svg>
`;

const TRAIL_COLOR = '#d63333';
const ROCKET_SIZE = 28;
const TARGET_SELECTOR =
  'a, button, [role="button"], .badge, .proj, .panel, .post-action, .sk-close, .exp-toggle';

const angleFor = (vx: number, vy: number, prev: number): number => {
  if (Math.hypot(vx, vy) < 0.6) return prev;
  return (Math.atan2(vy, vx) * 180) / Math.PI + 90;
};

export const initRocketCursor = (): void => {
  if (typeof document === 'undefined') return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const fine = window.matchMedia?.('(pointer: fine)').matches ?? false;
  if (reduce || !fine) return;
  if (document.querySelector('[data-rocket-cursor]')) return;

  document.documentElement.classList.add('rocket-on');

  const layer = document.createElement('div');
  layer.dataset.rocketCursor = '';
  Object.assign(layer.style, {
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '9999',
  });
  document.body.appendChild(layer);

  const rocket = document.createElement('div');
  rocket.innerHTML = ROCKET_SVG;
  Object.assign(rocket.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    width: `${ROCKET_SIZE}px`,
    height: `${ROCKET_SIZE}px`,
    transform: 'translate(-9999px, -9999px)',
    transformOrigin: '50% 50%',
    transition: 'opacity 0.15s ease',
    opacity: '0',
    willChange: 'transform',
  });
  layer.appendChild(rocket);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let lastX = mouseX;
  let lastY = mouseY;
  let prevAngle = 0;
  let visible = false;
  let lastTrailAt = 0;
  let locked = false;

  const setLocked = (on: boolean) => {
    if (on === locked) return;
    locked = on;
  };

  const onMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      lastX = mouseX;
      lastY = mouseY;
      visible = true;
      rocket.style.opacity = '1';
    }
    const target = (e.target as Element | null)?.closest?.(TARGET_SELECTOR);
    setLocked(!!target);
  };
  const onLeave = () => {
    visible = false;
    rocket.style.opacity = '0';
  };
  const onClick = (e: MouseEvent) => spawnBurst(e.clientX, e.clientY);
  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('click', onClick);

  const spawnTrail = (x: number, y: number) => {
    const dot = document.createElement('div');
    Object.assign(dot.style, {
      position: 'absolute',
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      background: TRAIL_COLOR,
      transform: `translate(${x - 2.5}px, ${y - 2.5}px)`,
      opacity: '0.55',
      pointerEvents: 'none',
      transition: 'opacity 0.55s ease, transform 0.55s ease',
    });
    layer.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.opacity = '0';
      dot.style.transform = `translate(${x - 2.5}px, ${y + 12}px) scale(0.4)`;
    });
    setTimeout(() => dot.remove(), 650);
  };

  const spawnBurst = (x: number, y: number) => {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const dx = Math.cos(a) * 18;
      const dy = Math.sin(a) * 18;
      const dot = document.createElement('div');
      Object.assign(dot.style, {
        position: 'absolute',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: i % 2 === 0 ? TRAIL_COLOR : '#ffe066',
        transform: `translate(${x - 3}px, ${y - 3}px)`,
        opacity: '0.95',
        pointerEvents: 'none',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
      });
      layer.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.opacity = '0';
        dot.style.transform = `translate(${x - 3 + dx}px, ${y - 3 + dy}px) scale(0.3)`;
      });
      setTimeout(() => dot.remove(), 500);
    }
  };

  const tick = () => {
    const vx = mouseX - lastX;
    const vy = mouseY - lastY;
    prevAngle = angleFor(vx, vy, prevAngle);
    const scale = locked ? 1.15 : 1;
    rocket.style.transform = `translate(${mouseX - ROCKET_SIZE / 2}px, ${mouseY - ROCKET_SIZE / 2}px) rotate(${prevAngle}deg) scale(${scale})`;
    lastX = mouseX;
    lastY = mouseY;

    const speed = Math.hypot(vx, vy);
    const now = performance.now();
    if (visible && speed > 1.2 && now - lastTrailAt > 55) {
      spawnTrail(mouseX, mouseY + 10);
      lastTrailAt = now;
    }
    requestAnimationFrame(tick);
  };
  tick();
};
