/**
 * Mjölnir long-press easter egg. Long-press the diary sticker; on the 3rd
 * separate attempt the sticker lifts with a highlight glow. Persists in
 * localStorage with a 24h TTL so repeat visitors get the build-up again.
 */
import { unlock } from './achievements';

const MJOLNIR_KEY = 'portifolio:mjolnir-attempts';
const MJOLNIR_TS_KEY = 'portifolio:mjolnir-ts';
const MJOLNIR_TTL = 86_400_000;

type Locale = 'en' | 'pt';

export const initMjolnir = (locale: Locale): void => {
  if (typeof document === 'undefined') return;
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
        unlock('mjolnir-worthy');
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
