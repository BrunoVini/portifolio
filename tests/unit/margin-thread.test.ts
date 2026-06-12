import { describe, expect, it, beforeEach } from 'vitest';
import { initMarginThread } from '../../src/lib/margin-thread';

const setMatchMedia = (matches: boolean): void => {
  (window as unknown as { matchMedia: (q: string) => { matches: boolean } }).matchMedia = () => ({
    matches,
  });
};

const buildThread = (): { thread: HTMLElement; mark: HTMLElement } => {
  const thread = document.createElement('div');
  thread.setAttribute('data-margin-thread', '');
  const mark = document.createElement('span');
  mark.className = 'thread-mark';
  mark.setAttribute('data-thread-mark', 'about');
  thread.appendChild(mark);
  document.body.appendChild(thread);

  const section = document.createElement('div');
  section.id = 'about';
  document.body.appendChild(section);
  return { thread, mark };
};

describe('initMarginThread', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    setMatchMedia(false);
  });

  it('does nothing when no thread is present', () => {
    expect(() => initMarginThread()).not.toThrow();
  });

  it('places marks and arms the thread when motion is allowed', () => {
    const { thread, mark } = buildThread();

    initMarginThread();

    expect(mark.classList.contains('is-placed')).toBe(true);
    expect(mark.style.getPropertyValue('--mark-top')).not.toBe('');
    expect(thread.classList.contains('thread-armed')).toBe(true);
    // jsdom has no scroll-driven animations → JS fallback path.
    expect(thread.classList.contains('thread-js') || thread.classList.contains('thread-css')).toBe(
      true,
    );
  });

  it('renders a static, fully inked thread under reduced motion', () => {
    setMatchMedia(true);
    const { thread, mark } = buildThread();

    initMarginThread();

    expect(thread.classList.contains('thread-armed')).toBe(false);
    expect(mark.classList.contains('is-placed')).toBe(true);
    expect(mark.classList.contains('is-inked')).toBe(true);
  });
});
