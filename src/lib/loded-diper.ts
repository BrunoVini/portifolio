/**
 * Loded Diper — Rodrick's band sticker (Wimpy Kid easter egg). Pinned to
 * the bottom-left of the viewport. Click triggers a brief screen "screech"
 * (body shake). Reduced-motion: button still works, just no shake.
 */
import { prefersReducedMotion } from './eggs-utils';
import { unlock } from './achievements';

export const initLodedDiper = (): void => {
  if (typeof document === 'undefined') return;
  const sticker = document.createElement('div');
  sticker.className = 'loded-diper';
  sticker.textContent = 'LODED DIPER';
  sticker.setAttribute('role', 'button');
  sticker.setAttribute('tabindex', '0');
  sticker.setAttribute('aria-label', 'Loded Diper — World Tour');
  sticker.setAttribute('data-no-key-egg', 'true');
  document.body.appendChild(sticker);
  const screech = () => {
    unlock('loded-diper');
    if (prefersReducedMotion()) return;
    document.body.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-2px)' },
        { transform: 'translateX(2px)' },
        { transform: 'translateX(-1px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 320 },
    );
  };
  sticker.addEventListener('click', screech);
  sticker.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      screech();
    }
  });
};
