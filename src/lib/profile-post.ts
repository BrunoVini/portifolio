/**
 * ProfilePost interactivity — toggle heart with bump animation, double-tap on
 * the image to spawn floating hearts, and increment the visible like count.
 * Respects prefers-reduced-motion (skips bursts).
 */
const HEART_BURST_COUNT = 5;

const spawnFloatingHeart = (x: number, y: number, root: HTMLElement) => {
  const h = document.createElement('span');
  h.textContent = '♥';
  Object.assign(h.style, {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    fontSize: `${18 + Math.random() * 12}px`,
    color: 'var(--color-red-ink)',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    opacity: '1',
    zIndex: '20',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
  });
  root.appendChild(h);
  const dx = (Math.random() - 0.5) * 60;
  const dy = -60 - Math.random() * 40;
  h.animate(
    [
      { transform: 'translate(-50%, -50%) scale(0.4)', opacity: 0 },
      { transform: `translate(-50%, -50%) scale(1.2)`, opacity: 1, offset: 0.2 },
      {
        transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.8)`,
        opacity: 0,
      },
    ],
    { duration: 800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  ).onfinish = () => h.remove();
};

export const initProfilePost = (): void => {
  if (typeof document === 'undefined') return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const post = document.querySelector<HTMLElement>('.post');
  if (!post) return;

  const likeBtn = post.querySelector<HTMLButtonElement>('.post-action.like');
  const likesEl = post.querySelector<HTMLElement>('.post-likes');
  const img = post.querySelector<HTMLElement>('.post-img');
  if (!likeBtn || !likesEl || !img) return;

  let liked = false;
  const baseLikes = parseInt(likesEl.textContent?.match(/\d+/)?.[0] ?? '128', 10);
  const labelTemplate = likesEl.textContent ?? '';

  const setLikes = (n: number) => {
    likesEl.textContent = labelTemplate.replace(/\d+/, String(n));
  };

  const toggle = (silent = false) => {
    liked = !liked;
    likeBtn.setAttribute('aria-pressed', String(liked));
    likeBtn.classList.toggle('liked', liked);
    setLikes(liked ? baseLikes + 1 : baseLikes);
    if (!reduce && !silent) {
      likeBtn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.4) rotate(-8deg)' },
          { transform: 'scale(1.18) rotate(-6deg)' },
        ],
        { duration: 360, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      );
    }
  };

  likeBtn.addEventListener('click', () => toggle());

  let lastTap = 0;
  const handleTap = (e: MouseEvent | TouchEvent) => {
    const now = performance.now();
    if (now - lastTap < 380) {
      if (!liked) toggle(true);
      if (reduce) return;
      const rect = img.getBoundingClientRect();
      const ev = e as MouseEvent;
      const cx = (ev.clientX || rect.left + rect.width / 2) - rect.left;
      const cy = (ev.clientY || rect.top + rect.height / 2) - rect.top;
      img.style.position = img.style.position || 'relative';
      for (let i = 0; i < HEART_BURST_COUNT; i++) {
        setTimeout(() => spawnFloatingHeart(cx, cy, img), i * 60);
      }
    }
    lastTap = now;
  };

  img.addEventListener('click', handleTap);
};
