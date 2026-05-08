import { describe, expect, it } from 'vitest';
import { assetUrl } from '../../src/lib/asset';

describe('assetUrl', () => {
  it('joins base + path with exactly one slash between them', () => {
    expect(assetUrl('/foo.svg', '/portifolio')).toBe('/portifolio/foo.svg');
    expect(assetUrl('foo.svg', '/portifolio')).toBe('/portifolio/foo.svg');
    expect(assetUrl('/foo.svg', '/portifolio/')).toBe('/portifolio/foo.svg');
    expect(assetUrl('foo.svg', '/portifolio/')).toBe('/portifolio/foo.svg');
  });

  it('handles nested paths', () => {
    expect(assetUrl('/companies/arancia.svg', '/portifolio')).toBe(
      '/portifolio/companies/arancia.svg',
    );
  });

  it('handles empty base (root deploy)', () => {
    expect(assetUrl('/foo.svg', '')).toBe('/foo.svg');
    expect(assetUrl('/foo.svg', '/')).toBe('/foo.svg');
  });
});
