/**
 * Marvel easter eggs.
 *
 *  - "avengers" → all doodles converge briefly toward viewport center.
 *  - "snap"     → half the SFX badges fade + dust away (return on reload).
 *  - "excelsior"→ Stan Lee silhouette slides in with catchphrase.
 *  - "spidey"   → 10s window: every click spawns a "thwip" + crosshair cursor.
 *  - Long-press the diary sticker 3 times: 1st/2nd → "you are not worthy",
 *    3rd → "worthy" lift with white glow (Mjölnir).
 */
import { KeySequenceBuffer, prefersReducedMotion } from './eggs-utils';

type Locale = 'en' | 'pt';

const MJOLNIR_KEY = 'portifolio:mjolnir-attempts';
const MJOLNIR_TS_KEY = 'portifolio:mjolnir-ts';
const MJOLNIR_TTL = 86_400_000;

const getDoodleNodes = (): HTMLElement[] =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      '.bug-margin, .doodle, .diary-sticker, .sticky, [class*="sfx-"], ' +
        '.polaroid, .coffee, .gear-wrap, .scroll-hint, .ribbon, .vitruvian, ' +
        '.tape, .signature, .featured-stamp',
    ),
  );

let avengersBusy = false;
const initAvengers = () => {
  const trigger = () => {
    if (avengersBusy) return;
    avengersBusy = true;
    setTimeout(() => {
      avengersBusy = false;
    }, 2500);
    const reduce = prefersReducedMotion();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    getDoodleNodes().forEach((el) => {
      const r = el.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2);
      const dy = cy - (r.top + r.height / 2);
      if (reduce) {
        el.animate([{ opacity: 1 }, { opacity: 0.6 }, { opacity: 1 }], { duration: 800 });
        return;
      }
      el.animate(
        [
          { transform: 'translate(0, 0)' },
          { transform: `translate(${dx * 0.4}px, ${dy * 0.4}px)`, offset: 0.5 },
          { transform: 'translate(0, 0)' },
        ],
        { duration: 1600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      );
    });
  };
  new KeySequenceBuffer('avengers', trigger).attach();
};

const initSnap = () => {
  const trigger = () => {
    const reduce = prefersReducedMotion();
    const targets = getDoodleNodes().filter((_, i) => i % 2 === 0);
    targets.forEach((el, i) => {
      if (reduce) {
        el.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 1400 });
        return;
      }
      el.animate(
        [
          { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
          {
            opacity: 0,
            transform: 'translateY(30px) scale(0.92)',
            filter: 'blur(2px)',
            offset: 0.6,
          },
          { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
        ],
        { duration: 2000, delay: i * 60, easing: 'ease-in-out' },
      );
    });
  };
  new KeySequenceBuffer('snap', trigger).attach();
};

const initExcelsior = () => {
  const trigger = () => {
    if (document.querySelector('.stan-lee')) return;
    const sl = document.createElement('div');
    sl.className = 'stan-lee';
    sl.setAttribute('aria-live', 'polite');
    sl.innerHTML = `
      <span class="sl-bubble">Excelsior!</span>
      <svg viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g stroke="var(--color-ink)" stroke-width="1.8" stroke-linejoin="round" fill="var(--color-ink)">
          <ellipse cx="32" cy="22" rx="14" ry="16" fill="var(--color-paper)"/>
          <rect x="18" y="19" width="11" height="7" rx="1.5" fill="var(--color-ink)" opacity="0.85"/>
          <rect x="35" y="19" width="11" height="7" rx="1.5" fill="var(--color-ink)" opacity="0.85"/>
          <line x1="29" y1="22" x2="35" y2="22" stroke-width="1.4"/>
          <path d="M 22 31 Q 26 35, 32 33 Q 38 35, 42 31 Q 38 29, 32 31 Q 26 29, 22 31 Z" fill="var(--color-paper)" stroke-width="1.2"/>
          <path d="M 18 26 Q 16 32, 19 36" fill="none" stroke-width="1.4"/>
          <path d="M 46 26 Q 48 32, 45 36" fill="none" stroke-width="1.4"/>
          <rect x="18" y="38" width="28" height="32" fill="var(--color-ink)" rx="2"/>
          <line x1="32" y1="40" x2="32" y2="68" stroke="var(--color-paper)" stroke-width="1"/>
        </g>
      </svg>`;
    document.body.appendChild(sl);
    setTimeout(() => sl.remove(), 2600);
  };
  new KeySequenceBuffer('excelsior', trigger).attach();
};

const initSpidey = () => {
  const enable = () => {
    document.body.dataset.spidey = '1';
    setTimeout(() => delete document.body.dataset.spidey, 10_000);
  };
  document.addEventListener('click', (e) => {
    if (!document.body.dataset.spidey) return;
    const t = e.target as HTMLElement;
    if (t.closest('a, button, [role="button"]')) return;
    const thwip = document.createElement('div');
    thwip.className = 'spidey-thwip';
    thwip.style.left = `${e.clientX - 30}px`;
    thwip.style.top = `${e.clientY - 30}px`;
    thwip.innerHTML = `<svg viewBox="0 0 60 60"><g stroke="var(--color-ink)" stroke-width="1.6" fill="none" stroke-linecap="round">
      <line x1="30" y1="30" x2="6" y2="6"/><line x1="30" y1="30" x2="54" y2="6"/>
      <line x1="30" y1="30" x2="6" y2="54"/><line x1="30" y1="30" x2="54" y2="54"/>
      <line x1="30" y1="30" x2="30" y2="2"/><line x1="30" y1="30" x2="2" y2="30"/>
      <line x1="30" y1="30" x2="58" y2="30"/><line x1="30" y1="30" x2="30" y2="58"/>
    </g></svg>`;
    document.body.appendChild(thwip);
    setTimeout(() => thwip.remove(), 500);
  });
  new KeySequenceBuffer('spidey', enable).attach();
};

const initMjolnir = (locale: Locale) => {
  const sticker = document.querySelector<HTMLElement>('.diary-sticker');
  if (!sticker) return;
  let attempts = 0;
  try {
    const ts = Number(localStorage.getItem(MJOLNIR_TS_KEY) ?? '0');
    if (Date.now() - ts < MJOLNIR_TTL) {
      attempts = Number(localStorage.getItem(MJOLNIR_KEY) ?? '0') || 0;
    }
  } catch {
    /* noop */
  }
  let timer: number | undefined;
  const tip = (text: string) => {
    const el = document.createElement('div');
    el.className = 'cheese-tooltip';
    el.style.background = 'var(--color-paper)';
    el.style.color = 'var(--color-ink)';
    el.textContent = text;
    const r = sticker.getBoundingClientRect();
    el.style.top = `${r.bottom + 12}px`;
    el.style.left = `${r.left}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  };
  sticker.addEventListener('pointerdown', () => {
    timer = window.setTimeout(() => {
      attempts = Math.min(attempts + 1, 3);
      try {
        localStorage.setItem(MJOLNIR_KEY, String(attempts));
        localStorage.setItem(MJOLNIR_TS_KEY, String(Date.now()));
      } catch {
        /* noop */
      }
      if (attempts < 3) {
        sticker.animate(
          [
            { transform: 'rotate(-7deg)' },
            { transform: 'rotate(-12deg)' },
            { transform: 'rotate(-2deg)' },
            { transform: 'rotate(-7deg)' },
          ],
          { duration: 380 },
        );
        tip(locale === 'pt' ? 'Você não é digno.' : 'You are not worthy.');
      } else {
        sticker.animate(
          [
            {
              transform: 'rotate(-7deg) translateY(0)',
              boxShadow: '4px 4px 0 var(--color-red-ink)',
            },
            {
              transform: 'rotate(-2deg) translateY(-20px)',
              boxShadow: '0 0 24px var(--color-highlight-strong)',
            },
            {
              transform: 'rotate(-7deg) translateY(0)',
              boxShadow: '4px 4px 0 var(--color-red-ink)',
            },
          ],
          { duration: 1200, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
        );
        tip(locale === 'pt' ? 'Digno.' : 'Worthy.');
      }
    }, 800);
  });
  const cancel = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };
  sticker.addEventListener('pointerup', cancel);
  sticker.addEventListener('pointerleave', cancel);
};

export const initMarvelEggs = (locale: Locale = 'en'): void => {
  if (typeof document === 'undefined') return;
  initAvengers();
  initSnap();
  initExcelsior();
  initSpidey();
  initMjolnir(locale);
};
