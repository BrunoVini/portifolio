import { describe, expect, it, beforeEach } from 'vitest';
import { initReveal } from '../../src/lib/reveal';

describe('initReveal', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('adds is-revealed when element intersects', () => {
    const el = document.createElement('div');
    el.setAttribute('data-reveal', '');
    document.body.appendChild(el);

    const observers: { cb: IntersectionObserverCallback }[] = [];
    class MockIO {
      cb: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb;
        observers.push(this);
      }
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
    (globalThis as unknown as { IntersectionObserver: typeof MockIO }).IntersectionObserver =
      MockIO;

    initReveal();
    expect(observers).toHaveLength(1);
    const entry = {
      isIntersecting: true,
      target: el,
    } as unknown as IntersectionObserverEntry;
    observers[0].cb([entry], observers[0] as unknown as IntersectionObserver);
    expect(el.classList.contains('is-revealed')).toBe(true);
  });

  it('does nothing when there are no [data-reveal] elements', () => {
    let count = 0;
    class MockIO {
      constructor() {
        count++;
      }
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
    (globalThis as unknown as { IntersectionObserver: typeof MockIO }).IntersectionObserver =
      MockIO;
    initReveal();
    expect(count).toBe(0);
  });
});
