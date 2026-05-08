import { describe, expect, it } from 'vitest';
import { canFlip, flipStrengthFor } from '../../src/lib/page-flip';

describe('flipStrengthFor', () => {
  it('returns full strength on desktop', () => {
    expect(flipStrengthFor(1200, false)).toEqual({ angle: 95, duration: 700 });
  });

  it('returns medium strength on tablet (600–979)', () => {
    expect(flipStrengthFor(800, false)).toEqual({ angle: 70, duration: 520 });
  });

  it('returns gentle strength on mobile (<600)', () => {
    expect(flipStrengthFor(360, false)).toEqual({ angle: 35, duration: 380 });
  });

  it('returns null when reduced motion is preferred', () => {
    expect(flipStrengthFor(1200, true)).toBeNull();
    expect(flipStrengthFor(360, true)).toBeNull();
  });
});

describe('canFlip', () => {
  it('mirrors flipStrengthFor truthiness', () => {
    expect(canFlip(1200, false)).toBe(true);
    expect(canFlip(360, false)).toBe(true);
    expect(canFlip(1200, true)).toBe(false);
  });
});
