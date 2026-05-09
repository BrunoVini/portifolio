/**
 * Hidden interactions that reward curiosity.
 *
 *  1. Konami code  → diary sticker spins 720° and "VOL. 1" becomes "VOL. ∞"
 *  2. Hold "R" 2s  → rocket cursor barrel-roll + triple confetti burst
 *  3. Type "bruno" → ProfilePost likes spike to 1.21k briefly with confetti
 *  4. Click sticky note 7×  → fourth secret line appears
 *  5. Dbl-click PG.label → toggles "margin-secrets" body attribute
 *
 * v3 features (bug squash, Wimpy Kid set, Marvel set) live in sibling
 * files: bug-squash.ts, wimpy-eggs.ts, marvel-eggs.ts.
 */
import { spawnConfetti, KeyArraySequenceBuffer, KeySequenceBuffer } from './eggs-utils';
import { initBugSquash } from './bug-squash';
import { initWimpyEggs } from './wimpy-eggs';
import { initMarvelEggs } from './marvel-eggs';
import { initAchievements, unlock } from './achievements';

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
  unlock('konami');
};

const initKonami = () => new KeyArraySequenceBuffer(KONAMI, triggerKonami).attach();

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
      unlock('rocket-roll');
    }, 1800);
  });
  document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'r' && timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  });
};

const triggerBruno = () => {
  const likes = document.querySelector<HTMLElement>('.post-likes');
  if (!likes) return;
  const original = likes.textContent ?? '';
  likes.textContent = original.replace(/\d+/, '1.21k');
  likes.style.color = 'var(--color-red-ink)';
  const r = likes.getBoundingClientRect();
  spawnConfetti(r.left + r.width / 2, r.top);
  unlock('bruno-typed');
  setTimeout(() => {
    likes.textContent = original;
    likes.style.color = '';
  }, 1800);
};

const initBrunoTyping = () => new KeySequenceBuffer('bruno', triggerBruno).attach();

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
      unlock('sticky-7');
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
      unlock('margin-secrets');
    });
  });
};

const initMailtoConfetti = () => {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const r = a.getBoundingClientRect();
      spawnConfetti(r.left + r.width / 2, r.top + r.height / 2, 18);
      unlock('mailto-confetti');
      void e;
    });
  });
};

export const initEasterEggs = (locale: 'en' | 'pt' = 'en'): void => {
  if (typeof document === 'undefined') return;
  initAchievements();
  initKonami();
  initRocketRoll();
  initBrunoTyping();
  initStickyClicks();
  initStickyCycle();
  initMarginSecrets();
  initMailtoConfetti();
  initBugSquash(locale);
  initWimpyEggs(locale);
  initMarvelEggs(locale);
};
