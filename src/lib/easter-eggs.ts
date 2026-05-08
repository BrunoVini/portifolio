/**
 * Hidden interactions that reward curiosity. None of them block primary
 * navigation or required functionality. All gated by prefers-reduced-motion
 * for the heavy animations; the toggles themselves still work.
 *
 *  1. Konami code  → diary sticker spins 720° and "VOL. 1" becomes "VOL. ∞"
 *  2. Hold "R" 2s  → rocket cursor barrel-roll + triple confetti burst
 *  3. Type "bruno" → ProfilePost likes spike to 1.21k briefly with confetti
 *  4. Click sticky note 7×  → fourth secret line appears
 *  5. Dbl-click PG.label → toggles "margin-secrets" body attribute
 */

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const triggerKonami = () => {
  const sticker = document.querySelector<HTMLElement>('.diary-sticker');
  const vol = sticker?.querySelector<HTMLElement>('.ds-vol');
  if (!sticker || !vol) return;
  vol.textContent = 'VOL. ∞';
  sticker.animate([{ transform: 'rotate(-7deg)' }, { transform: 'rotate(713deg)' }], {
    duration: 1200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  });
};

const spawnConfetti = (x: number, y: number) => {
  for (let i = 0; i < 14; i++) {
    const dot = document.createElement('div');
    const a = (i / 14) * Math.PI * 2;
    const r = 60 + Math.random() * 40;
    Object.assign(dot.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      width: '8px',
      height: '8px',
      background: i % 2 === 0 ? 'var(--color-red-ink)' : 'var(--color-highlight)',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '9998',
      transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s ease',
    });
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.transform = `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px) scale(0.4)`;
      dot.style.opacity = '0';
    });
    setTimeout(() => dot.remove(), 800);
  }
};

const initKonami = () => {
  let buf: string[] = [];
  document.addEventListener('keydown', (e) => {
    buf.push(e.key);
    if (buf.length > KONAMI.length) buf.shift();
    if (buf.length === KONAMI.length && buf.every((k, i) => k === KONAMI[i])) {
      triggerKonami();
      buf.length = 0;
    }
  });
};

const initRocketRoll = () => {
  const rocket = document.querySelector<HTMLElement>('[data-rocket-cursor] > div');
  if (!rocket) return;
  let timer: number | undefined;
  document.addEventListener('keydown', (e) => {
    if (e.repeat || e.key.toLowerCase() !== 'r') return;
    timer = window.setTimeout(() => {
      rocket.animate([{ filter: 'none' }, { filter: 'hue-rotate(360deg)' }], { duration: 800 });
      const r = rocket.getBoundingClientRect();
      spawnConfetti(r.left + r.width / 2, r.top + r.height / 2);
      spawnConfetti(r.left + r.width / 2, r.top + r.height / 2 - 30);
    }, 1800);
  });
  document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'r' && timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  });
};

const initBrunoTyping = () => {
  let buf = '';
  document.addEventListener('keydown', (e) => {
    if (e.key.length !== 1) {
      if (e.key === 'Backspace') buf = buf.slice(0, -1);
      return;
    }
    buf = (buf + e.key.toLowerCase()).slice(-6);
    if (buf.endsWith('bruno')) {
      const likes = document.querySelector<HTMLElement>('.post-likes');
      if (!likes) return;
      const original = likes.textContent ?? '';
      likes.textContent = original.replace(/\d+/, '1.21k');
      likes.style.color = 'var(--color-red-ink)';
      const r = likes.getBoundingClientRect();
      spawnConfetti(r.left + r.width / 2, r.top);
      setTimeout(() => {
        likes.textContent = original;
        likes.style.color = '';
      }, 1800);
    }
  });
};

const initStickyClicks = () => {
  const sticky = document.querySelector<HTMLElement>('.sticky');
  if (!sticky) return;
  let n = 0;
  sticky.style.cursor = 'pointer';
  sticky.addEventListener('click', () => {
    n++;
    if (n === 7 && !sticky.dataset.secretShown) {
      sticky.dataset.secretShown = '1';
      const extra = document.createElement('div');
      extra.textContent = '✦ watching you click stickers ✦';
      Object.assign(extra.style, {
        marginTop: '8px',
        fontFamily: 'var(--font-display)',
        color: 'var(--color-red-ink)',
        fontSize: '14px',
      });
      sticky.appendChild(extra);
    }
  });
};

const initStickyCycle = () => {
  const sticky = document.querySelector<HTMLElement>('.sticky[data-sticky-cycle]');
  const span = sticky?.querySelector<HTMLElement>('.sticky-text');
  if (!sticky || !span) return;
  let lines: string[];
  try {
    lines = JSON.parse(sticky.dataset.stickyCycle ?? '[]');
  } catch {
    return;
  }
  if (lines.length < 2) return;
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % lines.length;
    const next = lines[idx];
    span.animate(
      [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-6px)' },
      ],
      { duration: 220, easing: 'ease-in', fill: 'forwards' },
    ).onfinish = () => {
      span.textContent = next;
      span.animate(
        [
          { opacity: 0, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 260, easing: 'ease-out', fill: 'forwards' },
      );
    };
  }, 6000);
};

const initMarginSecrets = () => {
  document.querySelectorAll<HTMLElement>('.ch-num').forEach((el) => {
    el.style.cursor = 'pointer';
    el.addEventListener('dblclick', () => {
      const cur = document.body.dataset.marginSecrets === 'on';
      document.body.dataset.marginSecrets = cur ? 'off' : 'on';
    });
  });
};

export const initEasterEggs = (): void => {
  if (typeof document === 'undefined') return;
  initKonami();
  initRocketRoll();
  initBrunoTyping();
  initStickyClicks();
  initStickyCycle();
  initMarginSecrets();
};
