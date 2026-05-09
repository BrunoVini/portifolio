/**
 * Diary of a Wimpy Kid easter eggs.
 *
 *  - Cheese Touch: hover the diary sticker → 30s yellow trail dots follow
 *    cursor; localStorage persists infection across reloads.
 *  - "zoowee" → 3-panel comic dialog with PLOOPY balloon.
 *  - "manny"  → round PLOOPY speech-balloon pops at random screen position.
 *  - "diary" word → click to strike out and write JOURNAL above (persists).
 *  - Loded Diper sticker: footer pin; click triggers visual screech.
 */
import { KeySequenceBuffer, prefersReducedMotion } from './eggs-utils';
import { initLodedDiper } from './loded-diper';

type Locale = 'en' | 'pt';

const CHEESE_KEY = 'portifolio:cheese-touched';
const CHEESE_DURATION = 30_000;
const JOURNAL_KEY = 'portifolio:journal-corrected';

const cheeseTooltip = (locale: Locale) =>
  locale === 'pt' ? 'TOQUE DO QUEIJO! Sem devolver.' : 'CHEESE TOUCH! No touch-backs.';

const initCheeseTouch = (locale: Locale) => {
  if (matchMedia('(hover: none)').matches) return;
  const sticker = document.querySelector<HTMLElement>('.diary-sticker');
  if (!sticker) return;

  let until = 0;
  try {
    until = Number(localStorage.getItem(CHEESE_KEY) ?? '0') || 0;
  } catch {
    /* noop */
  }

  const dots: HTMLElement[] = [];
  let active = false;

  const startInfection = () => {
    until = Date.now() + CHEESE_DURATION;
    try {
      localStorage.setItem(CHEESE_KEY, String(until));
    } catch {
      /* noop */
    }
    document.body.dataset.cheeseTouch = '1';
    if (!sessionStorage.getItem('cheese-shown')) {
      sessionStorage.setItem('cheese-shown', '1');
      const tip = document.createElement('div');
      tip.className = 'cheese-tooltip';
      tip.textContent = cheeseTooltip(locale);
      tip.style.top = '120px';
      tip.style.right = '20px';
      document.body.appendChild(tip);
      setTimeout(() => tip.remove(), 3000);
    }
  };

  if (until > Date.now()) document.body.dataset.cheeseTouch = '1';

  sticker.addEventListener('pointerenter', startInfection);

  document.addEventListener('mousemove', (e) => {
    if (Date.now() > until || prefersReducedMotion()) {
      if (Date.now() > until) document.body.removeAttribute('data-cheese-touch');
      return;
    }
    if (active) return;
    active = true;
    requestAnimationFrame(() => {
      active = false;
    });
    const dot = document.createElement('div');
    dot.className = 'cheese-trail';
    dot.style.left = `${e.clientX - 6}px`;
    dot.style.top = `${e.clientY - 6}px`;
    document.body.appendChild(dot);
    dots.push(dot);
    if (dots.length > 45) dots.shift()?.remove();
    requestAnimationFrame(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'scale(0.4)';
    });
    setTimeout(() => dot.remove(), 450);
  });
};

const initZoowee = (locale: Locale) => {
  const closeLabel = locale === 'pt' ? 'fechar' : 'close';
  const trigger = () => {
    if (document.querySelector('.zoowee-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'zoowee-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Comic strip — Zoo-Wee-Mama');
    overlay.innerHTML = `
      <button class="zoowee-close" type="button" aria-label="${closeLabel}">close ✕</button>
      <div class="zoowee-panel" style="--end-rot:-3deg">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--color-ink)" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="50" cy="38" r="14"/>
            <circle cx="46" cy="36" r="1.6" fill="var(--color-ink)"/>
            <circle cx="54" cy="36" r="1.6" fill="var(--color-ink)"/>
            <path d="M 44 44 Q 50 48, 56 44"/>
            <line x1="50" y1="52" x2="50" y2="78"/>
            <line x1="50" y1="60" x2="38" y2="68"/>
            <line x1="50" y1="60" x2="62" y2="68"/>
            <line x1="50" y1="78" x2="42" y2="92"/>
            <line x1="50" y1="78" x2="58" y2="92"/>
          </g>
          <text x="50" y="22" font-family="Caveat" font-size="14" font-weight="700" fill="var(--color-red-ink)" text-anchor="middle">hmm…</text>
        </svg>
      </div>
      <div class="zoowee-panel" style="--end-rot:2deg">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--color-red-ink)" stroke-width="2.4" fill="none" stroke-linecap="round">
            <path d="M 20 20 L 28 32 M 80 20 L 72 32 M 50 14 L 50 30 M 14 50 L 30 50 M 70 50 L 86 50"/>
          </g>
          <text x="50" y="62" font-family="Caveat" font-size="22" font-weight="700" fill="var(--color-ink)" text-anchor="middle">ZOO-WEE-</text>
          <text x="50" y="82" font-family="Caveat" font-size="22" font-weight="700" fill="var(--color-red-ink)" text-anchor="middle">MAMA!</text>
        </svg>
      </div>
      <div class="zoowee-panel" style="--end-rot:-1deg">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--color-ink)" stroke-width="2.4" fill="var(--color-paper)" stroke-linejoin="round">
            <path d="M 22 30 Q 22 18, 50 18 T 78 30 Q 78 50, 50 50 L 42 64 L 44 50 Q 22 50, 22 30 Z"/>
          </g>
          <text x="50" y="40" font-family="Caveat" font-size="22" font-weight="700" fill="var(--color-red-ink)" text-anchor="middle">PLOOPY!</text>
        </svg>
      </div>`;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('.zoowee-close')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Escape') close();
      },
      { once: true },
    );
  };
  new KeySequenceBuffer('zoowee', trigger).attach();
};

const initManny = () => {
  const trigger = () => {
    const balloon = document.createElement('div');
    balloon.className = 'manny-balloon';
    balloon.textContent = 'PLOOPY!';
    balloon.style.left = `${20 + Math.random() * 60}vw`;
    balloon.style.top = `${20 + Math.random() * 50}vh`;
    document.body.appendChild(balloon);
    setTimeout(() => balloon.remove(), 1900);
  };
  new KeySequenceBuffer('manny', trigger).attach();
};

const initJournalCorrection = (locale: Locale) => {
  let already = false;
  try {
    already = localStorage.getItem(JOURNAL_KEY) === '1';
  } catch {
    /* noop */
  }
  document.querySelectorAll<HTMLElement>('[data-journal]').forEach((el) => {
    el.style.cursor = 'pointer';
    el.style.position = 'relative';
    if (already) markCorrected(el, locale);
    el.addEventListener('click', (e) => {
      if (el.dataset.corrected) return;
      e.preventDefault();
      markCorrected(el, locale);
      try {
        localStorage.setItem(JOURNAL_KEY, '1');
      } catch {
        /* noop */
      }
    });
  });
};

const markCorrected = (el: HTMLElement, locale: Locale) => {
  el.dataset.corrected = '1';
  el.style.textDecoration = 'line-through var(--color-red-ink) 2px';
  const above = document.createElement('span');
  above.textContent = locale === 'pt' ? 'REGISTRO!' : 'JOURNAL!';
  Object.assign(above.style, {
    position: 'absolute',
    top: '-1.2em',
    left: '50%',
    transform: 'translateX(-50%) rotate(-4deg)',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: 'var(--color-red-ink)',
    fontSize: '0.9em',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  });
  el.appendChild(above);
};

export const initWimpyEggs = (locale: Locale = 'en'): void => {
  if (typeof document === 'undefined') return;
  initCheeseTouch(locale);
  initZoowee(locale);
  initManny();
  initJournalCorrection(locale);
  initLodedDiper();
};
