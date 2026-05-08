import { describe, expect, it } from 'vitest';
import { tiltAngles } from '../../src/lib/tilt';

const rect = { left: 0, top: 0, width: 200, height: 100 };

describe('tiltAngles', () => {
  it('returns zero tilt when pointer is at the center', () => {
    expect(tiltAngles(100, 50, rect)).toEqual({ rx: -0, ry: 0 });
  });

  it('tilts right when pointer is to the right edge', () => {
    const { ry } = tiltAngles(200, 50, rect);
    expect(ry).toBeCloseTo(8, 5);
  });

  it('tilts up when pointer is at the top edge', () => {
    const { rx } = tiltAngles(100, 0, rect);
    expect(rx).toBeCloseTo(8, 5);
  });

  it('clamps to MAX_DEG when pointer is well outside the rect', () => {
    const { rx, ry } = tiltAngles(10000, -10000, rect);
    expect(ry).toBe(8);
    expect(rx).toBe(8);
  });
});
