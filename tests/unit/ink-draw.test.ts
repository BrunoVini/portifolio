import { describe, expect, it, beforeEach, vi } from 'vitest';
import { initInkDraw } from '../../src/lib/ink-draw';

const SVG_NS = 'http://www.w3.org/2000/svg';

const makeSvg = (attrs: Record<string, string>, paths = 2): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, 'svg');
  Object.entries(attrs).forEach(([k, v]) => svg.setAttribute(k, v));
  for (let i = 0; i < paths; i++) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M 0 0 L 10 10');
    svg.appendChild(path);
  }
  document.body.appendChild(svg);
  return svg;
};

interface MockEntry {
  cb: IntersectionObserverCallback;
}

const installMockIO = (): MockEntry[] => {
  const observers: MockEntry[] = [];
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
  (globalThis as unknown as { IntersectionObserver: typeof MockIO }).IntersectionObserver = MockIO;
  return observers;
};

const setMatchMedia = (matches: boolean): void => {
  (window as unknown as { matchMedia: (q: string) => { matches: boolean } }).matchMedia = () => ({
    matches,
  });
};

describe('initInkDraw', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    setMatchMedia(false);
  });

  it('measures strokes and plays them when the root enters the viewport', () => {
    const observers = installMockIO();
    const svg = makeSvg({ 'data-ink': 'enter' });

    initInkDraw();

    const strokes = Array.from(svg.querySelectorAll('path'));
    strokes.forEach((s) => {
      expect(s.classList.contains('ink-stroke')).toBe(true);
      expect(s.style.getPropertyValue('--ink-len')).not.toBe('');
    });
    expect(observers).toHaveLength(1);

    const entry = { isIntersecting: true, target: svg } as unknown as IntersectionObserverEntry;
    observers[0].cb([entry], observers[0] as unknown as IntersectionObserver);
    strokes.forEach((s) => expect(s.classList.contains('ink-play')).toBe(true));
  });

  it('staggers strokes in DOM order when data-ink-stagger is set', () => {
    installMockIO();
    const svg = makeSvg({
      'data-ink': 'enter',
      'data-ink-delay': '400',
      'data-ink-stagger': '100',
    });

    initInkDraw();

    const [a, b] = Array.from(svg.querySelectorAll('path'));
    expect(a.style.getPropertyValue('--ink-delay')).toBe('400ms');
    expect(b.style.getPropertyValue('--ink-delay')).toBe('500ms');
  });

  it('honours explicit data-ink-order over DOM order', () => {
    installMockIO();
    const svg = makeSvg({ 'data-ink': 'enter', 'data-ink-stagger': '100' });
    svg.querySelectorAll('path')[0].setAttribute('data-ink-order', '5');

    initInkDraw();

    const [a, b] = Array.from(svg.querySelectorAll('path'));
    expect(a.style.getPropertyValue('--ink-delay')).toBe('500ms');
    expect(b.style.getPropertyValue('--ink-delay')).toBe('100ms');
  });

  it('uses the scrubbed scroll path when scroll-driven animations are supported', () => {
    installMockIO();
    vi.stubGlobal('CSS', { supports: () => true });
    const svg = makeSvg({ 'data-ink': 'scroll' });

    initInkDraw();

    expect(svg.classList.contains('ink-view-host')).toBe(true);
    svg
      .querySelectorAll('path')
      .forEach((s) => expect(s.classList.contains('ink-scrub')).toBe(true));
    vi.unstubAllGlobals();
  });

  it('is a no-op under prefers-reduced-motion (strokes stay fully drawn)', () => {
    const observers = installMockIO();
    setMatchMedia(true);
    const svg = makeSvg({ 'data-ink': 'enter' });

    initInkDraw();

    expect(observers).toHaveLength(0);
    svg
      .querySelectorAll('path')
      .forEach((s) => expect(s.classList.contains('ink-stroke')).toBe(false));
  });
});
