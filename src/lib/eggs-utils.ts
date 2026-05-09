/**
 * Shared helpers for the easter-egg modules.
 * - `spawnConfetti(x, y)`: burst of 14 dots, recycled DOM, 800ms lifetime.
 * - `KeySequenceBuffer`: rolling-buffer match for typed words; ignores
 *   keystrokes that originate inside form fields, contenteditable nodes,
 *   or other elements that opt-out via `[data-no-key-egg]`.
 * - `prefersReducedMotion()`: live read of the user's preference.
 */

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

export const spawnConfetti = (x: number, y: number, count = 14): void => {
  const reduce = prefersReducedMotion();
  const n = reduce ? Math.min(4, count) : count;
  for (let i = 0; i < n; i++) {
    const dot = document.createElement('div');
    const a = (i / n) * Math.PI * 2;
    const r = 60 + Math.random() * 40;
    Object.assign(dot.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      width: '8px',
      height: '8px',
      background: i % 2 === 0 ? 'var(--color-red-ink)' : 'var(--color-highlight)',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '9998',
      transition: reduce
        ? 'opacity 0.4s ease'
        : 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s ease',
    });
    document.body.appendChild(dot);
    if (reduce) {
      requestAnimationFrame(() => {
        dot.style.opacity = '0';
      });
    } else {
      requestAnimationFrame(() => {
        dot.style.transform = `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px) scale(0.4)`;
        dot.style.opacity = '0';
      });
    }
    setTimeout(() => dot.remove(), reduce ? 500 : 800);
  }
};

const isFormishTarget = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  if (el.closest('input, textarea, select, [contenteditable="true"], [data-no-key-egg]'))
    return true;
  return false;
};

/**
 * Tracks the last `length` printable keystrokes (lowercased) and fires a
 * callback when they spell `word`. Backspace shortens the buffer.
 */
export class KeySequenceBuffer {
  private buf = '';
  private listener?: (e: KeyboardEvent) => void;

  constructor(
    private readonly word: string,
    private readonly onMatch: (e: KeyboardEvent) => void,
  ) {}

  attach(target: Document | HTMLElement = document): void {
    const w = this.word.toLowerCase();
    const len = w.length;
    this.listener = (e: KeyboardEvent) => {
      if (isFormishTarget(e.target)) return;
      if (e.key === 'Backspace') {
        this.buf = this.buf.slice(0, -1);
        return;
      }
      if (e.key.length !== 1) return;
      this.buf = (this.buf + e.key.toLowerCase()).slice(-len);
      if (this.buf === w) {
        this.buf = '';
        this.onMatch(e);
      }
    };
    target.addEventListener('keydown', this.listener as EventListener);
  }
}

/**
 * Tracks an exact arrow/key sequence (e.g. Konami). Resets on completion.
 */
export class KeyArraySequenceBuffer {
  private buf: string[] = [];
  private listener?: (e: KeyboardEvent) => void;

  constructor(
    private readonly seq: string[],
    private readonly onMatch: (e: KeyboardEvent) => void,
  ) {}

  attach(target: Document | HTMLElement = document): void {
    this.listener = (e: KeyboardEvent) => {
      if (isFormishTarget(e.target)) return;
      this.buf.push(e.key);
      if (this.buf.length > this.seq.length) this.buf.shift();
      if (this.buf.length === this.seq.length && this.buf.every((k, i) => k === this.seq[i])) {
        this.buf = [];
        this.onMatch(e);
      }
    };
    target.addEventListener('keydown', this.listener as EventListener);
  }
}
