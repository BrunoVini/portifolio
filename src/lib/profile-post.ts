/**
 * ProfilePost interactivity — heart toggle (with outline↔filled SVG swap via
 * aria-pressed), save toggle, 3-dot menu popup, and a 2-image carousel
 * (profile.png ↔ miranha.png). Double-tap the image still spawns floating
 * hearts. Respects prefers-reduced-motion (skips bursts and slide transition).
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

const initLike = (post: HTMLElement, reduce: boolean) => {
  const likeBtn = post.querySelector<HTMLButtonElement>('.post-action.like');
  const likesEl = post.querySelector<HTMLElement>('.post-likes');
  const img = post.querySelector<HTMLElement>('.post-img');
  if (!likeBtn || !likesEl || !img) return null;
  let liked = likeBtn.getAttribute('aria-pressed') === 'true';
  const baseLikes = parseInt(likesEl.textContent?.match(/\d+/)?.[0] ?? '128', 10);
  const tpl = likesEl.textContent ?? '';
  const setLikes = (n: number) => {
    likesEl.textContent = tpl.replace(/\d+/, String(n));
  };
  const toggle = (silent = false) => {
    liked = !liked;
    likeBtn.setAttribute('aria-pressed', String(liked));
    setLikes(liked ? baseLikes + 1 : baseLikes - (baseLikes > 128 ? 1 : 0));
    if (!reduce && !silent) {
      likeBtn.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.4) rotate(-8deg)' },
          { transform: 'scale(1.18) rotate(-6deg)' },
          { transform: 'scale(1)' },
        ],
        { duration: 420, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      );
    }
  };
  likeBtn.addEventListener('click', () => toggle());
  return { likeBtn, img, toggle, isLiked: () => liked };
};

const initDoubleTap = (img: HTMLElement, reduce: boolean, toggleIfNotLiked: () => void) => {
  let lastTap = 0;
  img.addEventListener('click', (e) => {
    const now = performance.now();
    if (now - lastTap < 380) {
      toggleIfNotLiked();
      if (reduce) return;
      const rect = img.getBoundingClientRect();
      const cx = (e.clientX || rect.left + rect.width / 2) - rect.left;
      const cy = (e.clientY || rect.top + rect.height / 2) - rect.top;
      img.style.position = img.style.position || 'relative';
      for (let i = 0; i < HEART_BURST_COUNT; i++) {
        setTimeout(() => spawnFloatingHeart(cx, cy, img), i * 60);
      }
    }
    lastTap = now;
  });
};

const initSave = (post: HTMLElement) => {
  const save = post.querySelector<HTMLButtonElement>('.post-action.save');
  if (!save) return;
  save.addEventListener('click', () => {
    const next = save.getAttribute('aria-pressed') !== 'true';
    save.setAttribute('aria-pressed', String(next));
  });
};

const spawnMenuEgg = async (post: HTMLElement, lang: 'en' | 'pt') => {
  if (post.querySelector('.menu-egg')) return;
  const text =
    lang === 'pt'
      ? 'tudo removido. agora vai querer um café?'
      : 'all gone. fancy a coffee instead?';
  const egg = document.createElement('div');
  egg.className = 'menu-egg';
  egg.innerHTML = `<span aria-hidden="true">🤷</span><span>${text}</span>`;
  post.appendChild(egg);
  setTimeout(() => egg.remove(), 3200);
  const { unlock } = await import('./achievements');
  unlock('menu-emptied');
};

const initMenu = (post: HTMLElement) => {
  const btn = post.querySelector<HTMLButtonElement>('.post-menu');
  const pop = post.querySelector<HTMLElement>('.post-menu-pop');
  if (!btn || !pop) return;
  const lang: 'en' | 'pt' = document.documentElement.lang === 'pt' ? 'pt' : 'en';
  const setOpen = (open: boolean) => {
    pop.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (pop.children.length === 0) {
      spawnMenuEgg(post, lang);
      return;
    }
    setOpen(pop.hidden);
  });
  document.addEventListener('click', (e) => {
    if (pop.hidden) return;
    if (!(e.target as HTMLElement).closest('.post-menu-pop, .post-menu')) setOpen(false);
  });
  pop.querySelectorAll('li').forEach((li) => {
    li.addEventListener('click', () => {
      const h = li.getBoundingClientRect().height;
      li.animate(
        [
          {
            opacity: 1,
            transform: 'translateX(0) scale(1)',
            height: `${h}px`,
            marginTop: '0px',
            marginBottom: '0px',
            paddingTop: '6px',
            paddingBottom: '6px',
          },
          {
            opacity: 0,
            transform: 'translateX(40px) scale(0.92)',
            height: '0px',
            marginTop: '0px',
            marginBottom: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
          },
        ],
        { duration: 320, easing: 'cubic-bezier(0.4, 0, 0.6, 1)', fill: 'forwards' },
      ).onfinish = () => {
        li.remove();
        if (pop.children.length === 0) setOpen(false);
      };
    });
  });
};

const initCarousel = (post: HTMLElement, reduce: boolean) => {
  const wrap = post.querySelector<HTMLElement>('.post-img');
  if (!wrap) return;
  const slides = wrap.querySelectorAll('img');
  const last = slides.length - 1;
  if (last < 1) return;
  if (reduce) wrap.classList.add('no-anim');
  let idx = 0;
  const setIdx = (n: number) => {
    idx = Math.max(0, Math.min(last, n));
    wrap.dataset.slide = String(idx);
  };
  wrap.querySelector<HTMLButtonElement>('.slide-prev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    setIdx(idx - 1);
  });
  wrap.querySelector<HTMLButtonElement>('.slide-next')?.addEventListener('click', (e) => {
    e.stopPropagation();
    setIdx(idx + 1);
  });
};

export const initProfilePost = (): void => {
  if (typeof document === 'undefined') return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const post = document.querySelector<HTMLElement>('.post');
  if (!post) return;
  const like = initLike(post, reduce);
  if (like) initDoubleTap(like.img, reduce, () => !like.isLiked() && like.toggle(true));
  initSave(post);
  initMenu(post);
  initCarousel(post, reduce);
};
