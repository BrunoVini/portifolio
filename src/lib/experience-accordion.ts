/**
 * Single-open accordion for the experience timeline. Clicking a closed item
 * opens it and closes the previously-open sibling. The currently-active role
 * (server-rendered with .is-open) stays open by default; users can collapse
 * it by clicking it again. ARIA aria-expanded is kept in sync.
 */
export const initExperienceAccordion = (): void => {
  if (typeof document === 'undefined') return;
  const items = Array.from(
    document.querySelectorAll<HTMLElement>('[data-accordion-item]'),
  );
  if (items.length === 0) return;

  const setOpen = (item: HTMLElement, open: boolean) => {
    item.classList.toggle('is-open', open);
    const toggle = item.querySelector<HTMLButtonElement>('[data-accordion-toggle]');
    toggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  items.forEach((item) => {
    const toggle = item.querySelector<HTMLButtonElement>('[data-accordion-toggle]');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      if (isOpen) {
        setOpen(item, false);
        return;
      }
      items.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          setOpen(other, false);
        }
      });
      setOpen(item, true);
    });
  });
};
