import details from '../data/skill-details.json';
import type { Locale } from './types';

type SkillDetail = {
  title: string;
  since: string;
  en: { intro: string; highlights: string[] };
  pt: { intro: string; highlights: string[] };
};

const data = details as Record<string, SkillDetail>;

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

export const initSkillModal = (locale: Locale): void => {
  if (typeof document === 'undefined') return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const overlay = document.createElement('div');
  overlay.className = 'sk-overlay';
  overlay.innerHTML = `
    <div class="sk-modal" role="dialog" aria-modal="true" aria-labelledby="sk-title">
      <button class="sk-close" aria-label="close">×</button>
      <span class="sk-tape" aria-hidden="true"></span>
      <h3 class="sk-modal-title" id="sk-title"></h3>
      <p class="sk-since"></p>
      <p class="sk-intro"></p>
      <ul class="sk-highlights"></ul>
      <span class="sk-corner" aria-hidden="true">★</span>
    </div>
  `;
  document.body.appendChild(overlay);

  const modal = overlay.querySelector<HTMLElement>('.sk-modal')!;
  const titleEl = overlay.querySelector<HTMLElement>('.sk-modal-title')!;
  const sinceEl = overlay.querySelector<HTMLElement>('.sk-since')!;
  const introEl = overlay.querySelector<HTMLElement>('.sk-intro')!;
  const ulEl = overlay.querySelector<HTMLElement>('.sk-highlights')!;
  const closeBtn = overlay.querySelector<HTMLButtonElement>('.sk-close')!;

  let active = false;
  let lastSource: HTMLElement | null = null;
  const open = (key: string, source?: HTMLElement) => {
    const d = data[key];
    if (!d) return;
    const localized = d[locale] ?? d.en;
    titleEl.textContent = d.title;
    sinceEl.textContent = (locale === 'pt' ? 'desde ' : 'since ') + d.since;
    introEl.textContent = localized.intro;
    ulEl.innerHTML = localized.highlights.map((h) => `<li>${h}</li>`).join('');
    overlay.classList.add('is-open');
    active = true;
    lastSource = source ?? null;
    document.querySelector('main')?.setAttribute('inert', '');
    if (source && !reduce) {
      const r = source.getBoundingClientRect();
      const dx = r.left + r.width / 2 - window.innerWidth / 2;
      const dy = r.top + r.height / 2 - window.innerHeight / 2;
      const anim = modal.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(0.15) rotate(-6deg)`, opacity: 0 },
          { transform: 'translate(0, 0) scale(1) rotate(-1.5deg)', opacity: 1 },
        ],
        { duration: 320, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' },
      );
      anim.onfinish = () => closeBtn.focus();
    } else {
      closeBtn.focus();
    }
  };
  const close = () => {
    if (lastSource && !reduce) {
      const r = lastSource.getBoundingClientRect();
      const dx = r.left + r.width / 2 - window.innerWidth / 2;
      const dy = r.top + r.height / 2 - window.innerHeight / 2;
      modal.animate(
        [
          { transform: 'translate(0, 0) scale(1) rotate(-1.5deg)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.15) rotate(-6deg)`, opacity: 0 },
        ],
        { duration: 220, easing: 'cubic-bezier(0.36, 0, 0.66, -0.56)', fill: 'forwards' },
      );
    }
    overlay.classList.remove('is-open');
    active = false;
    document.querySelector('main')?.removeAttribute('inert');
    lastSource?.focus?.();
    lastSource = null;
  };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (active && e.key === 'Escape') close();
  });

  document.querySelectorAll<HTMLElement>('.badge').forEach((b) => {
    const text = b.querySelector('.badge-text')?.textContent ?? '';
    const key = normalize(text);
    if (!data[key]) return;
    b.dataset.skillKey = key;
    b.style.cursor = 'pointer';
    b.setAttribute('role', 'button');
    b.setAttribute('tabindex', '0');
    b.addEventListener('click', () => open(key, b));
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(key, b);
      }
    });
  });

  if (reduce) modal.style.transitionDuration = '0.001ms';
};
