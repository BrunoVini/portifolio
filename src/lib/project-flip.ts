/**
 * Toggles a `.is-flipped` class on a `.proj-shell` when its `.flip-btn`
 * is clicked. Used to reveal the project's trade-off back card.
 */
export const initProjectFlip = (): void => {
  if (typeof document === 'undefined') return;
  document.querySelectorAll<HTMLButtonElement>('.flip-btn').forEach((btn) => {
    const shell = btn.closest<HTMLElement>('.proj-shell');
    const back = shell?.querySelector<HTMLElement>('.proj-back');
    if (!shell || !back) return;
    btn.addEventListener('click', () => {
      const flipped = shell.classList.toggle('is-flipped');
      btn.setAttribute('aria-pressed', flipped ? 'true' : 'false');
      back.setAttribute('aria-hidden', flipped ? 'false' : 'true');
    });
  });
};
