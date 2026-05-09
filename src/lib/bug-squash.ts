/**
 * Bug squash saga.
 *
 *  - Click a `.bug-margin .bug` to squash it: scale down + DOM-replace
 *    SVG with a splat. Speech bubble flips to "OW!" / "ai!".
 *  - Counter persists in `localStorage["portifolio:bugs-squashed"]`.
 *  - 3 squashes → next squashed bug wears a Band-Aid overlay.
 *  - 6 squashes → next bug becomes a translucent red ghost; clicks bypass.
 *  - 10 squashes → "they unionized" sticker pinned bottom-right + a row of
 *    micro-bugs marching across the viewport bottom (linear 18s loop).
 *
 * a11y: the bug becomes role=button + tabindex=0 with a localized aria-label;
 * Enter/Space squash it. Speech bubble keeps `pointer-events: none` so it
 * never intercepts the click.
 */
import { prefersReducedMotion } from './eggs-utils';

const KEY = 'portifolio:bugs-squashed';
const SAGA_KEY = 'portifolio:bug-saga-stage';

type Locale = 'en' | 'pt';

type Strings = {
  ariaLabel: string;
  ow: string;
  unionized: string;
  dismiss: string;
};

const STRINGS: Record<Locale, Strings> = {
  en: {
    ariaLabel: 'Squash the bug',
    ow: 'OW!',
    unionized: 'they unionized.',
    dismiss: 'Dismiss',
  },
  pt: {
    ariaLabel: 'Esmagar o bug',
    ow: 'ai!',
    unionized: 'eles se sindicalizaram.',
    dismiss: 'Fechar',
  },
};

const SPLAT_SVG = `
<svg viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g fill="var(--color-red-ink)" stroke="var(--color-red-ink)" stroke-linejoin="round" stroke-linecap="round" stroke-width="0.6">
    <ellipse cx="16" cy="14" rx="8" ry="3.6" opacity="0.85"/>
    <path d="M 24 13 L 28 11 L 26 14 Z"/>
    <path d="M 8 13 L 4 11 L 6 14 Z"/>
    <path d="M 14 9 L 12 5 L 16 8 Z"/>
    <path d="M 18 9 L 20 5 L 16 8 Z"/>
    <path d="M 14 19 L 12 22 L 16 20 Z"/>
    <path d="M 18 19 L 20 22 L 16 20 Z"/>
  </g>
</svg>`;

const BANDAID_SVG = `
<svg class="bug-bandaid" viewBox="0 0 36 14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g stroke="var(--color-ink)" stroke-width="0.8" fill="var(--color-paper-edge)">
    <rect x="2" y="3" width="32" height="8" rx="3"/>
    <circle cx="18" cy="7" r="2.2" fill="var(--color-paper)"/>
    <circle cx="8" cy="6" r="0.6" fill="var(--color-ink)" stroke="none"/>
    <circle cx="8" cy="8" r="0.6" fill="var(--color-ink)" stroke="none"/>
    <circle cx="28" cy="6" r="0.6" fill="var(--color-ink)" stroke="none"/>
    <circle cx="28" cy="8" r="0.6" fill="var(--color-ink)" stroke="none"/>
  </g>
</svg>`;

const readCount = (): number => {
  try {
    return Number(localStorage.getItem(KEY) ?? '0') || 0;
  } catch {
    return 0;
  }
};

const writeCount = (n: number): void => {
  try {
    localStorage.setItem(KEY, String(n));
  } catch {
    /* noop */
  }
};

const spawnUnionized = (s: Strings) => {
  if (document.body.dataset.bugsUnionized) return;
  document.body.dataset.bugsUnionized = '1';
  const sticker = document.createElement('div');
  sticker.className = 'bugs-unionized';
  sticker.innerHTML = `<span class="bu-text">✊ ${s.unionized}</span>
    <button class="bu-close" type="button" aria-label="${s.dismiss}">×</button>`;
  document.body.appendChild(sticker);
  sticker.querySelector('.bu-close')?.addEventListener('click', () => sticker.remove());
  // Micro-bug parade
  const parade = document.createElement('div');
  parade.className = 'bug-parade';
  parade.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 5; i++) {
    const mini = document.createElement('span');
    mini.className = 'mini-bug';
    mini.style.animationDelay = `${i * 1.4}s`;
    parade.appendChild(mini);
  }
  document.body.appendChild(parade);
};

const squash = (wrap: HTMLElement, bubble: HTMLElement | null, s: Strings) => {
  if (wrap.dataset.squashed) return;
  wrap.dataset.squashed = '1';
  const bug = wrap.querySelector<HTMLElement>('.bug');
  if (!bug) return;
  const reduce = prefersReducedMotion();
  const finalize = () => {
    bug.outerHTML = SPLAT_SVG.replace('<svg', '<svg class="bug bug-splat"');
    if (bubble) {
      bubble.textContent = s.ow;
      bubble.classList.add('is-ow');
    }
    const count = readCount() + 1;
    writeCount(count);
    document.body.dataset.bugsSquashed = String(count);
    const stage = count >= 10 ? 'union' : count >= 6 ? 'ghost' : count >= 3 ? 'bandaid' : 'plain';
    try {
      localStorage.setItem(SAGA_KEY, stage);
    } catch {
      /* noop */
    }
    if (stage === 'bandaid' && !wrap.querySelector('.bug-bandaid')) {
      const ba = document.createElement('span');
      ba.innerHTML = BANDAID_SVG;
      ba.style.cssText =
        'position:absolute;left:2px;top:6px;width:30px;pointer-events:none;animation:bugBandaidIn 0.6s ease-out forwards;opacity:0;';
      wrap.appendChild(ba);
    }
    if (stage === 'union') spawnUnionized(s);
  };
  if (reduce) {
    finalize();
    return;
  }
  bug.animate(
    [{ transform: 'rotate(-6deg) scale(1, 1)' }, { transform: 'rotate(-6deg) scale(1.6, 0.3)' }],
    { duration: 220, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' },
  ).onfinish = finalize;
};

const applySagaStage = (wrap: HTMLElement) => {
  let stage: string;
  try {
    stage = localStorage.getItem(SAGA_KEY) ?? 'plain';
  } catch {
    stage = 'plain';
  }
  if (stage === 'ghost') wrap.dataset.bugGhost = '1';
};

export const initBugSquash = (locale: Locale = 'en'): void => {
  if (typeof document === 'undefined') return;
  const s = STRINGS[locale] ?? STRINGS.en;
  document.body.dataset.bugsSquashed = String(readCount());
  document.querySelectorAll<HTMLElement>('.bug-margin').forEach((wrap) => {
    applySagaStage(wrap);
    const bug = wrap.querySelector<HTMLElement>('.bug');
    const bubble = wrap.querySelector<HTMLElement>('.bug-line');
    if (!bug) return;
    bug.setAttribute('role', 'button');
    bug.setAttribute('tabindex', '0');
    bug.setAttribute('aria-label', s.ariaLabel);
    bug.setAttribute('data-no-key-egg', 'true');
    bug.style.cursor = 'pointer';
    wrap.removeAttribute('aria-hidden');
    const handler = (e: Event) => {
      if (wrap.dataset.bugGhost) return; // unsquashable
      e.stopPropagation();
      squash(wrap, bubble, s);
    };
    bug.addEventListener('click', handler);
    bug.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler(e);
      }
    });
  });
  if (readCount() >= 10) spawnUnionized(s);
};
