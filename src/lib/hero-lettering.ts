/**
 * Build-time geometry for the hero's hand-lettered headline
 * (src/components/hero/HeroHeadline.astro).
 *
 * Lays words out on a line using measured Caveat 700 advances (so the SVG
 * <text> elements can be pinned with textLength) and generates the zigzag
 * "pen scribble" mask strokes that reveal each word as they ink themselves
 * in. Pure functions — runs in the Astro frontmatter at build time.
 */

/* Caveat 700 advances (em), measured via canvas measureText. */
// prettier-ignore
const ADV: Record<string, number> = {
  a: 0.45, b: 0.44, c: 0.36, d: 0.4, e: 0.33, f: 0.3, g: 0.36, h: 0.47,
  i: 0.2, j: 0.21, k: 0.37, l: 0.18, m: 0.57, n: 0.46, o: 0.36, p: 0.38,
  q: 0.38, r: 0.36, s: 0.35, t: 0.33, u: 0.37, v: 0.33, w: 0.52, x: 0.34,
  y: 0.34, z: 0.32,
  A: 0.51, B: 0.52, C: 0.48, D: 0.59, E: 0.53, F: 0.47, G: 0.49, H: 0.57,
  I: 0.41, J: 0.32, K: 0.51, L: 0.43, M: 0.73, N: 0.62, O: 0.51, P: 0.47,
  Q: 0.49, R: 0.54, S: 0.5, T: 0.46, U: 0.48, V: 0.49, W: 0.72, X: 0.52,
  Y: 0.5, Z: 0.52,
  ' ': 0.24, '.': 0.2, ',': 0.2, '!': 0.2,
  'í': 0.19, 'ì': 0.19, 'î': 0.19,
  'ó': 0.36, 'ò': 0.36, 'ô': 0.36, 'õ': 0.36,
  'á': 0.45, 'à': 0.45, 'â': 0.45, 'ã': 0.45,
  'é': 0.33, 'ê': 0.33, 'ú': 0.37, 'ç': 0.36,
};

const charEm = (ch: string): number =>
  ADV[ch] ?? ADV[ch.normalize('NFD')[0]] ?? ADV[ch.toLowerCase()] ?? 0.4;

export const wordEm = (w: string): number => [...w].reduce((s, c) => s + charEm(c), 0);

export interface PlacedWord {
  word: string;
  x: number;
  w: number;
}

export interface LaidOutLine {
  placed: PlacedWord[];
  width: number;
}

/** Place a line's words left-to-right at the given font size (svg units). */
export const layoutLine = (line: string, fontSize: number): LaidOutLine => {
  const words = line.split(' ').filter(Boolean);
  let x = 0;
  const placed = words.map((word) => {
    const w = wordEm(word) * fontSize;
    const p = { word, x, w };
    x += w + 0.24 * fontSize;
    return p;
  });
  return { placed, width: x - 0.24 * fontSize };
};

export const r1 = (n: number): string => n.toFixed(1);

/**
 * Zigzag mask stroke covering one word's glyph box (ascenders + accents to
 * descenders), with horizontal overshoot on both sides so coverage never
 * clips a glyph. Drawn left-to-right, it reads as a pen writing the word.
 */
export const scribble = (x0: number, baseline: number, w: number, fontSize: number): string => {
  const over = 0.18 * fontSize;
  const yHi = baseline - 0.64 * fontSize;
  const yLo = baseline + 0.14 * fontSize;
  const x1 = x0 - over;
  const span = w + 2 * over;
  const n = Math.max(4, Math.round(span / (0.3 * fontSize)));
  let d = `M ${r1(x1)} ${r1(yLo)}`;
  for (let i = 1; i <= n; i++) {
    const x = x1 + (span * i) / n;
    d += ` L ${r1(x)} ${r1(i % 2 ? yHi : yLo)}`;
  }
  return d;
};
